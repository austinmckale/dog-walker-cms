import { defineType } from 'sanity'

export const dog = defineType({
  name: 'dog',
  title: 'Dog',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Dog Name',
      type: 'string',
    },
    {
      name: 'breed',
      title: 'Breed',
      type: 'string',
    },
    {
      name: 'age',
      title: 'Age (years)',
      type: 'number',
    },
    {
      name: 'weight',
      title: 'Weight (lbs)',
      type: 'number',
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'text',
    },
  ],
})
