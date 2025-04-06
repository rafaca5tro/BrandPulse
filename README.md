
# PlaymakerAI BrandAudit - AI-powered Brand Analysis Tool

PlaymakerAI BrandAudit is a comprehensive platform that leverages AI to analyze and evaluate your brand's digital presence. By inputting your website URL, you can receive a detailed report with actionable insights to improve your branding, messaging, and overall digital strategy.

## Features

- **AI-Powered Brand Analysis**: Get in-depth insights about your brand's digital presence
- **Comprehensive Reports**: View detailed breakdowns of your brand's performance across multiple dimensions
- **Visual Metrics**: View easy-to-understand visualizations of your brand's performance
- **Exportable Results**: Download your reports as PDFs for offline use
- **User Dashboard**: Track and manage all your brand audits in one place

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling with a dark indigo/purple theme
- shadcn/ui component library
- Supabase for backend and authentication
- OpenAI for AI-powered analysis

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm, yarn, or bun
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository
```sh
git clone <repository-url>
cd playmaker-ai-brandaudit
```

2. Install dependencies
```sh
npm install
# or
yarn install
# or
bun install
```

3. Start the development server
```sh
npm run dev
# or
yarn dev
# or
bun dev
```

## Setting Up OpenAI API Key

The application uses OpenAI for generating brand audit reports. You need to set up your OpenAI API key in the Supabase Edge Function secrets:

1. Log in to your Supabase dashboard
2. Navigate to your project
3. Go to Settings > API
4. Under "Edge Functions", add a new secret with the key `OPENAI_API_KEY` and your API key as the value
   - You can obtain an OpenAI API key from: https://platform.openai.com/api-keys

**IMPORTANT**: The application will not work properly without a valid OpenAI API key. If you're seeing placeholder data in your audit results, please verify that your API key is correctly configured.

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/pages`: Main page components
  - `/hooks`: Custom React hooks
  - `/services`: API and service functions
  - `/types`: TypeScript type definitions
  - `/utils`: Utility functions
  - `/integrations`: Integration with third-party services like Supabase

- `/supabase`: Supabase configuration and Edge Functions
  - `/functions`: Edge Functions for server-side processing

## Key Components

- **AuditForm**: Allows users to submit websites for analysis
- **AuditResult**: Displays the comprehensive audit report
- **Dashboard**: Manages user's previous audits
- **Header/Footer**: Navigation and site structure

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Contact

For support or questions, please use the contact form on our website or reach out through our social media channels.

## License

This project is proprietary and confidential. Unauthorized copying, redistribution, or use is prohibited.
