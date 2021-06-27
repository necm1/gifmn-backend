/**
 * @interface ExceptionResponse
 */
export interface ExceptionResponse {
  name: string;
  message: string;
  stack?: string | string[];
}
