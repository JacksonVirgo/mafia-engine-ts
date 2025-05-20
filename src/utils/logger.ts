export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
    private json: boolean = true;
    constructor() {
    }


    private logToConsole(level: LogLevel, message: string, context?: any) {
        const timestamp = new Date().toISOString();
        const formatted = this.json
            ? JSON.stringify({ timestamp, level, message, context })
            : `[${level.toUpperCase()}] ${timestamp} - ${message}${context ? ` | ${JSON.stringify(context)}` : ''}`;

        console.log(formatted);
    }


    private log(level: LogLevel, message: string, context?: any) {
        this.logToConsole(level, message, context);
    }

    debug(message: string, context?: any) {
        this.log('debug', message, context);
    }

    info(message: string, context?: any) {
        this.log('info', message, context);
    }

    warn(message: string, context?: any) {
        this.log('warn', message, context);
    }

    error(message: string, context?: any) {
        this.log('error', message, context);
    }
}
