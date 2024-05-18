const path = require("path");

module.exports = {
  entry: "./src/index.tsx", // Point d'entrée de votre application
  output: {
    filename: "bundle.js", // Nom du fichier de sortie
    path: path.resolve(__dirname, "dist"), // Répertoire de sortie
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"], // Extensions à résoudre
    fallback: {
      util: require.resolve("util/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Fichiers à traiter avec ce loader
        use: "ts-loader", // Utilisation de ts-loader pour traiter les fichiers TypeScript
        exclude: /node_modules/, // Exclure le répertoire node_modules
      },
      {
        test: /\.css$/, // Fichiers à traiter avec ce loader
        use: ["style-loader", "css-loader"], // Loaders pour traiter les fichiers CSS
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/, // Fichiers à traiter avec ce loader
        use: [
          {
            loader: "file-loader", // Utilisation de file-loader pour les fichiers images
            options: {
              name: "[name].[ext]", // Nom des fichiers de sortie
              outputPath: "images/", // Répertoire de sortie pour les fichiers
            },
          },
        ],
      },
    ],
  },
  devtool: "source-map", // Génération des source maps
  devServer: {
    contentBase: path.join(__dirname, "dist"), // Répertoire de base pour le serveur de développement
    compress: true, // Compression des fichiers
    port: 3000, // Port du serveur de développement
  },
};
