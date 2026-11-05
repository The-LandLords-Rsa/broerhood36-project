import { createHash } from 'node:crypto';

export const getPayFastBaseUrl = (): string => {
  const mode = Deno.env.get('PAYFAST_MODE')?.trim().toLowerCase() || 'sandbox';
  if (mode !== 'sandbox' && mode !== 'live') {
    throw new Error('PAYFAST_MODE must be either sandbox or live.');
  }
  return mode === 'live' ? 'https://www.payfast.co.za' : 'https://sandbox.payfast.co.za';
};

const encodePayFastValue = (value: string): string =>
  encodeURIComponent(value.trim()).replace(/%20/g, '+');

export const createPayFastSignature = (
  parameters: Record<string, string>,
  passphrase?: string
): string => {
  const signedParameters = Object.entries(parameters)
    .filter(([key, value]) => key !== 'signature' && value !== '')
    .map(([key, value]) => `${key}=${encodePayFastValue(value)}`);

  if (passphrase) {
    signedParameters.push(`passphrase=${encodePayFastValue(passphrase)}`);
  }

  return createHash('md5').update(signedParameters.join('&'), 'utf8').digest('hex');
};

export const constantTimeEqual = (first: string, second: string): boolean => {
  if (first.length !== second.length) return false;
  let difference = 0;
  for (let index = 0; index < first.length; index += 1) {
    difference |= first.charCodeAt(index) ^ second.charCodeAt(index);
  }
  return difference === 0;
};
