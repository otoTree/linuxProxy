# LinuxProxy

LinuxProxy is a lightweight, high-performance agent built with **Bun**, **Express**, and **TypeScript**. It allows for remote command execution and automated system status reporting. Designed to be compiled into a single standalone binary, it is easy to deploy on various Linux environments without complex dependency management.

## Features

- **Remote Command Execution**: Securely execute shell commands via a REST API.
- **System Monitoring**: Periodically reports system status (CPU, Memory, Load, Uptime, IP) to a configured endpoint.
- **Secure**: specific API Token authentication required for command execution.
- **Portable**: Compiles to a single binary executable using Bun's build capability.
- **High Performance**: Leverages the speed of the Bun runtime.

## Prerequisites

- [Bun](https://bun.com) (latest version recommended)

## Installation

1. Clone the repository (if applicable) or download the source.
2. Install dependencies:

```bash
bun install
```

## Configuration

The application is configured via environment variables. You can set these in a `.env` file or export them in your shell.

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | The port the server listens on. | `3001` |
| `API_TOKEN` | **Required**. The secret token for authenticating API requests. | `undefined` |
| `REPORT_URL` | The URL where system reports are sent (POST request). | `undefined` |
| `MS` | Interval in milliseconds for sending system reports. | `30000` (30s) |
| `TO` | The recipient identifier sent in the report payload. | `admin@agentos.com` |

## Usage

### Development

Run the server in development mode with hot reloading:

```bash
bun dev
```

### Building for Production

Compile the TypeScript code into a single standalone binary executable:

```bash
bun build --compile --minify --sourcemap ./src/index.ts --outfile server
```

This will generate a `server` file in the project root.

### Running the Binary

You can run the generated binary directly. Make sure to set the environment variables:

```bash
export API_TOKEN="your-secret-token"
export REPORT_URL="https://your-monitor.com/api/report"
./server
```

## Helper Script

The `start.sh` script is provided as a convenience wrapper to run the application from **source**. It sets default environment variables and installs dependencies if missing.

```bash
./start.sh
```

**Note**: You can modify `start.sh` to change default configurations or to run the compiled binary instead.

## API Documentation

### 1. Health Check

- **URL**: `/`
- **Method**: `GET`
- **Response**: `Hello World from Bun + Express + TypeScript!`

### 2. Execute Command

Executes a shell command on the host machine.

- **URL**: `/cmd`
- **Method**: `POST`
- **Headers**:
    - `Authorization`: `Bearer <API_TOKEN>`
    - `Content-Type`: `application/json`
- **Body**:
    ```json
    {
      "command": "ls -la"
    }
    ```
- **Success Response (200)**:
    ```json
    {
      "stdout": "...",
      "stderr": ""
    }
    ```
- **Error Response**:
    - `401 Unauthorized`: Missing or invalid token.
    - `400 Bad Request`: Missing command.
    - `500 Internal Server Error`: Command execution failed.

## System Reporting

If `REPORT_URL` is set, the application starts a background task that sends system metrics every `MS` milliseconds.

**Report Payload (Multipart/Form-Data):**

- `from`: Local IP address
- `to`: Configured `TO` address
- `subject`: `System Status Report - <Hostname>`
- `text`: JSON string containing:
    - Hostname, Platform, Arch
    - IP Address
    - CPU Info & Load Average
    - Memory Usage (Total, Free, Used)
    - Uptime
    - Timestamp

## Project Structure

```
├── src/
│   ├── config/       # Configuration logic
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Express middleware (Auth)
│   ├── routes/       # API route definitions
│   ├── tasks/        # Background tasks (System Report)
│   ├── utils/        # Utility functions
│   ├── app.ts        # Express app setup
│   └── index.ts      # Entry point
├── server            # Compiled binary (generated)
├── start.sh          # Helper script
└── README.md         # Documentation
```

## License

MIT
