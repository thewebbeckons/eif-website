/**
 * Runs an API call and reports the outcome as a toast. Resolves to the
 * response, or to `null` when the call failed (the error has been shown).
 */
export const useApiAction = () => {
  const toast = useToast();
  const { refresh } = useAuth();

  return async <T>(
    call: () => Promise<T>,
    success?: string,
  ): Promise<T | null> => {
    try {
      const result = await call();
      if (success) toast.add({ title: success, color: "success" });
      return result;
    } catch (error) {
      const { statusCode, data } = error as {
        statusCode?: number;
        data?: { message?: string; statusMessage?: string };
      };
      // The session ended (expired, or no longer in the Discord server).
      if (statusCode === 401) await refresh();
      toast.add({
        title:
          data?.message ||
          data?.statusMessage ||
          "Something went wrong. Please try again.",
        color: "error",
      });
      return null;
    }
  };
};
