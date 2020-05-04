module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        '**/test/**/*.test.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    // coverageThreshold: {
    //     global: {
    //     lines: 95,
    //     branches: 85,
    //     functions: 95,
    //     statements: 90,
    //     }
    // },
    // collectCoverageFrom: [
    //     'src/dataSources/**',
    //     'src/resolvers/**',
    //     'src/schema/**',
    //     'src/staticMaps/**',
    // ]
};