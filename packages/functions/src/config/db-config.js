// require("dontenv").config();

const config = {
  development: {
    leaderboardTable: "dev.leaderboard",
    itemsTable: "dev.items",
    searchesTable: "dev.searches"
  },
  production: {
    leaderboardTable: "public.leaderboard",
    itemsTable: "public.items",
    searchesTable: "public.searches"
  },
  // Add more environments if needed
};

const table = config[process.env.NODE_ENV] || config.development;

export const leaderboardTable = table.leaderboardTable;
export const itemsTable = table.itemsTable;
export const searchesTable = table.searchesTable;
