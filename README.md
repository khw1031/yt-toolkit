# YouTube Tools Monorepo

This monorepo contains a collection of tools and utilities for working with YouTube data.

## Packages

- [`yt-toolkit`](./packages/yt-toolkit) - YouTube transcript, duration, and comments fetcher written in TypeScript.

## Development

This project uses [pnpm](https://pnpm.io/) as its package manager and [Turborepo](https://turborepo.org/) for managing the monorepo.

### Prerequisites

- Node.js >= 20.18.3
- pnpm >= 10.4.1

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests across all packages
pnpm test
```

### Available Scripts

- `pnpm build` - Build all packages
- `pnpm dev` - Run all packages in development mode
- `pnpm test` - Run tests for all packages
- `pnpm lint` - Run linting for all packages
- `pnpm clean` - Clean build outputs
- `pnpm attw` - Check if types are wrong (Are The Types Wrong)

## Project Structure

```
.
├── packages/
│   └── yt-toolkit/  # YouTube data fetching utilities
└── ...
```

## License

ISC
