type LogDetails = Record<string, unknown>;

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { message: String(error) };
};

const createLogEntry = (message: string, details: LogDetails = {}) =>
  JSON.stringify({
    message,
    timestamp: new Date().toISOString(),
    ...details,
  });

export const logWorkerInfo = (message: string, details?: LogDetails) => {
  console.log(createLogEntry(message, details));
};

export const logWorkerWarning = (message: string, details?: LogDetails) => {
  console.warn(createLogEntry(message, details));
};

export const logWorkerError = (
  message: string,
  error: unknown,
  details?: LogDetails,
) => {
  console.error(
    createLogEntry(message, {
      ...details,
      error: serializeError(error),
    }),
  );
};
