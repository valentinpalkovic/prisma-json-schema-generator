module.exports = {
    clearMocks: true,
    coverageDirectory: 'coverage',
    setupFiles: [],
    testEnvironment: 'node',
    coverageProvider: 'v8',
    timers: 'modern',
    transform: {
        '^.+\\.[t|j]sx?$': 'babel-jest',
    },
}
