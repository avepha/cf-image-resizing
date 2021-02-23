module.exports = {
  rootDir: './',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 10000,
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  testRegex: '\\.spec\\.ts$',
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1'
  }
}
