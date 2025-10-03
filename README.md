# TempHub

AI-powered image generation platform built with Next.js 14, React, TypeScript, and Google's Gemini 2.5 Flash Image Preview API.

## Features

- Browse and explore AI image generation templates
- Upload images and transform them using AI-powered templates
- Admin panel for template management
- Responsive design with Tailwind CSS
- Built with Next.js 14 App Router

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **AI**: Google Gemini 2.5 Flash Image Preview API
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd temphub
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
temphub/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public-facing pages
│   ├── admin/               # Admin panel pages
│   ├── api/                 # API routes
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Shadcn/ui components
│   └── ...                  # Feature components
├── lib/                     # Utility functions
├── types/                   # TypeScript type definitions
├── data/                    # JSON data storage
└── public/                  # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

## Adding Shadcn/ui Components

To add new Shadcn/ui components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
```

## Development Workflow

1. Create feature branches from `main`
2. Follow the implementation tasks in `.kiro/specs/ai-image-template-platform/tasks.md`
3. Test locally before committing
4. Submit pull requests for review

## Deployment

The application is configured for deployment on Netlify:

1. Connect your repository to Netlify
2. Configure environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

## License

MIT
AI Template Hub
