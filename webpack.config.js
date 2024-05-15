module.exports = {
  resolve: {
    fallback: {
      util: require.resolve("util/"),
    },
  },
};

// module.exports = {
//   // ... autres configurations
//   resolve: {
//     fallback: {
//       util: require.resolve("util/"),
//     },
//     extensions: [".mjs", ".js", ".json"],
//     mainFields: ["browser", "module", "main"],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.mjs$/,
//         include: /node_modules/,
//         type: "javascript/auto",
//       },
//     ],
//   },
// };
