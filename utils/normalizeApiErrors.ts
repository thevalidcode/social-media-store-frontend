import { AxiosError } from "axios";

type ZodFlattenError = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[]>;
};

type BackendErrorObject = {
  message?: string;
  error?: string | ZodFlattenError;
  errors?: string[];
  details?: { message?: string }[];
};

export function normalizeApiError(
  error: unknown,
  fallback = "An unexpected error occurred"
): string {
  /* ---------------- Axios errors (API responses) ---------------- */
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (!data) {
      return error.message || fallback;
    }

    // Backend returned plain string
    if (typeof data === "string") {
      return data;
    }

    if (typeof data === "object") {
      const payload = data as BackendErrorObject;

      // Zod flatten() error
      if (payload.error && typeof payload.error === "object") {
        const zodError = payload.error as ZodFlattenError;

        if (
          Array.isArray(zodError.formErrors) &&
          zodError.formErrors.length > 0
        ) {
          return zodError.formErrors[0];
        }

        if (zodError.fieldErrors) {
          const firstField = Object.keys(zodError.fieldErrors)[0];
          const messages = zodError.fieldErrors[firstField];

          if (Array.isArray(messages) && messages.length > 0) {
            return messages[0];
          }
        }
      }

      // String-based error fields
      if (typeof payload.message === "string") {
        return payload.message;
      }

      if (typeof payload.error === "string") {
        return payload.error;
      }

      // Array-based validation errors
      if (Array.isArray(payload.errors) && payload.errors.length > 0) {
        return payload.errors[0];
      }

      // Nested error formats
      if (
        Array.isArray(payload.details) &&
        payload.details.length > 0 &&
        payload.details[0]?.message
      ) {
        return payload.details[0].message;
      }
    }

    return fallback;
  }

  /* ---------------- Native JS errors ---------------- */
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
