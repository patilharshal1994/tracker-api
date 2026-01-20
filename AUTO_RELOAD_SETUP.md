# Auto-Reload Setup for Backend Server

## ✅ Setup Complete!

The backend server now has **auto-reload** enabled using `nodemon`.

## How to Use

### Development Mode (Auto-Reload)
```bash
cd tracker-api
npm run dev
```

This will:
- ✅ Automatically restart the server when you change any `.js` file
- ✅ Watch all routes, controllers, middleware, and src files
- ✅ Ignore node_modules and test files
- ✅ Restart with a 500ms delay to avoid rapid restarts

### Production Mode (No Auto-Reload)
```bash
cd tracker-api
npm start
```

## What Gets Watched

- `server.js`
- `routes/` directory
- `controllers/` directory
- `middleware/` directory
- `src/` directory (services, models, validators, utils)
- `config/` directory

## Configuration

The configuration is in `nodemon.json`. You can customize:
- Which files/directories to watch
- File extensions to watch
- Files/directories to ignore
- Restart delay

## Benefits

- ✅ No more manual server restarts!
- ✅ Changes to validators, controllers, routes, services are picked up automatically
- ✅ Faster development workflow
- ✅ See errors immediately when code changes

## Troubleshooting

If auto-reload isn't working:
1. Make sure you're using `npm run dev` (not `npm start`)
2. Check that `nodemon` is installed: `npm list nodemon`
3. Check the console for nodemon messages
4. Verify the file you changed is in a watched directory

