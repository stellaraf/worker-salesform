/**
 * Authenticate the request via header token.
 */
export async function authKey(request: Request) {
  let isValid = false;
  const key = request.headers.get('x-stellar-site-form-sales-key');
  if (key && key === SITE_FORM_SALES_KEY) {
    isValid = true;
  }
  return isValid;
}
