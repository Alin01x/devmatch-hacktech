# DevMatch: Intelligent Talent Allocation

DevMatch is a NextJS application that intelligently matches developers to projects based on their skills, experience, and project requirements. Using a combination of OpenAI, Natural.js for NLP, and Supabase for database, it provides an automated solution for optimal talent allocation.

## Features

- **CV Analysis**: Automatically analyze developer CVs to extract skills and experience
- **Job Matching**: Match candidates to job requirements using intelligent scoring
- **Dual Interface**:
  - Job-to-CV matching: Enter job requirements to find top 5 matching candidates
  - CV-to-Job matching: Upload a CV to find the best matching job opportunity
- **Comprehensive Scoring System**:
  - Industry Knowledge (10%)
  - Technical Skills and Qualifications (30%)
  - Overall Job Description Matching (60%)

## Tech Stack

- **Frontend**: Next.js
- **Backend**:
  - Supabase for database
  - OpenAI for advanced text analysis
  - Natural js for NLP and industry matching
  - Mammoth for extracting data from Word Documents
- **UI Components**:
  - Radix UI primitives (by using Shadcn UI)
  - Tailwind CSS for styling
  - Lucide React for icons

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Supabase account
- OpenAI API key

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=<SUBSTITUTE_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUBSTITUTE_SUPABASE_ANON_KEY>
OPENAI_API_KEY=<SUBSTITUTE_OPENAI_API_KEY>
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd devmatch-hacktech
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### UI Dependencies

- Radix UI components
- Tailwind CSS
- Lucide React icons

## Acknowledgments

- Developed as part of the HackTech challenge
- Built with modern web technologies and AI capabilities
