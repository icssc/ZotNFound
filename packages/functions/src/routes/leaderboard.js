const express = require("express");
const leaderboardRouter = express.Router();
const middleware = require("../middleware/index.js");
const { leaderboardTable } = require("../config/db-config.js");

const client = require("../server/db");

// add a user to leaderboard
leaderboardRouter.post("/", middleware.decodeToken, async (req, res) => {
  try {
    const { email, points } = req.body; // Get email and points from request body

    if (!email || !points) {
      return res.status(400).send("Email and points are required");
    }

    await client.query(
      `INSERT INTO ${leaderboardTable} (email, points) VALUES ($1, $2)`,
      [email, points]
    );

    res.status(201).send("User added to leaderboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// get all users on leaderboard (descending)
leaderboardRouter.get("/", async (req, res) => {
  try {

    const lbData = await client.query(
      `SELECT * FROM ${leaderboardTable} ORDER BY points DESC LIMIT 3`
    );

    res.json(lbData.rows);
  } catch (error) {
    console.log(error);
  }
});

// get count of users in leaderboard
leaderboardRouter.get("/count", async (req, res) => {
  try {

    const lbCount = await client.query(
      `SELECT COUNT(*) as count FROM ${leaderboardTable}`
    );

    // Extract the count from the first row of the result set
    const count = lbCount.rows[0].count;
    // Send the count as a plain text response
    res.header("Content-Type", "text/plain");
    res.send(count.toString());
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

leaderboardRouter.patch(
  "/changeSubscription",
  middleware.decodeToken,
  async (req, res) => {
    try {
      const { subscription, email } = req.body;
      if (subscription === undefined) {
        return res.status(400).send("Unsubscribe action is unknown");
      }

      await client.query(
        `UPDATE ${leaderboardTable} SET subscription=$1 WHERE email=$2`,
        [subscription, email]
      );

      res.send("Subscription updated successfully!");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  }
);

// update user's points
leaderboardRouter.put("/", middleware.decodeToken, async (req, res) => {
  const { email, pointsToAdd } = req.body; // Assume you're sending email and pointsToAdd in the request body

  if (!email || typeof pointsToAdd !== "number") {
    return res.status(400).send("Invalid request parameters");
  }

  try {

    // First, fetch the current points of the user
    const currentPointsResult = await client.query(
      `SELECT points FROM ${leaderboardTable} WHERE email=$1`,
      [email]
    );


    if (currentPointsResult.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const currentPoints = currentPointsResult.rows[0].points;
    const newPoints = currentPoints + pointsToAdd;


    // Now, update the user's points in the leaderboard
    await client.query(
      `UPDATE ${leaderboardTable} SET points=$1 WHERE email=$2`,
      [newPoints, email]
    );

    res.send("Points updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// delete user from leaderboard
leaderboardRouter.delete("/:id", middleware.decodeToken, async (req, res) => {
  try {
    const { id } = req.params; // Extract id from request body
    if (!id) {
      return res.status(400).send("id is required");
    }

    await client.query(`DELETE FROM ${leaderboardTable} WHERE id=$1`, [id]);

    res.status(200).send("User deleted from leaderboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = leaderboardRouter;
