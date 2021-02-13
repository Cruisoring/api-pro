module.exports = {
    // verbose: true,
    // rootDir: '.',
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    preset: 'ts-jest',
    testMatch: ['**/test/*.test.ts'],
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    moduleDirectories: ['src', 'node_modules'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['/node_modules'],
    verbose: true,
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};
