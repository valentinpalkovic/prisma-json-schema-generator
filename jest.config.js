module.exports = {
    clearMocks: true,
    coverageDirectory: 'coverage',
    setupFiles: [],
    testEnvironment: 'node',
    coverageProvider: 'v8',
    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
    },
}
