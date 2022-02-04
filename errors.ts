export interface GyazoErrorResponse {
  status: number;
  message: string;
  request: string;
  method: string;
}

/** responseが想定されるerorr objectかどうか */
export function isErrorResponse(
  error: unknown,
): error is Omit<GyazoErrorResponse, "status"> {
  if (!isObject(error)) return false;
  if (typeof error.message !== "string") return false;
  if (typeof error.request !== "string") return false;
  if (typeof error.method !== "string") return false;
  return true;
}

/** error responseから`GyazoErorrResponse`を作る
 *
 * 未知のresponseの場合は例外を投げる
 */
export function getGyazoError(
  status: number,
  errorText: string,
): GyazoErrorResponse {
  try {
    const error = JSON.parse(errorText);
    if (isErrorResponse(error)) return { status, ...error };
  } catch (e: unknown) {
    if (!(e instanceof SyntaxError)) throw e;
  }
  throw makeUnexpoectedError(errorText);
}

function makeUnexpoectedError(message: string) {
  const unexpectedError = new Error();
  unexpectedError.name = "UnexpctedResponseError";
  unexpectedError.message = message;
  return unexpectedError;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return value != null;
}
