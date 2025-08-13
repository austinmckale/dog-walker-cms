import studio from '@sanity/eslint-config-studio'
import next from 'eslint-config-next'

// Apply Next.js recommended rules to the app, alongside Sanity studio config
export default [
  ...next(),
  ...studio,
]
