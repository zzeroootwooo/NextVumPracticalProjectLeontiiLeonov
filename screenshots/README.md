# Screenshots Instructions

To complete the assignment deliverables, you need to provide screenshots of all main pages.

## Required Screenshots

Please take screenshots of the following pages and save them in this folder:

1. **register.png** - Registration page (`/register`)
2. **login.png** - Login page (`/login`)
3. **home.png** - Home page (`/`)
4. **recipes-list.png** - List of all recipes (`/recipes`)
5. **recipe-create.png** - Create new recipe form (`/recipes/new`)
6. **recipe-details.png** - Single recipe details page (`/recipes/[id]`)
7. **recipe-edit.png** - Edit recipe form (`/recipes/[id]/edit`)

## How to Take Screenshots

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

3. Navigate to each page and take screenshots:
   - Use your OS screenshot tool (Command+Shift+4 on Mac, Windows+Shift+S on Windows)
   - Make sure the full page is visible
   - Save with the filename listed above

4. For pages requiring authentication:
   - First register a new account
   - Login with your credentials
   - Then access the protected pages

5. To screenshot the edit page:
   - First create a recipe
   - View its details
   - Click the "Edit" button
   - Take screenshot of the edit form

## Tips

- Use a consistent browser window size for all screenshots
- Make sure the Navbar is visible in screenshots
- Include any data/recipes you create for demonstration
- Screenshots should show the modern purple-indigo gradient design

After taking all screenshots, your folder structure should look like:
```
screenshots/
├── README.md (this file)
├── register.png
├── login.png
├── home.png
├── recipes-list.png
├── recipe-create.png
├── recipe-details.png
└── recipe-edit.png
```
