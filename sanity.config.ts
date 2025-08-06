import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Dog Walker Site',

  projectId: 'ejoan8oy', // yours may differ
  dataset: 'production',

  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
