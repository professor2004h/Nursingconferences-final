import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'zt8218vh',
    dataset: 'production'
  },
  studioHost: 'nursingconferences-org-final',
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   * Updated: 2025-07-30 - Force schema refresh for multi-currency fields
   */
  autoUpdates: true,
})
