// Last X-Correlation-Id seen on a BFF/API call — attached to client-error reports.

let lastCorrelationId: string | undefined;

export function rememberCorrelationId(id: string): void {
  lastCorrelationId = id;
}

export function getLastCorrelationId(): string | undefined {
  return lastCorrelationId;
}
