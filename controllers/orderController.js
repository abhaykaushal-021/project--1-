const User = require("../models/userModels");  // your existing schema

// ── $gt, $lt, $gte, $lte ──────────────────────────────

const getUsersByAge = async (req, res) => {
  try {
    const { min, max } = req.query;

    const users = await User.find({
      age: {
        $gte: Number(min),
        $lte: Number(max),
      },
    });

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── $in, $ne ──────────────────────────────────────────
// GET /orders/by-city
const getUsersByCity = async (req, res) => {
  try {
    const users = await User.find({
      city: {
        $in: ["Delhi", "Mumbai", "Bangalore"],
        $ne: "Chennai",
      },
    });

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── $and ──────────────────────────────────────────────

const getFilteredUsers = async (req, res) => {
  try {
    const { min = 0, max = 100, city } = req.query;

    const users = await User.find({
      $and: [
        { age: { $gt: Number(min) } },
        { age: { $lt: Number(max) } },
        { city: city },
      ],
    });

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── $or ───────────────────────────────────────────────

const searchUsers = async (req, res) => {
  try {
    const { name, city } = req.query;

    const users = await User.find({
      $or: [
        { name: { $regex: name, $options: "i" } },
        { city: { $regex: city, $options: "i" } },
      ],
    });

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsersByAge,
  getUsersByCity,
  getFilteredUsers,
  searchUsers,
};