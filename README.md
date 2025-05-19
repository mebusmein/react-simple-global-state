# React Simple Global State

A lightweight and flexible state management solution for React applications with built-in persistence support.

## Overview

This project provides a simple yet powerful state management system that combines global state management with persistence capabilities. It's designed to be modular, type-safe, and easy to integrate into React applications.

## Project Structure

```
src/
├── state/                    # Core state management
│   ├── globalState.ts       # Global state implementation
│   ├── stateInitialiser.ts  # State initialization utilities
│   ├── persistance/         # Persistence middleware
│   └── utils/              # State management utilities
│
├── modules/                 # Feature modules
│   ├── Search/             # Example module
│   │   ├── state/         # Module-specific state
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── queries/      # Data fetching logic
│   │   └── actions/      # State actions
│   └── ...
│
└── main.tsx                # Application entry point
```

## Core Concepts

### Global State

The global state system provides a simple way to manage application state with the following features:

- Type-safe state management
- Subscription-based updates
- Middleware support
- Persistence capabilities

### Persistence System

The persistence system allows you to:

- Save state to various storage backends
- Load state on application startup
- Validate state during loading
- Handle persistence errors
- Clear persisted state

### Module System

The project follows a modular architecture where each feature is organized into its own module. Each module typically contains:

- State management
- React components
- Custom hooks
- Data fetching logic
- State actions

## Features

- 🔒 Type-safe state management
- 💾 Built-in persistence support
- 🔄 Automatic state synchronization
- 🎯 Modular architecture
- ⚡ Lightweight and performant
- 🔍 Validation support
- 🛠️ Middleware system

## Development

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

3. Build for production:

```bash
pnpm build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
