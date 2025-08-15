# Setup Guide for Pawsome Walks Website

## Prerequisites

Before setting up the project, you'll need to install:

1. **Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - This will also install npm (Node Package Manager)

2. **Git** (if not already installed)
   - Download from [git-scm.com](https://git-scm.com/)

## Installation Steps

### 1. Install Node.js
- Go to [nodejs.org](https://nodejs.org/)
- Download the LTS version for Windows
- Run the installer and follow the prompts
- Restart your terminal/PowerShell after installation

### 2. Verify Installation
Open a new terminal/PowerShell window and run:
```bash
node --version
npm --version
```

Both commands should return version numbers.

### 3. Install Project Dependencies
Navigate to your project directory and run:
```bash
npm install
```

This will install all the required dependencies including:
- Next.js 14
- React 19
- TypeScript
- Tailwind CSS
- Sanity Client
- Lucide React icons

### 4. Set Up Environment Variables
Create a `.env.local` file in the root directory with your Sanity configuration:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

### 5. Start the Development Server
```bash
npm run dev
```

The website will be available at `http://localhost:3000`

### 6. Start Sanity Studio (Optional)
In a separate terminal, run:
```bash
npm run sanity:dev
```

Sanity Studio will be available at `http://localhost:3333`

## Project Structure

```
dog-walker-site/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── walk-plans/        # Walk plans page
│   ├── dogs/              # Dog profiles (coming soon)
│   └── reports/           # Walk reports (coming soon)
├── components/            # Reusable components
│   ├── Navigation.tsx     # Main navigation
│   └── WalkPlanCard.tsx   # Walk plan display card
├── lib/                   # Utility libraries
│   └── sanity.ts          # Sanity client configuration
├── types/                 # TypeScript type definitions
│   └── index.ts           # Data interfaces
└── schemaTypes/           # Sanity CMS schemas
    ├── walkPlan.ts        # Walk plan schema
    ├── dog.ts             # Dog schema
    ├── client.ts          # Client schema
    ├── walkReport.ts      # Walk report schema
    └── index.ts           # Schema exports
```

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sanity:dev` - Start Sanity Studio
- `npm run sanity:build` - Build Sanity Studio
- `npm run sanity:deploy` - Deploy Sanity Studio

## Sanity CMS Setup

### 1. Create a Sanity Project
1. Go to [sanity.io](https://sanity.io/)
2. Create a new account or sign in
3. Create a new project
4. Note your project ID

### 2. Configure Environment Variables
Update your `.env.local` file with your actual Sanity project details:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-actual-api-token
```

### 3. Add Content to Sanity
1. Start Sanity Studio: `npm run sanity:dev`
2. Go to `http://localhost:3333`
3. Add some walk plans to test the website

## Features Implemented

### ✅ Completed
- [x] Modern Next.js 14 frontend with TypeScript
- [x] Responsive design with Tailwind CSS
- [x] Sanity CMS integration
- [x] Walk Plans page with data fetching
- [x] Improved schemas with validation
- [x] Type-safe data structures
- [x] Beautiful UI components

### 🚧 Coming Soon
- [ ] Dog profiles management
- [ ] Walk reports and analytics
- [ ] GPS tracking integration
- [ ] Booking system
- [ ] User authentication

## Troubleshooting

### Node.js not found
- Make sure Node.js is installed and in your PATH
- Restart your terminal after installation
- Try running `node --version` to verify

### npm not found
- Node.js installation includes npm
- If npm is missing, reinstall Node.js

### Port already in use
- Change the port: `npm run dev -- -p 3001`
- Or kill the process using the port

### Sanity connection issues
- Check your environment variables
- Verify your project ID and dataset
- Ensure your API token has the correct permissions

## Next Steps

1. **Add Content**: Use Sanity Studio to add walk plans
2. **Customize**: Modify colors, fonts, and styling in `tailwind.config.js`
3. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform
4. **Extend**: Add more features like dog profiles and walk reports

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure Node.js version is 18 or higher
4. Try deleting `node_modules` and running `npm install` again

---

Happy coding! 🐕 