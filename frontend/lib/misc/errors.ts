/**
 * Get assorted error messages: messages for fields (validation) and general errors
 */
export function apiError(
  err: {
    data: {
      code?: number;
      message?: string;
      path?: string[];
      errors?: { code: number; message: string; path: string[] }[];
    };
  },
  getMessage = true,
  defaultMessage = ''
): { errors: (string | number)[]; fields: { [k: string]: string | number } } {
  if (err?.data?.code) {
    return {
      errors: [getMessage ? getErrorMsg(err.data.code, defaultMessage) : err.data.code],
      fields: {},
    };
  }

  if (!err?.data?.errors || !Array.isArray(err.data.errors) || !err.data.errors.length) {
    return { errors: [getMessage ? getErrorMsg(undefined, defaultMessage) : 500001], fields: {} };
  }

  const res = {
    errors: [] as (string | number)[],
    fields: {} as { [k: string]: string | number },
  };

  err.data.errors.forEach(e => {
    if (e.path && e.path.length && typeof e.path[0] === 'string') {
      res.fields[e.path[0]] = getMessage ? getErrorMsg(e.code, defaultMessage) : e.code;
    } else {
      res.errors.push(getMessage ? getErrorMsg(e.code, defaultMessage) : e.code);
    }
  });

  return res;
}

export function getErrorMsg(code = 500001, defaultMessage = '') {
  if (code === 500001 && defaultMessage) {
    return defaultMessage;
  }

  if (!(code in ErrorCodes)) {
    return defaultMessage || ErrorCodes[500001];
  }

  return ErrorCodes[code];
}

/**
 * Define message for each error
 */
export const ErrorCodes = {
  400000: 'Invalid request',
  400001: 'Profile not identified',
  400002: 'Profile credentials invalid',
  400003: 'Request token invalid',
  400004: 'User does not exists',
  400005: 'Signature not present',
  400006: 'Request token not present',
  400007: 'Airdrop already claimed',
  400008: 'Poap drop does not exists',
  400009: 'Drop already reserved',
  400010: 'Drop reservation does not exists',
  400011: 'Please login with admin wallet',
  403005: 'Time to claim the airdrop has expired',

  // SystemErrorCode
  500000: 'DEFAULT_SYSTEM_ERROR',
  500001: 'There was an error with your request. Please try again later.',
  500002: 'SQL_SYSTEM_ERROR',
  500003: 'VECTOR_DB_SYSTEM_ERROR',
  500004: 'EMAIL_SYSTEM_ERROR',
} as { [k: number]: string };
