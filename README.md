# Log-It-Express

`log-it-express` is a lightweight and flexible logging middleware for Express.js applications. It provides detailed and customizable logs for HTTP requests and responses, making it easier to monitor and debug your applications.

## Features

- **Log Levels**: Supports `error`, `warn`, `info`, and `debug` levels for customizable verbosity.
- **Color-Coded Logs**: Uses color coding to differentiate log levels for easier readability.
- **Timestamp Formatting**: Customizable timestamp formats using `dayjs`.
- **IP Address Logging**: Logs the IP address of incoming requests.
- **Conditional Logging**: Log specific requests based on route or condition.
- **Custom Middleware for Specific Routes**: Apply logging only to specific routes.
- **Structured JSON Logs**: Output logs in JSON format for easy integration with logging systems.
- **Session-Based Context**: Track logs for specific sessions or requests.
- **Error Handling**: Automatically logs errors for failed requests.
- **Response Data Logging**: Optionally log response status and data.

## Installation

Install the package using npm:

```bash
npm install log-it-express
```

## Usage

Integrate `log-it-express` into your Express application:

```javascript
const express = require('express');
const logItExpress = require('log-it-express');

const app = express();

// Use the middleware with custom options
app.use(
    logItExpress({
        logLevel: 'debug',         // Log verbosity level
        logHeaders: true,          // Log request headers
        logBody: true,             // Log request body
        logIP: true,               // Log client IP address
        logResponseData: true,     // Log response data
        jsonLogs: true,            // Output logs as JSON
        customRouteLogger: (url) => url === '/test', // Log only for specific routes
        sessionContext: true,      // Track logs per session
        timestampFormat: 'YYYY-MM-DD HH:mm:ss', // Custom timestamp format
    })
);

// Example routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/test', (req, res) => {
    res.send('Testing the logger!');
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

## Configuration Options

| Option               | Type                | Default                   | Description                                                                 |
|----------------------|---------------------|---------------------------|-----------------------------------------------------------------------------|
| `logLevel`           | `string`           | `info`                    | Log verbosity level: `error`, `warn`, `info`, or `debug`.                  |
| `logHeaders`         | `boolean`          | `false`                   | Log request headers.                                                       |
| `logBody`            | `boolean`          | `false`                   | Log request body.                                                          |
| `logIP`              | `boolean`          | `false`                   | Log the client’s IP address.                                               |
| `logResponseData`    | `boolean`          | `false`                   | Log response status and data.                                              |
| `jsonLogs`           | `boolean`          | `false`                   | Output logs in structured JSON format.                                     |
| `customRouteLogger`  | `function`         | `null`                    | Custom logic to log specific routes.                                       |
| `sessionContext`     | `boolean`          | `false`                   | Track session or request-based context.                                    |
| `timestampFormat`    | `string`           | `YYYY-MM-DDTHH:mm:ss.SSSZ`| Customize the format of timestamps using [dayjs](https://day.js.org/).     |

## Examples

### 1. Simple Logging

```javascript
app.use(logItExpress());
```

### 2. Logging with Headers and Body

```javascript
app.use(
    logItExpress({
        logHeaders: true,
        logBody: true,
    })
);
```

### 3. Debug-Level Logging with Color Coding

```javascript
app.use(
    logItExpress({
        logLevel: 'debug',
    })
);
```

### 4. JSON Logs with IP Address Logging

```javascript
app.use(
    logItExpress({
        jsonLogs: true,
        logIP: true,
    })
);
```

## Development

Feel free to contribute to this package by submitting issues or pull requests. Clone the repository:

```bash
git clone https://github.com/RiyazN0921/log-it-express.git
```

## License

This package is licensed under the [MIT License](LICENSE).

## Author

Developed by **Riyaz Nadaf**. For any queries or feedback, feel free to contact me!

