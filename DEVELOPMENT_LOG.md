# Development Log - Recipe App

## Project Overview
This document explains how the Recipe App works, the problems solved during development, and the technical decisions made.

## Development Timeline

### Phase 1: Project Initialization
**What was done:**
- Initialized Next.js 15 project with TypeScript and App Router
- Set up Prisma ORM with SQLite database
- Created initial database schema with User and Recipe models
- Configured project structure with component folders

**Problems solved:**
- Initially tried to create project in a subfolder, but moved everything to root directory for cleaner structure
- Set up proper TypeScript configuration for Next.js 15

### Phase 2: Database Schema Design
**What was done:**
- Designed User model with authentication fields (id, name, email, password)
- Designed Recipe model with theme-specific fields:
  - `title` - Recipe name
  - `description` - Recipe overview
  - `ingredients` - List of ingredients as text
  - `instructions` - Step-by-step cooking instructions
  - `cookingTime` - Duration in minutes (custom field #1)
  - `cuisine` - Type of cuisine like Italian, Mexican, etc (custom field #2)
- Created one-to-many relationship between User and Recipe
- Generated and ran Prisma migrations

**Problems solved:**
- **Prisma v7 compatibility issue**: Initially installed Prisma v7, but encountered error "Missing configured driver adapter" because v7 requires explicit driver adapters even for SQLite
- **Solution**: Downgraded to Prisma 5.22.0 which works with SQLite out of the box
- Learned about Prisma Client singleton pattern to avoid multiple instances in development

### Phase 3: Authentication Implementation
**What was done:**
- Integrated NextAuth v5 (beta) for authentication
- Created credential provider with email/password login
- Implemented bcryptjs for password hashing (never store plain text passwords)
- Built registration API endpoint with validation
- Created login and register pages with forms
- Set up JWT-based session strategy

**Problems solved:**
- **Session management**: NextAuth v5 has different API than v4, had to use beta documentation
- **Password security**: Implemented proper bcrypt hashing with salt rounds
- **Email uniqueness**: Added database constraint and API validation to prevent duplicate emails
- **Type safety**: Created proper TypeScript types for session and user objects

### Phase 4: Protected Routes & Middleware
**What was done:**
- Created middleware.ts to protect routes like `/recipes/new` and `/recipes/[id]/edit`
- Added session checks in API routes
- Implemented ownership validation (users can only edit/delete their own recipes)

**How it works:**
- Middleware runs before page loads, checks if user is authenticated
- If not authenticated, redirects to `/login`
- API routes validate both authentication AND ownership before allowing mutations

### Phase 5: Recipe CRUD Implementation
**What was done:**
- **Create**: Built form at `/recipes/new` with validation, saves to database via POST API
- **Read**: 
  - List page at `/recipes` showing all recipes from all users
  - Detail page at `/recipes/[id]` with full recipe information
- **Update**: Edit page at `/recipes/[id]/edit` with pre-filled form, only for recipe owner
- **Delete**: Delete button on detail page, only visible to recipe owner, with API validation

**How CRUD operations work:**
1. **Create Recipe Flow:**
   - User fills form → Client-side validation → POST to /api/recipes
   - API checks authentication → Associates recipe with userId → Saves to DB with Prisma
   - Redirects to recipe detail page

2. **Read Recipes Flow:**
   - Server component fetches all recipes from DB
   - Displays in grid of RecipeCard components
   - Clicking card navigates to detail page with dynamic route

3. **Update Recipe Flow:**
   - Detail page shows Edit button only if session.user.id === recipe.userId
   - Edit page fetches recipe, populates form
   - On submit → PUT to /api/recipes/[id]
   - API validates ownership → Updates DB → Redirects back

4. **Delete Recipe Flow:**
   - Delete button only shows for owner
   - Confirmation dialog prevents accidental deletion
   - DELETE to /api/recipes/[id]
   - API validates ownership → Removes from DB → Redirects to list

**Problems solved:**
- **Ownership validation**: Implemented in both UI (hiding buttons) and API (checking userId)
- **Form validation**: Client-side validation for better UX, server-side for security
- **Error handling**: Proper error messages for "not found", "unauthorized", "validation failed"

### Phase 6: Component Architecture
**What was done:**
- Created reusable components in separate folders:
  - `Button/` - Styled button with variants (primary, secondary, danger, ghost)
  - `Input/` - Text input with label, validation, and error display
  - `Textarea/` - Multi-line input for long text fields
  - `Card/` - White container for forms
  - `RecipeCard/` - Recipe preview card for list page
  - `Navbar/` - Navigation with conditional rendering based on auth state

**Why this structure:**
- Each component has its own folder with `.tsx` and `.module.css` files
- Easy to maintain and update
- CSS Modules prevent style conflicts
- Components are reusable across different pages

### Phase 7: UI/UX Design System
**What was done:**
- Created comprehensive design system in `globals.css` with CSS variables
- **Color palette**: Indigo-purple gradient theme (#667eea to #764ba2)
- **Design elements**:
  - Gradient backgrounds with floating orbs animation
  - Ripple effects on buttons
  - Shimmer animations on recipe cards
  - Glassmorphism with backdrop-filter
  - Focus states on inputs with colored rings
  - Shake animation on error messages
  - Smooth transitions and hover effects

**Problems solved:**
- **Color consistency**: Used CSS variables instead of hard-coded colors
- **Responsive design**: Media queries for mobile-friendly layouts
- **Accessibility**: Proper labels, focus indicators, ARIA attributes
- **Loading states**: Visual feedback during async operations

### Phase 8: Validation & Error Handling
**What was implemented:**
- **Registration validation**:
  - Email format check with regex
  - Password minimum length requirement
  - Name required field check
  - Duplicate email prevention at database level

- **Login validation**:
  - Email and password required
  - Wrong credentials show clear error message
  - Failed login attempts don't reveal if email exists (security)

- **Recipe form validation**:
  - All fields required (title, description, ingredients, instructions)
  - Cooking time must be positive number
  - Cuisine type required

- **API error responses**:
  - 400 for validation errors
  - 401 for unauthorized access
  - 404 for not found resources
  - 403 for ownership violations
  - Clear error messages in JSON responses

## Technical Challenges & Solutions

### Challenge 1: Prisma Version Compatibility
**Problem**: Prisma v7 required driver adapters that weren't compatible with simple SQLite setup.
**Solution**: Downgraded to Prisma 5.22.0 which has stable SQLite support without additional configuration.

### Challenge 2: NextAuth v5 Beta
**Problem**: Documentation for NextAuth v5 is still evolving, many breaking changes from v4.
**Solution**: Read beta docs carefully, used proper `auth()` function for session checks, implemented middleware correctly.

### Challenge 3: Ownership Authorization
**Problem**: Need to prevent users from editing/deleting recipes they don't own.
**Solution**: 
- UI level: Conditional rendering of Edit/Delete buttons
- API level: Validate `recipe.userId === session.user.id` before mutations
- Database level: Foreign key constraint ensures data integrity

### Challenge 4: Form State Management
**Problem**: Need to handle form inputs, validation, errors, and loading states.
**Solution**: Used React useState for form state, client-side validation before API calls, clear error messages for users.

### Challenge 5: Type Safety
**Problem**: TypeScript errors with Prisma types and NextAuth session.
**Solution**: Created proper type definitions, extended NextAuth types for custom user fields, used Prisma generated types.

## How the App Works (End-to-End Flow)

### User Registration Flow:
1. User navigates to `/register`
2. Fills form with name, email, password
3. Client validates input format
4. POST request to `/api/register`
5. API validates email uniqueness
6. Password hashed with bcrypt (10 salt rounds)
7. User created in database with Prisma
8. Redirect to `/login`

### Authentication Flow:
1. User submits login form
2. NextAuth calls authorize function in `lib/auth.ts`
3. Find user by email in database
4. Compare password with bcrypt.compare()
5. If valid, create JWT session
6. Session stored in cookie
7. User redirected to `/recipes`

### Recipe Creation Flow:
1. Authenticated user clicks "Create Recipe"
2. Middleware checks session, allows access
3. User fills form with recipe details
4. Client validates all fields
5. POST to `/api/recipes` with recipe data
6. API verifies user is authenticated
7. Creates recipe with `userId: session.user.id`
8. Prisma saves to database
9. Returns created recipe
10. Client redirects to `/recipes/[id]`

### Recipe Viewing Flow:
1. Server component fetches recipes with `prisma.recipe.findMany()`
2. Includes user relation for author name
3. Maps recipes to RecipeCard components
4. User clicks card, navigates to `/recipes/[id]`
5. Server fetches single recipe with `findUnique()`
6. Checks if current user is owner
7. Conditionally shows Edit/Delete buttons
8. Displays full recipe information in sections

## Security Measures Implemented

1. **Password Security**: bcrypt hashing, never store plain text
2. **Session Security**: JWT tokens with secret key, HTTP-only cookies
3. **Route Protection**: Middleware blocks unauthenticated access
4. **Authorization**: API validates resource ownership
5. **SQL Injection Prevention**: Prisma uses parameterized queries
6. **CSRF Protection**: Built into NextAuth
7. **Input Validation**: Client and server-side validation
8. **Error Messages**: Don't reveal sensitive information

## Database Design Decisions

### Why SQLite?
- Lightweight, no separate server needed
- Perfect for development and learning
- File-based, easy to reset and migrate
- Prisma has excellent SQLite support

### Why Prisma?
- Type-safe database queries
- Automatic migration generation
- Great developer experience with Prisma Studio
- Built-in connection pooling
- Easy to switch databases later if needed

### Schema Design Choices:
- `cuid()` for IDs instead of auto-increment for better scalability
- Timestamps (createdAt, updatedAt) for audit trail
- `@unique` on email for data integrity
- Foreign key with `onDelete: Cascade` would delete user's recipes if user deleted (not implemented but possible)

## Git History Notes

The repository shows incremental development with meaningful commits:
1. Initial project setup
2. Authentication implementation
3. Recipe CRUD API endpoints
4. UI components and pages
5. Middleware for protection
6. README documentation
7. Prisma version fixes
8. UI design improvements

Each commit represents a logical unit of work, not one giant commit.

## Conclusion

This project demonstrates a complete full-stack Next.js application with:
- Secure authentication and authorization
- Database operations with Prisma ORM
- Full CRUD functionality with ownership rules
- Modern, responsive UI design
- Proper error handling and validation
- Type-safe TypeScript code
- RESTful API design
- Protected routes with middleware
- Component-based architecture

All requirements from the assignment have been met and the application is ready for deployment.
