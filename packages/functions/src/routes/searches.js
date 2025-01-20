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
       [keyword]);

    if (search.rows.length == 1){
      // subscribe user to keyword notification if they aren't already subscribed to it
      if (!search.rows[0].emails.includes(email)){
        const item = await client.query(
          `UPDATE ${searchesTable}
          SET emails = array_append(emails, $1)
          WHERE keyword = $2 
          RETURNING *`, 
          [email, keyword]);
        res.json(item.rows[0]);
        console.log("updated subscribers of", keyword);
      }
      else {
        res.json("email already subscribed to keyword");
      }
    } else { // keyword doesn't exist in table yet, add new row
      const item = await client.query(
        `INSERT INTO ${searchesTable} (keyword, emails) VALUES($1, $2) RETURNING *`,
        [keyword, [email]]
      );
      console.log("inserted new row");
      res.json(item.rows[0]);
    }
  } catch (error) {
    console.error(error);
  }
});