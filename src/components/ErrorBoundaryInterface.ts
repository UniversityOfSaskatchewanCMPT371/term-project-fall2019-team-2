export interface ErrorBoundaryInterface {
  /**
   * The sentry Event ID
   */
  eventId?: string,
  /**
   * True if an error has occurred
   */
  hasError?: boolean,
  /**
   * The stored error
   */
  error: Error,
  /**
   * Any additional error metadata
   */
  errorInfo?: any
}
