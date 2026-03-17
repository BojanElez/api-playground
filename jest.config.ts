export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/store/', '<rootDir>/src/types/'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/main.tsx',
    '!<rootDir>/src/store/**/*',
    '!<rootDir>/src/types/**/*',
    '!<rootDir>/src/**/*.stories.{ts,tsx}',
    '!<rootDir>/src/**/*.types.ts',
    '!<rootDir>/src/**/*.types.tsx',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { configFile: './babel.confing.cjs' }],
  },
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
