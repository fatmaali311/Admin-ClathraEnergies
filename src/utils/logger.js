// Lightweight logger that only prints in development
let isDev = false;
try {
  // import.meta is supported in ESM/Vite environments
  isDev = !!(import.meta && import.meta.env && import.meta.env.MODE !== 'production');
} catch (e) {
  void e; // ignore unused
  isDev = false;
}

const safeLog = (...args) => {
  if (isDev) console.log(...args);
};

const safeInfo = (...args) => {
  if (isDev) console.info(...args);
};

const safeWarn = (...args) => {
  if (isDev) console.warn(...args);
};

const safeError = (...args) => {
  if (isDev) console.error(...args);
};

export default {
  log: safeLog,
  info: safeInfo,
  warn: safeWarn,
  error: safeError,
};
