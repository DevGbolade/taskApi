/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\.tsx?$': ['ts-jest', {}]
  },
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.test.ts'], // Look for test files in __tests__
  clearMocks: true,
  coverageDirectory: 'coverage', // Store test coverage reports
  collectCoverage: true,
  moduleNameMapper: {
    '@/(.*)': ['<rootDir>/src/$1']
  }
};
