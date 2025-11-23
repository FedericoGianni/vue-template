const isDebug = import.meta.env.VITE_APP_DEBUG === 'true' || import.meta.env.DEV

export const logger = {
  log: (...args: any[]) => {
    if (isDebug) {
      console.log(...args)
    }
  },
  error: (...args: any[]) => {
    // Always log errors
    console.error(...args)
  },
  warn: (...args: any[]) => {
    if (isDebug) {
      console.warn(...args)
    }
  },
  info: (...args: any[]) => {
    if (isDebug) {
      console.info(...args)
    }
  },
}
