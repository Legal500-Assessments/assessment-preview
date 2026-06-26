# Heroes vs Villains - Monorepo

A monorepo containing a React web application and REST API server for ranking your favorite heroes and villains.

## Project Structure

```
legal500-preview/
├── packages/
│   ├── server/     # REST API server
│   └── web/        # React web application
└── package.json    # Root workspace configuration
```

## Notes

You are free to use any tools or resources you want, however note we are assessing your attention to detail, documentation, code quality and adherence to the task specification.

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start both the server and web app:
   ```bash
   npm run dev
   ```

This will start:
- API server at http://localhost:3001
- Web application at http://localhost:5173

## Available Scripts

- `npm run dev` - Start both server and web app in development mode
- `npm run build` - Build all packages
- `npm run test` - Run tests in all packages
- `npm run lint` - Lint all packages

### Database

There is a docker-compose file that can be used to bring up a Postgres database to be used in your local development environment.

We have provided the scripts to migrate and seed the database for you.

## Packages

### [@legal500-assessment/server](./packages/server)
REST API server that provides character data and CRUD operations.

### [@legal500-assessment/web](./packages/web)
React web application for ranking heroes and villains with drag-and-drop functionality.

## Development

This project uses npm workspaces to manage dependencies across packages. Each package has its own README with specific instructions.

To work on a specific package:
```bash
# Run scripts for a specific workspace
npm run dev --workspace=@legal500-assessment/web
npm run test --workspace=@legal500-assessment/server
```
