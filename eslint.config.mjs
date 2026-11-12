import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  ...hmppsConfig({
    extraIgnorePaths: ['e2e-tests/playwright-report'],
  }),
  {
    files: ['e2e-tests/**/*.ts', 'playwright.config.ts'],
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
    },
  },
]
