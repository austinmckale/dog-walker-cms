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
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'breed',
      title: 'Breed',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'age',
      title: 'Age (years)',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    },
    {
      name: 'weight',
      title: 'Weight (lbs)',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    },
    {
      name: 'ownerName',
      title: 'Owner Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'ownerEmail',
      title: 'Owner Email',
      type: 'email',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'ownerPhone',
      title: 'Owner Phone',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
    },
    {
      name: 'emergencyContact',
      title: 'Emergency Contact',
      type: 'object',
      fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'phone', title: 'Phone', type: 'string' },
        { name: 'relationship', title: 'Relationship', type: 'string' },
      ],
    },
    {
      name: 'medicalInfo',
      title: 'Medical Information',
      type: 'text',
      rows: 3,
    },
    {
      name: 'behaviorNotes',
      title: 'Behavior Notes',
      type: 'text',
      rows: 3,
    },
    {
      name: 'preferredWalkTime',
      title: 'Preferred Walk Time',
      type: 'string',
      options: {
        list: [
          { title: 'Morning', value: 'morning' },
          { title: 'Afternoon', value: 'afternoon' },
          { title: 'Evening', value: 'evening' },
          { title: 'Flexible', value: 'flexible' },
        ],
      },
    },
    {
      name: 'image',
      title: 'Dog Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'isActive',
      title: 'Active Client',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'notes',
      title: 'General Notes',
      type: 'text',
      rows: 4,
    },
  ],
  preview: {
    select: {
      title: 'name',
      breed: 'breed',
      owner: 'ownerName',
      media: 'image',
    },
    prepare(selection) {
      const { title, breed, owner, media } = selection
      return {
        title: title,
        subtitle: `${breed} - Owner: ${owner}`,
        media: media,
      }
    },
  },
})
