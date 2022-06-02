module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts', 'gql'],
  rootDir: '.',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
}
