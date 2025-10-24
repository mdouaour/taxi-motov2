module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleFileExtensions: ["js", "json", "node"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
