module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
    transform: {
      "^.+\\.jsx?$": "babel-jest",  // This ensures Jest uses Babel for .js and .jsx files
    },
  };
  