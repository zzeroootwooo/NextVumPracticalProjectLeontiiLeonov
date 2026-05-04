# Development Log - Recipe App

## Project Overview

This project is a full-stack recipe application built with Next.js, Prisma, SQLite, and NextAuth. It was created for the Web Programming practical assignment. The goal was to build a working app with authentication, Prisma-based database access, and full CRUD for one main entity.

The main entity in this project is `Recipe`.

## What the App Does

The application allows users to:

- register for an account
- log in and log out
- access a home page
- create recipes
- view recipe lists
- open a details page for a single recipe
- edit recipes they own
- delete recipes they own
- keep recipes private or publish them to a public community feed

## Main Technical Decisions

### 1. Theme Choice

The selected theme is a recipe app. This fits the assignment well because it supports a clear main entity with multiple useful fields and a natural ownership relationship between users and records.

### 2. Authentication

Authentication is implemented with NextAuth v5 using the credentials provider.

The flow works like this:

1. A user registers with name, email, and password.
2. The password is hashed with `bcryptjs` before being stored.
3. The user can log in with email and password.
4. If the credentials are valid, NextAuth creates a JWT session.
5. Protected routes and protected actions check the current session.
6. Logout redirects the user back to the login page.

An extra improvement was added: after successful registration, the user is automatically logged in.

### 3. Database and Prisma

The database uses SQLite and Prisma ORM.

The schema contains:

- `User`
- `Recipe`

The `Recipe` model belongs to the user who created it through `userId`.

Recipe fields:

- `id`
- `title`
- `description`
- `ingredients`
- `instructions`
- `cookingTime`
- `isPublic`
- `createdAt`
- `updatedAt`
- `userId`

This satisfies the requirement for one main model with theme-specific custom fields. In this project, `ingredients`, `instructions`, and `cookingTime` are core recipe-specific fields. `isPublic` was added later to support private and public recipes.

### 4. CRUD Design

CRUD is implemented through Prisma-backed API routes and App Router pages.

Implemented routes:

- `/recipes` - current user's recipes
- `/community` - public recipes
- `/recipes/new` - create page
- `/recipes/[id]` - details page
- `/recipes/[id]/edit` - edit page
- `/api/recipes`
- `/api/recipes/[id]`

## How CRUD Works

### Create

- The user opens `/recipes/new`
- A form collects title, description, ingredients, instructions, cooking time, and visibility
- The request goes to `POST /api/recipes`
- The API validates the user session and the form values
- Prisma creates the record in SQLite

New recipes are private by default unless the user explicitly marks them as public.

### Read

There are two read views:

- `My Recipes` shows only the signed-in user's recipes
- `Community` shows only public recipes

Each recipe card links to a dynamic details page.

### Details

The details page loads a single recipe by id and shows more information than the list page.

It includes:

- title
- author
- cooking time
- created date
- visibility
- description
- ingredients
- instructions
- owner actions: edit and delete

If a recipe is private and the current user is not the owner, the page is not accessible.

### Update

- The owner opens `/recipes/[id]/edit`
- Existing recipe values are preloaded into the form
- The user edits values and submits the form
- The request goes to `PUT /api/recipes/[id]`
- The API validates ownership and updates the database

### Delete

- The owner can delete a recipe from the details page
- The UI asks for confirmation first
- The request goes to `DELETE /api/recipes/[id]`
- The API validates ownership and removes the record

## Authorization Rules

One of the assignment requirements was to implement at least one ownership rule. This project has several ownership checks:

- only authenticated users can create recipes
- only authenticated users can open create and edit pages
- only the owner can edit a recipe
- only the owner can delete a recipe
- private recipes are visible only to the owner

Ownership is enforced in both the UI and the API:

- UI hides edit/delete actions from other users
- API checks `recipe.userId === session.user.id`

## Validation and Error Handling

The app handles the main failure cases required by the assignment.

### Registration validation

- all fields required
- email format validated
- password must be at least 6 characters
- duplicate emails are blocked

### Login validation

- invalid credentials return an error state
- users are not logged in unless authentication succeeds

### Recipe validation

- all recipe fields are required
- cooking time must be a valid positive number

### Error cases handled

- recipe not found
- unauthorized access
- forbidden updates/deletes
- invalid registration input
- invalid login credentials
- invalid recipe input

## UI and Navigation

The app uses CSS Modules and a shared visual system from `globals.css`.

Navigation behavior:

- the home page changes actions depending on authentication state
- the navbar shows login/register for guests
- the navbar shows logout and recipe navigation for signed-in users
- `My Recipes` and `Community` are presented as navigation buttons in the navbar

Forms use labels and show clear error states.

The app is responsive and remains usable on smaller screens.

## Problems Solved During Development

### 1. Prisma Version Compatibility

Prisma v7 caused setup friction for this SQLite-based assignment. The project uses Prisma 5.22.0 instead, which works cleanly for this use case.

### 2. NextAuth v5 API Changes

NextAuth v5 differs from older versions, especially in App Router usage. The project was adapted to use the proper `auth()`, `signOut()`, and route handler setup.

### 3. Dynamic Route `params` Handling

App Router dynamic routes required updated handling for `params` in server components, client components, and route handlers.

### 4. SQLite Path Issues in Development

The development server selected a different workspace root in some cases, which caused Prisma to fail opening the database file. This was fixed by using an absolute `DATABASE_URL` in `.env`.

### 5. Private vs Public Recipe Behavior

Originally, recipe listing behaved like a global feed. The app was then improved to separate:

- private user-owned recipes
- public community recipes

This made the behavior more intuitive for newly registered users and added stronger ownership boundaries.

## Migrations

Prisma migrations currently included:

- `20260502122828_init`
- `20260504144523_add_recipe_visibility`

## Deliverables Status

The repository currently includes:

- working source code
- Prisma schema
- Prisma migrations
- README
- this development log

The screenshots folder already contains:

- home
- register
- login
- list
- create

Still missing for full assignment completeness:

- details page screenshot
- edit page screenshot

## Conclusion

This project meets the technical goals of the assignment:

- full-stack Next.js app
- authentication working end to end
- Prisma ORM with a real database
- full CRUD for a main resource
- ownership and protected actions
- dynamic details page
- validation and error handling

The current implementation also includes an extra improvement beyond the minimum assignment: recipe privacy with a separate public community feed.
