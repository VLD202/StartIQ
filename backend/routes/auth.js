const express = require("express");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();
const AUTH_SECRET =
  process.env.AUTH_SECRET || "startiq-jwt-dev-secret-super-secure-2026";
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Helper: Hash password with salt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Helper: Verify password
function verifyPassword(password, storedHash) {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

// Helper: Create signed session token (base64url payload + signature)
function createToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    exp: Date.now() + TOKEN_EXPIRY_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${signature}`;
}

// Helper: Verify signed token
function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadB64)
    .digest("base64url");
  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    )
  ) {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    );
    if (payload.exp && payload.exp < Date.now()) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

// POST /signup -> Register new user
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        error: "Please provide your full name (minimum 2 characters).",
      });
    }

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address." });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await db.getUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists. Please log in.",
      });
    }

    const passwordHash = hashPassword(password);
    const newUser = await db.createUser(
      name.trim(),
      normalizedEmail,
      passwordHash,
    );
    const token = createToken(newUser);

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    console.error("[Auth /signup] Error:", err);
    return res
      .status(500)
      .json({ error: "Failed to create account.", details: err.message });
  }
});

// POST /login -> Authenticate existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.getUserByEmail(normalizedEmail);

    if (!user || !verifyPassword(password, user.password_hash)) {
      return res
        .status(401)
        .json({ error: "Invalid email or password. Please try again." });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Logged in successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("[Auth /login] Error:", err);
    return res
      .status(500)
      .json({ error: "Authentication failed.", details: err.message });
  }
});

// GET /me -> Verify token and fetch profile
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or malformed Authorization header." });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        error: "Session expired or invalid token. Please log in again.",
      });
    }

    const user = await db.getUserById(payload.id);
    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("[Auth /me] Error:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch user session.", details: err.message });
  }
});

module.exports = router;
