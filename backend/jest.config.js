module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleFileExtensions: ["js", "json", "node"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [],
  extensionsToTreatAsEsm: [".js"],
  moduleNameMapper: {
    "^(\.{1,2}/.*)\.js$": "$1",
  },
};
