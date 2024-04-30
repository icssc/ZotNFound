const express = require("express");
const sendEmail = require("../utils.js");
const fs = require("fs");
const path = require("path");
const middleware = require("../middleware/index.js");
const itemsRouter = express.Router();

const client = require("../server/db");

// const templatePath = path.resolve(__dirname, "../emailTemplate/index.html");
// const template = fs.readFileSync(templatePath, "utf-8");
const isPositionWithinBounds = require("../util/inbound.js");
const { leaderboardTable, itemsTable } = require("../config/db-config.js");

//Add a item
itemsRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      islost,
      location,
      date,
      itemdate,
      email,
      image,
      isresolved,
      ishelped,
    } = req.body;

    if (!isPositionWithinBounds(location[0], location[1])) {
      res.json("ITEM OUT OF BOUNDS (UCI ONLY)");
    }

    const item = await client.query(
      `INSERT INTO ${itemsTable} (name, description, type, islost, location, date, itemdate, email, image, isresolved, ishelped) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        name,
        description,
        type,
        islost,
        location,
        date,
        itemdate,
        email,
        image,
        isresolved,
        ishelped,
      ]
    );

    // query to get users
    const subscribedUsers = await client.query(
      `SELECT DISTINCT email FROM ${leaderboardTable} WHERE email!=$1 AND subscription=True`,
      [email]
    );


    res.json(item.rows[0]); // send the response immediately after adding the item
    let contentString = "";

    // COMMENT OUT FOR TESTING PURPOSES
    if (process.env.NODE_ENV === "production") {
      function sendDelayedEmail(index) {
        if (index >= subscribedUsers.rows.length) return;

        let email = subscribedUsers.rows[index].email;
        contentString += `A new item, ${name}, is added to ZotnFound!`;

        const dynamicContent = {
          content: contentString,
          image: image,
          url: `https://zotnfound.com/${item.rows[0].id}`,
        };

        // const customizedTemplate = template
        //   .replace("{{content}}", dynamicContent.content)
        //   .replace("{{image}}", dynamicContent.image)
        //   .replace("{{url}}", dynamicContent.url);

        // sendEmail(email, "A nearby item was added.", customizedTemplate);

        contentString = "";
        console.log("sent " + email);
        setTimeout(() => sendDelayedEmail(index + 1), 500); // recursive call to iterate through all user emails
      }

      sendDelayedEmail(0);
    }
  } catch (error) {
    console.error(error);
  }
});

itemsRouter.get("/", async (req, res) => {
  try {
    // Retrieve the User-Email header
    const userEmail = req.headers["user-email"];
    // Modify your SQL query to conditionally select the email field
    const allItems = await client.query(
      `SELECT id, name, description, type, location, date, itemDate, image, islost, isResolved, isHelped, 
      CASE WHEN email = $1 THEN email ELSE NULL END as email 
      FROM ${itemsTable} WHERE is_deleted = false`,
      [userEmail] // Pass the userEmail as a parameter to the SQL query
    );

    res.json(allItems.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// itemsRouter.get("/testemail", async (req, res) => {
//   contentString = `A new added item, is near your items!`;

//   const dynamicContent = {
//     content: contentString,
//     image:
//       "https://i.insider.com/61d5c65a5a119b00184b1e1a?width=1136&format=jpeg",
//     url: `https://zotnfound.com/2`,
//   };

//   const customizedTemplate = template
//     .replace("{{content}}", dynamicContent.content)
//     .replace("{{image}}", dynamicContent.image)
//     .replace("{{url}}", dynamicContent.url);

//   email = [
//     "nguyenisabillionaire@gmail.com",
//     "dangnwin@gmail.com",
//     "nwinsquared@gmail.com",
//     "stevenzhouni@gmail.com",
//     "sophiahuynh124@gmail.com",
//   ];
//   await sendEmail(email, "A nearby item was added!", customizedTemplate);

//   contentString = "";
//   res.json("nice");
// });

itemsRouter.get("/week", async (req, res) => {
  try {

    const items = await client.query(
      `SELECT * FROM ${itemsTable} WHERE TO_TIMESTAMP(date, 'YYYY-MM-DD') > NOW() - interval '7 days' AND is_deleted = false`
    );

    res.json(items.rows);
  } catch (error) {
    console.error({ error });
  }
});

itemsRouter.get("/two_weeks", async (req, res) => {
  try {

    const items = await client.query(
      `SELECT * FROM ${itemsTable} WHERE TO_TIMESTAMP(date, 'YYYY-MM-DD') > NOW() - interval '14 days' AND is_deleted = false`
    );


    res.json(items.rows);
  } catch (error) {
    console.error(error);
  }
});

itemsRouter.get("/month", async (req, res) => {
  try {

    const items = await client.query(
      `SELECT * FROM ${itemsTable} WHERE TO_TIMESTAMP(date, 'YYYY-MM-DD') > NOW() - interval '30 days' AND is_deleted = false`
    );

    res.json(items.rows);
  } catch (error) {
    console.error(error);
  }
});

itemsRouter.get("/year", async (req, res) => {
  try {

    const items = await client.query(
      `SELECT * FROM ${itemsTable} WHERE TO_TIMESTAMP(date, 'YYYY-MM-DD') > NOW() - interval '365 days' AND is_deleted = false`
    );

    res.json(items.rows);
  } catch (error) {
    console.error(error);
  }
});

// Get an item
itemsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await client.query(`SELECT * FROM ${itemsTable} WHERE id=$1`, [
      id,
    ]);

    res.json(item.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// Get email associated with an item id (only if user is logged in)
itemsRouter.get("/:id/email", middleware.decodeToken, async (req, res) => {
  try {
    const { id } = req.params;

    const item = await client.query(
      `SELECT email FROM ${itemsTable} WHERE id=$1`,
      [id]
    );

    res.json(item.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// Retrieve Items by Category
itemsRouter.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const items = await client.query(
      `SELECT * FROM ${itemsTable} WHERE type=$1`,
      [category]
    );

    res.json(items.rows);
  } catch (error) {
    console.error(error);
  }
});

//Update a item resolve and helpfulness
itemsRouter.put("/:id", middleware.decodeToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { ishelped } = req.body;

    const item = await client.query(
      `UPDATE ${itemsTable} SET isresolved=$1, ishelped=$2 WHERE id=$3 RETURNING *`,
      [true, ishelped, id]
    );

    res.json(item.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// Mark an item as deleted instead of removing it from the database
itemsRouter.delete("/:id", middleware.decodeToken, async (req, res) => {
  try {
    const { id } = req.params;

    const markAsDeleted = await client.query(
      `UPDATE ${itemsTable} SET is_deleted = true WHERE id = $1 RETURNING *`,
      [id]
    );

    // If no rows are returned, it means that there was no item with the given ID.
    if (markAsDeleted.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(markAsDeleted.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = itemsRouter;
