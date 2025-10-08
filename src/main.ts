import process from 'node:process'
import bot from './bot/bot'
import server from './http/app'
import { logger } from './logger'

// suppress warnings from discord.js about clientReady event
process.on('warning', (error) => {
  if (error.message.includes('clientReady')) {
    return
  }

  logger.warn(`⚠️ ${error}`)
})

// graceful shutdown
async function shutdown(signal: string) {
  logger.info(`👋 \nReceived ${signal}, shutting down gracefully...`)

  try {
    await bot.stop()
    logger.info('✅ Discord client disconnected')

    await server.stop()
    logger.info('🛑 HTTP server stopped')

    process.exit(0)
  }
  catch (error) {
    logger.error({ error }, '❌ Error during shutdown')
    process.exit(1)
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

await bot.start()
await server.start()
