# LinuxProxy

A high-performance web server template built with **Bun**, **Express**, and **TypeScript**. This project demonstrates how to set up a modern backend environment and compile it into a standalone binary for easy deployment.

## Tech Stack

- **Runtime**: [Bun](https://bun.com) - A fast all-in-one JavaScript runtime.
- **Framework**: [Express](https://expressjs.com) - Fast, unopinionated, minimalist web framework.
- **Language**: [TypeScript](https://www.typescriptlang.org) - JavaScript with syntax for types.

## Prerequisites

- [Bun](https://bun.com) (latest version recommended)

## Installation

Install the dependencies:

```bash
bun install
```

## Development

Run the server in development mode with hot reloading:

```bash
bun dev
```

The server will start at `http://localhost:3000`.

## Build & Deployment

This project supports compiling the TypeScript code into a single standalone binary executable, making deployment simple (no need to install Node.js/Bun or dependencies on the target machine, provided the architecture matches).

### 1. Compile to Binary

Run the following command to build the binary:

```bash
bun build --compile --minify --sourcemap ./src/index.ts --outfile server
```

This will generate a `server` file in the project root.

### 2. Run the Binary

You can use the provided shell script to run the binary:

```bash
./start.sh
```

Or run the binary directly:

```bash
./server
```

## Project Structure

```
├── src/
│   └── index.ts      # Application entry point
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── server            # Compiled binary (generated)
├── start.sh          # Helper script to run the binary
└── README.md         # Project documentation
```
