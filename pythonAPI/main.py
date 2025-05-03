from pydantic import BaseModel
from typing import List
import re
import json
from apify_client import ApifyClient
import openai
from fastapi import FastAPI, Query
from dotenv import load_dotenv
import os



load_dotenv()
APIFY_TOKEN = os.getenv("APIFY_TOKEN")
OPENAI_KEY = os.getenv("OPENAI_KEY")
openai.api_key = OPENAI_KEY
print("🔐 Используемый APIFY_TOKEN:", APIFY_TOKEN)


app = FastAPI()


# Request model
class TrendRequest(BaseModel):
    hashtag: str
    industry: str
    tone: str

# --- Utility Functions ---
def safe_parse_json(raw: str):
    try:
        return json.loads(raw)
    except:
        return {
            "suggestedScript": "Use trending sound with visuals",
            "visualTips": "Use good lighting and engaging visuals"
        }

# --- Instagram Handler ---
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
        likes = item.get("likesCount", 0)
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

        response = openai.chat.completions.create(
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
            "type": "instagram",
            "image": image,
            "hashtags": [f"#{hashtag}"],
            "engagement": "High",
            "difficulty": "Medium",
            "fullDescription": caption,
            "whyItWorks": "The post connects emotionally or visually with the target audience.",
            "suggestedScript": gpt.get("suggestedScript", "Start with a hook and end with a CTA."),
            "visualTips": gpt.get("visualTips", "Film in natural light with smooth transitions."),
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

# --- TikTok Handler ---
@app.post("/tiktok")
def tiktok_trends(req: TrendRequest):
    hashtag = re.sub(r'\W+', '', req.hashtag)
    client_apify = ApifyClient(APIFY_TOKEN)

    run_input = {
        "hashtags": [hashtag],
        "resultsPerPage": 100,
        "proxyCountryCode": "US"
    }
    run = client_apify.actor("clockworks/tiktok-scraper").call(run_input=run_input)

    results = []
    for i, item in enumerate(client_apify.dataset(run["defaultDatasetId"]).iterate_items(), 1):
        desc = item.get("text", "")
        likes = item.get("diggCount", 0)
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

        response = openai.chat.completions.create(
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
            "suggestedScript": gpt.get("suggestedScript", "Start with a product problem, end with a visual solution."),
            "visualTips": gpt.get("visualTips", "Use close-ups, good lighting, and clean transitions."),
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

print("🔐 Используемый APIFY_TOKEN:", APIFY_TOKEN)

