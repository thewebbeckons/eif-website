import type { H3Event } from "h3";
import type { RequestCoordinator } from "../durable-objects/request-coordinator";

export type RequestCoordinatorNamespace =
  DurableObjectNamespace<RequestCoordinator>;

const isRequestCoordinatorNamespace = (
  value: unknown,
): value is RequestCoordinatorNamespace =>
  typeof value === "object" &&
  value !== null &&
  "getByName" in value &&
  typeof value.getByName === "function";

export const getCloudflareEnvironment = (
  event: H3Event,
): Record<string, unknown> => {
  const context = event.context as Record<string, unknown>;
  const platform = context._platform as Record<string, unknown> | undefined;
  const cloudflare =
    (platform?.cloudflare as Record<string, unknown> | undefined) ||
    (context.cloudflare as Record<string, unknown> | undefined);

  return (cloudflare?.env as Record<string, unknown> | undefined) || {};
};

export const getEnvironmentString = (
  environment: Record<string, unknown>,
  key: string,
) => {
  const value = environment[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
};

export const getRequestCoordinatorNamespace = (
  environment: Record<string, unknown>,
): RequestCoordinatorNamespace | undefined => {
  const value = environment.REQUEST_COORDINATOR;
  return isRequestCoordinatorNamespace(value) ? value : undefined;
};
