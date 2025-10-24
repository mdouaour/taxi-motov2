module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleFileExtensions: ["js", "json", "node"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  // Ensure that all files, including those in node_modules, are transformed by babel-jest
  transformIgnorePatterns: [],
  extensionsToTreatAsEsm: [".js"],
};
