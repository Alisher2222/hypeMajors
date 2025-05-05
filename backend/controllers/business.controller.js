import pool from "../config/db.js";

export const createBusiness = async (req, res) => {
  try {
    const {
      user_id,
      businessName: business_name,
      industry,
      instagramHashtag: instagram_hashtag,
      targetAudience: target_audience,
      marketingGoal: marketing_goal,
      brandTone: brand_tone,
      instagramUsername: instagram_username,
      tiktokUsername: tiktok_username,
      location,
    } = req.body;

    if (
      !business_name ||
      !industry ||
      !instagram_hashtag ||
      !target_audience ||
      !marketing_goal ||
      !brand_tone ||
      !location
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [existingBusiness] = await pool.query(
      "SELECT id FROM businesses WHERE business_name = ?",
      [business_name]
    );

    if (existingBusiness.length !== 0) {
      return res
        .status(401)
        .json({ error: "Business with this name already exists!" });
    }

    const [result] = await pool.query(
      `INSERT INTO businesses (
        business_name, industry, instagram_hashtag,
        target_audience, marketing_goal, brand_tone,
        instagram_username, tiktok_username, user_id, location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        business_name,
        industry,
        instagram_hashtag,
        target_audience,
        marketing_goal,
        brand_tone,
        instagram_username,
        tiktok_username,
        user_id,
        location,
      ]
    );

    const [businessRows] = await pool.query(
      "SELECT * FROM businesses WHERE id = ?",
      [result.insertId]
    );
    const business = businessRows[0];

    res.status(201).json({
      message: "Business successfully created!",
      business: business,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getBusiness = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const [businessRows] = await pool.query(
      "SELECT * FROM businesses WHERE user_id = ?",
      [userId]
    );

    if (businessRows.length === 0) {
      return res.status(404).json({ error: "Business not found" });
    }

    const business = businessRows[0];
    res.status(200).json({ business });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const {
      businessName: business_name,
      industry,
      instagramHashtag: instagram_hashtag,
      targetAudience: target_audience,
      marketingGoal: marketing_goal,
      brandTone: brand_tone,
    } = req.body;

    const [result] = await pool.query(
      "UPDATE businesses SET business_name = ?, industry = ?, instagram_hashtag = ?, target_audience = ?, marketing_goal = ?, brand_tone = ? WHERE id = ?",
      [
        business_name,
        industry,
        instagram_hashtag,
        target_audience,
        marketing_goal,
        brand_tone,
        businessId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Business not found" });
    }

    res.status(200).json({ message: "Business updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const [result] = await pool.query("DELETE FROM businesses WHERE id = ?", [
      businessId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Business not found" });
    }

    res.status(200).json({ message: "Business deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
