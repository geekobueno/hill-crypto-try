# Hill Cipher Educational App

An interactive web application that teaches the Hill cipher encryption algorithm through visual demonstrations and step-by-step calculations.

## Features

- Interactive matrix input and validation
- Real-time encryption and decryption
- Step-by-step calculation visualization
- Smooth animations with Framer Motion
- Terminal-style cryptographic aesthetic
- Property-based testing with fast-check

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with cryptographic terminal theme
- **mathjs** - Matrix operations and modular arithmetic
- **Framer Motion** - Animations
- **Vitest** - Unit testing
- **fast-check** - Property-based testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

Dependencies are already installed. To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/       # React components
├── lib/              # Core logic and utilities
│   ├── types.ts      # TypeScript type definitions
│   ├── matrixMath.ts # Matrix operations
│   └── hillCipher.ts # Hill cipher implementation
├── vitest.config.ts  # Vitest configuration
└── tailwind.config.ts # Tailwind CSS configuration
```

## Educational Purpose

⚠️ **This application is for educational purposes only.** The Hill cipher is a classical encryption algorithm that is not secure for modern cryptographic use. It is vulnerable to known-plaintext attacks and should never be used to protect sensitive information.

## License

ISC
