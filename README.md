[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/CandraJulius.envpicker)](https://marketplace.visualstudio.com/items?itemName=CandraJulius.envpicker)

# envpicker

A simple VSCode extension for managing multiple `.env` files in your project.

## Overview

envpicker helps you switch between different environment configurations without manually copying files. Initialize your environment templates once, then switch between them with a single click from the status bar.

## Features

- **Quick switch** — pick active environment from status bar or Command Palette
- **Auto gitignore** — `.env` and `.env-libs` are automatically added to `.gitignore` on init
- **Persistent state** — remembers your active environment across VSCode sessions
- **Production warning** — status bar shows a warning icon when production is active

## Usage

### 1. Initialize

Open Command Palette (`Ctrl+Shift+P`) and run:

```
Epicker: init
```

This will generate:

```
your-project/
├── .env-libs/
│   ├── .env.development
│   ├── .env.staging
│   └── .env.production
└── .gitignore  (auto-updated)
```

### 2. Edit your environment files

Fill in each file inside `.env-libs/` with the appropriate values for each environment.

You can also add custom environment files following the same pattern:

```
.env-libs/.env.{name}
```

### 3. Activate an environment

Click the status bar item at the bottom left, or run:

```
Epicker: Pick Environment
```

Select your environment from the Quick Pick menu. The active `.env` will be copied to your project root automatically.

## Status Bar

| State | Appearance |
|---|---|
| No active env | `⬡ env: none` |
| Active env | `◆ env: staging` |
| Production active | `⚠ ◆ env: production` |

## Requirements

- VSCode `^1.100.0`

## File Structure

```
your-project/
├── .env-libs/          # environment templates (committed to .gitignore)
│   ├── .env.development
│   ├── .env.staging
│   └── .env.production
├── .env                # active environment (auto-generated, gitignored)
└── .gitignore
```

## Limitations

- Single root workspace only (multi-root workspace not supported in v1)
- Local development use only — do not commit `.env` or `.env-libs` to version control

## License

ISC