# Project Overview

This project is a full-stack TypeScript application. It uses React for the frontend and Express for the backend. The frontend and backend are developed in the `client` and `server` directories, respectively.

## Building and Running

### Development

Prompt the user to run the development server themselves in a separate terminal window.

```bash
npm run dev
```

This will start the Vite development server for the client and the `tsx` watcher for the server.

- The client will be available at `http://localhost:5173`.
- The server will be available at `http://localhost:3000`.

### Production

To build the project for production, use the following command:

```bash
npm run build
```

This will create a `dist` directory with the bundled client and server files.

To start the server in production mode, use the following command:

```bash
npm start
```

### Testing

To run the tests, use the following command:

```bash
npm test -- --run
```

## Development Conventions

### Linting

This project uses ESLint to enforce code quality. To run the linter, use the following command:

```bash
npm run lint
```

### Formatting

This project uses Prettier to format the code. To format the code, use the following command:

```bash
npm run format
```

## PromptKit Quick Reference
- Review the available artefacts when the student requests them:
  - Protocol: `promptkit/protocols/setup.md` — instructions for updating these CLI briefings.
  - Workflow: `promptkit/workflows/tutor.md` — guide for tutoring/explanation sessions.
  - Workflow: `promptkit/workflows/reflect.md` — guide for documenting outcomes and next steps.
- Student notes live in `promptkit/notes/`; The table in `progress-journal.md` is main place to update with reflections. Instructor Activities are in `promptkit/activities/` (read-only).
- When new workflows arrive, expect additional files under `promptkit/workflows/`.