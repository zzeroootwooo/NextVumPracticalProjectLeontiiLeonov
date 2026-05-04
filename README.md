# Recipe App - Full-Stack Next.js Application

A full-stack web application for sharing and managing recipes, built with Next.js, Prisma, and SQLite.

## Features

- **User Authentication**: Register, login, and logout functionality with NextAuth
- **Recipe Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Authorization**: Users can only edit and delete their own recipes
- **Modern UI**: Beautiful, responsive design with CSS modules
- **Database**: SQLite database managed with Prisma ORM

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth v5
- **Styling**: CSS Modules
- **Password Hashing**: bcryptjs

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── register/        # User registration
│   │   └── recipes/         # Recipe CRUD endpoints
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   └── recipes/             # Recipe pages
│       ├── [id]/            # Recipe details & edit
│       └── new/             # Create recipe
├── components/              # Reusable components
│   ├── Button/
│   ├── Card/
│   ├── Input/
│   ├── Navbar/
│   ├── RecipeCard/
│   └── Textarea/
├── lib/                     # Utility functions
│   ├── auth.ts              # NextAuth configuration
│   └── prisma.ts            # Prisma client
├── prisma/                  # Database schema and migrations
├── types/                   # TypeScript type definitions
└── middleware.ts            # Route protection

```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Or create a `.env` file manually with:

```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Features Overview

### Authentication

- User registration with email validation
- Secure password hashing
- Session management with NextAuth
- Protected routes middleware

### Recipe Operations

- **List**: Browse all recipes with card-based layout
- **Create**: Add new recipes with title, description, ingredients, instructions, and cooking time
- **Read**: View detailed recipe information
- **Update**: Edit your own recipes
- **Delete**: Remove your own recipes with confirmation

### Database Schema

**User Model:**

- id, name, email (unique), password, timestamps
- One-to-many relationship with recipes

**Recipe Model:**

- id, title, description, ingredients, instructions, cookingTime
- timestamps, userId (foreign key)
- Belongs to User

## Development

```bash
# Run development server
npm run dev

# Run Prisma Studio (database GUI)
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name
```

## Screenshots

Application screenshots demonstrating all key features:
