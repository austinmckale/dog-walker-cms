import { defineType } from 'sanity'

export const walkReport = defineType({
  name: 'walkReport',
  title: 'Walk Report',
  type: 'document',
  fields: [
    {
      name: 'dog',
      title: 'Dog',
      type: 'reference',
      to: [{ type: 'dog' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'walkPlan',
      title: 'Walk Plan',
      type: 'reference',
      to: [{ type: 'walkPlan' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'walker',
      title: 'Walker',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Walk Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'checkInTime',
      title: 'Check-in Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'checkOutTime',
      title: 'Check-out Time',
      type: 'datetime',
    },
    {
      name: 'actualDuration',
      title: 'Actual Duration (minutes)',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    },
    {
      name: 'distance',
      title: 'Distance (miles)',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    },
    {
      name: 'route',
      title: 'GPS Route',
      type: 'object',
      fields: [
        {
          name: 'coordinates',
          title: 'Coordinates',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'lat', title: 'Latitude', type: 'number' },
                { name: 'lng', title: 'Longitude', type: 'number' },
                { name: 'timestamp', title: 'Timestamp', type: 'datetime' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'photos',
      title: 'Walk Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
            {
              name: 'timestamp',
              title: 'Photo Time',
              type: 'datetime',
            },
          ],
        },
      ],
    },
    {
      name: 'weather',
      title: 'Weather Conditions',
      type: 'object',
      fields: [
        { name: 'temperature', title: 'Temperature (°F)', type: 'number' },
        { name: 'conditions', title: 'Conditions', type: 'string' },
        { name: 'humidity', title: 'Humidity (%)', type: 'number' },
      ],
    },
    {
      name: 'behavior',
      title: 'Dog Behavior',
      type: 'object',
      fields: [
        {
          name: 'energy',
          title: 'Energy Level',
          type: 'string',
          options: {
            list: [
              { title: 'Very Low', value: 'very-low' },
              { title: 'Low', value: 'low' },
              { title: 'Normal', value: 'normal' },
              { title: 'High', value: 'high' },
              { title: 'Very High', value: 'very-high' },
            ],
          },
        },
        {
          name: 'mood',
          title: 'Mood',
          type: 'string',
          options: {
            list: [
              { title: 'Anxious', value: 'anxious' },
              { title: 'Calm', value: 'calm' },
              { title: 'Excited', value: 'excited' },
              { title: 'Playful', value: 'playful' },
              { title: 'Tired', value: 'tired' },
            ],
          },
        },
        {
          name: 'socialization',
          title: 'Socialization',
          type: 'string',
          options: {
            list: [
              { title: 'Good with other dogs', value: 'good-dogs' },
              { title: 'Good with people', value: 'good-people' },
              { title: 'Reactive to dogs', value: 'reactive-dogs' },
              { title: 'Reactive to people', value: 'reactive-people' },
              { title: 'Neutral', value: 'neutral' },
            ],
          },
        },
      ],
    },
    {
      name: 'notes',
      title: 'Walk Notes',
      type: 'text',
      rows: 4,
    },
    {
      name: 'incidents',
      title: 'Incidents or Issues',
      type: 'text',
      rows: 3,
    },
    {
      name: 'recommendations',
      title: 'Recommendations',
      type: 'text',
      rows: 3,
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Scheduled', value: 'scheduled' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'No Show', value: 'no-show' },
        ],
      },
      initialValue: 'scheduled',
    },
    {
      name: 'isReported',
      title: 'Report Sent to Owner',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'dog.name',
      date: 'date',
      walker: 'walker',
      status: 'status',
      media: 'photos.0',
    },
    prepare(selection) {
      const { title, date, walker, status, media } = selection
      return {
        title: `${title} - ${new Date(date).toLocaleDateString()}`,
        subtitle: `Walker: ${walker} | Status: ${status}`,
        media: media,
      }
    },
  },
}) 