module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  moduleNameMapper: {
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    
  },
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Reporte de Pruebas",
        outputPath: "./test-results/index.html",
        includeFailureMsg: true,
        includeConsoleLog: true
      }
    ]
  ]
};