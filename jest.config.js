module.exports = {
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "**/test/**/*.test.ts"
    ],
    testEnvironment: "node",
    roots: ['<rootDir>'],
    testEnvironment: 'node',
    testRegex: '/test/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: false,
    coverageReporters: ['cobertura', 'json', 'html', 'text-summary', ['lcov', { projectRoot: './' }]],
    coverageThreshold: {
        global: {
            //branches: 80,
            //functions: 80,
            //lines: 80,
            //statements: -10,
        },
    },
    reporters: ['default', 'jest-junit'],
    collectCoverageFrom: [
        '**/lib/**/*.{ts,js,jsx}',
        '**/src/**/*.{ts,js,jsx}',
        '!**/out/**',
        '!**/dist/**',
        '!**/indexLocalDev.ts',
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
};