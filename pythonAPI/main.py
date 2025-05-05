from pydantic import BaseModel
from typing import List
import re
import json
import time
import jwt
import os
import requests
from fastapi import FastAPI
from apify_client import ApifyClient
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

APIFY_TOKEN = os.getenv("APIFY_TOKEN")  # ✅ Move token to .env
OPENAI_KEY = os.getenv("OPENAI_KEY")
KLING_AK = os.getenv("KLING_AK")
KLING_SK = os.getenv("KLING_SK")

client = OpenAI(api_key=OPENAI_KEY)
app = FastAPI()


class Image2VideoRequest(BaseModel):
    image_url: str
    prompt: str


class TrendRequest(BaseModel):
    hashtag: str
    industry: str
    tone: str


class TemplateRequest(BaseModel):
    business_name: str
    industry: str
    target_audience: str
    goal: str
    tone: str
    hashtag: str


class TemplateInput(BaseModel):
    template_text: str


def encode_jwt_token(ak, sk):
    headers = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "iss": ak,
        "exp": int(time.time()) + 1800,
        "nbf": int(time.time()) - 5
    }
    return jwt.encode(payload, sk, algorithm="HS256", headers=headers)


KLING_TOKEN = encode_jwt_token(KLING_AK, KLING_SK)


def safe_parse_json(raw: str):
    try:
        return json.loads(raw)
    except:
        return {
            "suggestedScript": "Use trending sound with visuals",
            "visualTips": "Use good lighting and engaging visuals"
        }


@app.post("/instagram")
def instagram_trends(req: TrendRequest):
    hashtag = re.sub(r'\W+', '', req.hashtag)
    client_apify = ApifyClient(APIFY_TOKEN)

    run_input = {
        "hashtags": [hashtag],
        "resultsLimit": 10,
        "resultsType": "posts"
    }
    run = client_apify.actor("apify/instagram-hashtag-scraper").call(run_input=run_input)

    results = []
    for i, item in enumerate(client_apify.dataset(run["defaultDatasetId"]).iterate_items(), 1):
        caption = item.get("caption", "")
        image = item.get("url", "")

        prompt = f"""
        Hashtag: #{hashtag}
        Industry: {req.industry}
        Brand tone: {req.tone}
        Caption: {caption}

        Format:
        {{
          "suggestedScript": "...",
          "visualTips": "..."
        }}
        """

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a marketing expert."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        gpt = safe_parse_json(response.choices[0].message.content.strip())

        trend = {
            "id": str(i),
            "trend": f"#{hashtag}",
            "type": "instagram",
            "image": image,
            "hashtags": [f"#{hashtag}"],
            "engagement": "High",
            "difficulty": "Medium",
            "fullDescription": caption,
            "whyItWorks": "The post connects emotionally or visually with the target audience.",
            "suggestedScript": gpt.get("suggestedScript"),
            "visualTips": gpt.get("visualTips"),
            "bestPractices": [
                "Use trending audio",
                "Keep it short and vertical",
                "Include a CTA or hashtag"
            ]
        }
        results.append(trend)
        if len(results) >= 10:
            break
    return {"data": results}


@app.post("/tiktok")
def tiktok_trends(req: TrendRequest):
    hashtag = re.sub(r'\W+', '', req.hashtag)
    client_apify = ApifyClient(APIFY_TOKEN)

    run_input = {
        "hashtags": [hashtag],
        "resultsPerPage": 100,
        "proxyCountryCode": "US"
    }
    run = client_apify.actor("apify/tiktok-scraper").call(run_input=run_input)  # ✅ switched from clockworks

    results = []
    for i, item in enumerate(client_apify.dataset(run["defaultDatasetId"]).iterate_items(), 1):
        desc = item.get("text", "")
        url = item.get("webVideoUrl", "")

        prompt = f"""
        Hashtag: #{hashtag}
        Industry: {req.industry}
        Brand tone: {req.tone}
        Description: {desc}

        Format:
        {{
          "suggestedScript": "...",
          "visualTips": "..."
        }}
        """

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Return valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=200
        )
        gpt = safe_parse_json(response.choices[0].message.content.strip())

        trend = {
            "id": str(i),
            "trend": f"#{hashtag}",
            "type": "tiktok",
            "image": url,
            "hashtags": [f"#{hashtag}"],
            "engagement": "High",
            "difficulty": "Medium",
            "fullDescription": desc,
            "whyItWorks": "People love practical or visually pleasing content, especially around popular topics.",
            "suggestedScript": gpt.get("suggestedScript"),
            "visualTips": gpt.get("visualTips"),
            "bestPractices": [
                "Use trending audio",
                "Keep video under 30s",
                "Include a CTA at the end"
            ]
        }
        results.append(trend)
        if len(results) >= 10:
            break
    return {"data": results}


@app.post("/generate-template")
def generate_video_template(data: TemplateRequest):
    def fetch_instagram_trends(hashtag):
        client_apify = ApifyClient(APIFY_TOKEN)
        run = client_apify.actor("apify/instagram-hashtag-scraper").call(
            run_input={"hashtags": [hashtag], "resultsLimit": 10, "resultsType": "posts"}
        )
        return [(item.get("caption", ""), item.get("likesCount", 0)) for item in client_apify.dataset(run["defaultDatasetId"]).iterate_items()][:5]

    def fetch_tiktok_trends(hashtag):
        client_apify = ApifyClient(APIFY_TOKEN)
        run = client_apify.actor("apify/tiktok-scraper").call(
            run_input={"hashtags": [hashtag], "resultsPerPage": 10, "proxyCountryCode": "US"}
        )
        return [(item.get("text", ""), item.get("diggCount", 0)) for item in client_apify.dataset(run["defaultDatasetId"]).iterate_items()][:5]

    insta_trends = fetch_instagram_trends(data.hashtag)
    tiktok_trends = fetch_tiktok_trends(data.hashtag)

    insta_text = "\n".join([f"- {cap} (likes: {like})" for cap, like in insta_trends])
    tiktok_text = "\n".join([f"- {desc} (likes: {like})" for desc, like in tiktok_trends])

    prompt = f'''
Business: "{data.business_name}" in the "{data.industry}" industry.
Target audience: {data.target_audience}
Marketing goal: {data.goal}
Brand tone: {data.tone}

Here are popular Instagram posts:
{insta_text}

Here are trending TikTok videos:
{tiktok_text}

Now:
1. Suggest 1 original TikTok/Instagram video or post idea tailored for this business.
2. Create a reusable video template for one idea.

Only return the final video template, and make sure it is concise and suitable for a maximum video duration of 10 seconds.
'''

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a marketing expert."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000,
        temperature=0.7
    )
    return {"template_text": response.choices[0].message.content}


@app.post("/generate-video")
def generate_video_from_template(data: TemplateInput):
    headers = {
        "Authorization": f"Bearer {KLING_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "prompt": data.template_text,
        "duration": 10,
        "ratio": "9:16"
    }
    response = requests.post("https://api.klingai.com/v1/videos/text2video", headers=headers, json=payload)
    if response.status_code != 200:
        return {"error": "Video generation failed", "details": response.text}

    task_id = response.json()['data']['task_id']
    status_url = f"https://api.klingai.com/v1/videos/text2video/{task_id}"

    while True:
        status_resp = requests.get(status_url, headers=headers)
        status_data = status_resp.json().get('data', {})
        status = status_data.get('task_status')

        if status == 'succeed':
            video_url = status_data.get('task_result', {}).get('videos', [{}])[0].get('url')
            return {"video_url": video_url}
        elif status == 'failed':
            return {"error": "Video task failed"}
        time.sleep(5)


@app.post("/generate-image-video")
def generate_video_from_image(data: Image2VideoRequest):
    headers = {
        "Authorization": f"Bearer {KLING_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "model_name": "kling-v1",
        "mode": "pro",
        "duration": "5",
        "image": data.image_url,
        "prompt": data.prompt,
        "cfg_scale": 0.5
    }

    response = requests.post("https://api.klingai.com/v1/videos/image2video", headers=headers, json=payload)

    if response.status_code != 200:
        return {"error": "Failed to create video task", "details": response.text}

    task_id = response.json()["data"]["task_id"]
    status_url = f"https://api.klingai.com/v1/videos/image2video/{task_id}"

    while True:
        status_resp = requests.get(status_url, headers=headers)
        status_data = status_resp.json().get('data', {})
        status = status_data.get('task_status')

        if status == 'succeed':
            video_url = status_data.get('task_result', {}).get('videos', [{}])[0].get('url')
            return {"video_url": video_url}
        elif status == 'failed':
            return {"error": "Video generation task failed"}
        time.sleep(5)
