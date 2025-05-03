import pool from "../config/db.js";
import { generateToken } from "../utilis/generateToken.js";
import { hashPassword } from "../utilis/hashPassword.js";
import bcrypt from "bcryptjs";
export const register = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Missing email or password" });

    const hashedPassword = await hashPassword(password);

    const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length !== 0)
      return res
        .status(401)
        .json({ error: "User with such email already exists!" });

    const [result] = await pool.query(
      "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)",
      [name, surname, email, hashedPassword]
    );
    const { accessToken, refreshToken } = await generateToken(email);

    const [userRows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = userRows[0];

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    res.status(201).json({
      message: "User successfully registered!",
      token: accessToken,
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      "SELECT password FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0)
      return res.status(400).json({ error: "email or password is invalid" });

    const hashedPassword = rows[0].password;
    const isCorrect = await bcrypt.compare(password, hashedPassword);
    if (!isCorrect) {
      return res.status(400).json({ error: "password is invalid" });
    }
    const { accessToken, refreshToken } = await generateToken(email);
    const [userRows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = userRows[0];
    console.log(user);
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    res.status(201).json({ token: accessToken, user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", { httpOnly: true, security: false });
    res.status(200).json({ message: "successfully logouted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
