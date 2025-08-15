# Pawsome Walks - Dog Walking Business Website

A modern, professional dog walking business website built with Next.js, TypeScript, and Sanity CMS. Features GPS tracking, detailed walk reports, and comprehensive dog management.

## 🚀 Features

- **Walk Plans**: Display and manage different walk service packages
- **Dog Profiles**: Individual dog profiles with owner information and notes
- **Walk Reports**: GPS-tracked walks with detailed reports and analytics
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **CMS Integration**: Sanity CMS for easy content management
- **TypeScript**: Full type safety throughout the application

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **CMS**: Sanity Studio
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom components

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/austinmckale/dog-walker-cms.git
   cd dog-walker-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your-api-token
   NEXT_PUBLIC_SITE_NAME="Berks Best Friend Transport"
   NEXT_PUBLIC_SUPPORT_PHONE="+1484444XXXX"
   NEXT_PUBLIC_SUPPORT_EMAIL="hello@berksbestfriend.com"
   NEXT_PUBLIC_MAP_PROVIDER="leaflet"
   NEXT_PUBLIC_MAPBOX_TOKEN=""
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start Sanity Studio** (in a separate terminal)
   ```bash
   npm run sanity:dev
   ```

## 🏗 Project Structure

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
    └── index.ts           # Schema exports
```

## 📋 Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sanity:dev` - Start Sanity Studio
- `npm run sanity:build` - Build Sanity Studio
- `npm run sanity:deploy` - Deploy Sanity Studio

## 🎯 Current Status

### ✅ Completed
- [x] Sanity CMS setup with walk plan schema
- [x] Next.js frontend with TypeScript
- [x] Walk Plans page with data fetching
- [x] Responsive navigation
- [x] Modern UI with Tailwind CSS
- [x] Type-safe data structures

### 🚧 In Progress
- [ ] Dog profiles management
- [ ] Walk reports and analytics
- [ ] GPS tracking integration
- [ ] Booking system
- [ ] User authentication

### 📋 Planned Features
- [ ] Real-time GPS tracking
- [ ] Photo uploads during walks
- [ ] Email notifications
- [ ] Mobile app integration
- [ ] Payment processing
- [ ] Advanced analytics dashboard

## 🔧 Configuration

### Sanity CMS
The CMS is configured in `sanity.config.ts` and includes schemas for:
- Walk Plans (title, price, duration, description)
- Dogs (name, breed, owner info, notes)
- Clients (contact information)
- Walk Reports (coming soon)

### Environment Variables
Make sure to set up your Sanity project ID and API token in `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

## 🎨 Customization

### Styling
The project uses Tailwind CSS with custom color schemes. Update `tailwind.config.js` to modify:
- Color palette (primary/secondary colors)
- Typography (font families)
- Component styles

### Components
All components are modular and reusable. Key components:
- `WalkPlanCard`: Displays individual walk plans
- `Navigation`: Main site navigation
- Layout components for consistent styling

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy Notes
- Install command is managed via `vercel.json` and includes devDependencies: `npm ci`.
- Node version: use Node 20 (see `.nvmrc`); `package.json` engines restrict to Node <21.
- Do not set `output: 'export'` in `next.config.js` (dynamic routes present).
- OAuth callback at `/auth/callback` uses a client component within `Suspense` and is marked dynamic.

### Other Platforms
The Next.js app can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue on GitHub
- Check the Sanity documentation
- Review Next.js documentation

---

Built with ❤️ for dog lovers everywhere
