import express from "express";
import client from "../server/db.js";
import { searchesTable } from "../config/db-config.js";

const searchRouter = express.Router();

// Add a search keyword and/or email
searchRouter.post("/", async (req, res) => {
  try {
    const { keyword, email } = req.body;

    // search for emails subscribed to certain keyword
    const search = await client.query(
      `SELECT emails
       FROM ${searchesTable}
       WHERE keyword = $1`,
      [keyword]
    );

    if (search.rows.length == 1) {
      // subscribe user to keyword notification if they aren't already subscribed to it
      if (!search.rows[0].emails.includes(email)) {
        const item = await client.query(
          `UPDATE ${searchesTable}
          SET emails = array_append(emails, $1)
          WHERE keyword = $2 
          RETURNING *`,
          [email, keyword]
        );
        res.status(201).json(item.rows[0]);
        console.log("updated subscribers of", keyword);
      } else {
        res.json("email already subscribed to keyword");
      }
    } else {
      // keyword doesn't exist in table yet, add new row
      const item = await client.query(
        `INSERT INTO ${searchesTable} (keyword, emails) VALUES($1, $2) RETURNING *`,
        [keyword, [email]]
      );
      console.log("inserted new row");
      res.json(item.rows[0]);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Remove user's keyword subscription
searchRouter.delete("/", async (req, res) => {
  try {
    const { keyword, email } = req.body;

    const updatedSubscription = await client.query(
      `UPDATE ${searchesTable} 
         SET emails = array_remove(emails, $1) 
         WHERE keyword = $2 
         RETURNING *`,
      [email, keyword]
    );

    if (updatedSubscription.rowCount === 0) {
      return res.status(404).json({ message: "keyword not found" });
    }

    res.json(updatedSubscription.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Find all keywords that user is subscribed to
searchRouter.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const keywords = await client.query(
      `SELECT keyword
      FROM ${searchesTable}
      WHERE $1 = ANY(emails);`,
      [email]
    );

    const keywordList = keywords.rows.map((row) => row.keyword);
    res.json(keywordList);
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error.message);
  }
});

export default searchRouter;
