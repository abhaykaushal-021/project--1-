const express = require("express");
const router = express.Router();

const {
  getUsersByAge,
  getUsersByCity,
  getFilteredUsers,
  searchUsers,
} = require("../controllers/orderController");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order queries using MongoDB operators
 */

/**
 * @swagger
 * /orders/by-age:
 *   get:
 *     summary: Get orders by age range ($gte, $lte)
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: min
 *         schema: { type: number }
 *         description: "age >= min  ($gte)"
 *       - in: query
 *         name: max
 *         schema: { type: number }
 *         description: "age <= max  ($lte)"
 *     responses:
 *       200:
 *         description: Orders within the age range
 */
router.get("/by-age", getUsersByAge);

/**
 * @swagger
 * /orders/by-city:
 *   get:
 *     summary: Get orders by city ($in, $ne)
 *     tags: [Orders]
 *     description: Returns orders from Delhi, Mumbai, Bangalore ($in) — excluding Chennai ($ne)
 *     responses:
 *       200:
 *         description: Orders filtered by city
 */
router.get("/by-city", getUsersByCity);

/**
 * @swagger
 * /orders/filter:
 *   get:
 *     summary: Get orders using $and (age range + city)
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: min
 *         schema: { type: number, default: 0 }
 *         description: "age > min  ($gt)"
 *       - in: query
 *         name: max
 *         schema: { type: number, default: 100 }
 *         description: "age < max  ($lt)"
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *         description: Exact city match
 *     responses:
 *       200:
 *         description: Orders matching all conditions
 */
router.get("/filter", getFilteredUsers);

/**
 * @swagger
 * /orders/search:
 *   get:
 *     summary: Search orders by name or city ($or)
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *         description: Partial name search (case-insensitive)
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *         description: Exact city match
 *     responses:
 *       200:
 *         description: Orders matching name OR city
 */
router.get("/search", searchUsers);

module.exports = router;