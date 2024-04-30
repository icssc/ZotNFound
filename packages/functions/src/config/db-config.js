// require("dontenv").config();

const config = {
  development: {
    leaderboardTable: "dev.leaderboard",
    itemsTable: "dev.items",
  },
  production: {
    leaderboardTable: "public.leaderboard",
    itemsTable: "public.items",
  },
  // Add more environments if needed
};

module.exports = config[process.env.NODE_ENV] || config.development;
