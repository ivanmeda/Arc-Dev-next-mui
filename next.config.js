const withPlugins = require("next-compose-plugins");
const optimizedImages = require("next-optimized-images");

module.exports = withPlugins([
  [
    optimizedImages,
    {
      /* config for next-optimized-images */
    },
  ],
  // your other plugins here
]);

module.exports = {
  env: {
    mongodb_username: "ivan",
    mongodb_password: "medved1993",
    mongodb_cluster: "cluster0",
    mongodb_database: "auth",
  },
};
