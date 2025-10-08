import pino from 'pino'

const pinoPrettyTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'HH:MM:ss',
    ignore: 'pid,hostname',
  },
}

export const logger = pino({
  level: Bun.env.LOG_LEVEL ?? 'info',
  transport: Bun.env.ENVIRONMENT === 'development' ? pinoPrettyTransport : undefined,
})

export function logFn(level: string, ...args: any[]) {
  const [msg, ...rest] = args
  switch (level) {
    case 'debug':
      logger.debug(msg, ...rest)
      break
    case 'info':
      logger.info(msg, ...rest)
      break
    case 'warn':
      logger.warn(msg, ...rest)
      break
    case 'error':
      logger.error(msg, ...rest)
      break
    case 'fatal':
      logger.fatal(msg, ...rest)
      break
    case 'trace':
      logger.trace(msg, ...rest)
      break
    case 'silent':
      break
    default:
      logger.info(msg, ...rest)
      break
  }
}
