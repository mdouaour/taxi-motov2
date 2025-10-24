module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" },
        modules: "commonjs", // Ensure ES Modules are transformed to CommonJS for Jest
      },
    ],
  ],
};
