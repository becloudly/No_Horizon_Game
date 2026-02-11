# No Horizon Game

A high-performance Electron application powered by Bun runtime.

## Architecture

- **Main Process**: Bun runtime (`src/main/`)
- **Preload**: Secure IPC bridge (`src/preload/`)
- **Renderer**: UI layer (`src/renderer/`)
- **Shared**: Cross-process types (`src/shared/`)
- **Lib**: Modular utilities (`src/lib/`)

## Setup

```bash
bun install
```

## Development

```bash
bun run dev
```

## Performance Features

- Context isolation enabled
- Node integration disabled
- Sandbox mode active
- Hardware acceleration enabled
- Modular architecture for tree-shaking
