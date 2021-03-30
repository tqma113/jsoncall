module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
    __DEV__: false,
  },
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  testRegex: '/__tests__/.*.(test|spec).(ts|tsx|js)$',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  collectCoverageFrom: [
    'bin/*.{js,ts}',
    'build/*.{js,ts}',
    'client/*.{js,ts}',
    'config/*.{js,ts}',
    'dev/*.{js,ts}',
    'page/*.{js,ts}',
    'start/*.{js,ts}',
    'store/*.{js,ts}',
  ],
  preset: 'ts-jest',
  testMatch: null,
}
