const dayjs = require('dayjs'); 
const chalk = require('chalk'); 

function createLogger(options = {}) {
    const {
        logHeaders = false,
        logBody = false,
        logLevel = 'info',
        timestampFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ',
        logIP = false,
        logResponseData = false,
        jsonLogs = false,
        customRouteLogger = null,
        sessionContext = false
    } = options;

    const levels = ['error', 'warn', 'info', 'debug'];

    function shouldLog(level) {
        return levels.indexOf(level) <= levels.indexOf(logLevel);
    }

    function formatTimestamp() {
        return dayjs().format(timestampFormat);
    }

    function logWithColor(level, message) {
        switch (level) {
            case 'error':
                return chalk.red(message);
            case 'warn':
                return chalk.yellow(message);
            case 'info':
                return chalk.green(message);
            case 'debug':
                return chalk.cyan(message);
            default:
                return message;
        }
    }

    function logJson(data) {
        if (jsonLogs) {
            console.log(JSON.stringify(data, null, 2)); 
        }
    }

    return function simpleLogger(req, res, next) {
        const { method, url, headers, body } = req;
        const timestamp = formatTimestamp(); 
        const ip = req.ip || req.connection.remoteAddress; 
        const sessionID = req.session ? req.session.id : null; 
        const logData = {
            timestamp,
            method,
            url,
            ip,
            sessionID,
            statusCode: res.statusCode,
            headers: req.headers,
            body: req.body
        };

        if (customRouteLogger && customRouteLogger(url)) {
            logJson(logData);
        }

        if (shouldLog('info')) {
            const logMessage = `[${timestamp}] [INFO] ${method} ${url}` + (logIP ? ` - IP: ${ip}` : '');
            if (jsonLogs) {
                logJson(logData);
            } else {
                console.log(logWithColor('info', logMessage));
            }
        }

        if (logHeaders && shouldLog('debug')) {
            const headersMessage = `[${timestamp}] [DEBUG] Headers: ${JSON.stringify(headers)}`;
            if (jsonLogs) {
                logJson(logData);
            } else {
                console.log(logWithColor('debug', headersMessage));
            }
        }

        if (logBody && body && Object.keys(body).length && shouldLog('debug')) {
            const bodyMessage = `[${timestamp}] [DEBUG] Body: ${JSON.stringify(body)}`;
            if (jsonLogs) {
                logJson(logData);
            } else {
                console.log(logWithColor('debug', bodyMessage));
            }
        }

        res.on('finish', () => {
            if (logResponseData && shouldLog('info')) {
                const responseMessage = `[${timestamp}] [INFO] Response sent with status code ${res.statusCode}`;
                if (jsonLogs) {
                    logJson(logData);
                } else {
                    console.log(logWithColor('info', responseMessage));
                }
            }

            if (res.statusCode >= 400 && shouldLog('warn')) {
                const warnMessage = `[${timestamp}] [WARN] ${method} ${url} - Status Code: ${res.statusCode}`;
                if (jsonLogs) {
                    logJson(logData);
                } else {
                    console.log(logWithColor('warn', warnMessage));
                }
            }

            if (res.statusCode >= 500 && shouldLog('error')) {
                const errorMessage = `[${timestamp}] [ERROR] ${method} ${url} - Status Code: ${res.statusCode}`;
                if (jsonLogs) {
                    logJson(logData);
                } else {
                    console.log(logWithColor('error', errorMessage));
                }
            }
        });

        res.on('error', (err) => {
            if (shouldLog('error')) {
                console.error(`[${timestamp}] [ERROR] ${method} ${url} - Error: ${err.message}`);
            }
        });

        next();
    };
}

module.exports = createLogger;
