# Greeting Card Creator

A web app for creating and sharing greeting cards. Built with React, Fabric.js, and Vite.

## Setup

```bash
npm install
npm run fixtures:fonts   # download font fixtures for tests
npm run fixtures:images  # generate test image fixtures
```

## Development

```bash
npm run dev       # start dev server at http://localhost:5173
npm run build     # type-check + production build
npm run preview   # preview production build
```

## Testing

```bash
npm test                 # unit tests (vitest)
npm run test:watch       # unit tests in watch mode
npm run test:coverage    # unit tests with coverage
npm run test:e2e         # e2e tests (playwright)
npm run test:e2e:ui      # e2e tests with interactive UI
npm run test:e2e:update  # update visual snapshots
npm run test:all         # unit + e2e + merged coverage report
```
