import { authKey } from './auth';
import { submitData } from './submit';
import { buildUserData } from './userData';

// Static headers for all responses.
const RES_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type, x-stellar-site-form-sales-key, User-Agent',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Handle form submission request & respond with a static but contextual JSON response.
 */
async function handleRequest(request: Request) {
  // Authenticate request against forms API key.
  const isValid = await authKey(request);
  // Create single headers object that will be used with all responses.
  const headers = new Headers(RES_HEADERS);

  // Handle a request with an invalid or missing API key.
  if (!isValid) {
    return new Response(JSON.stringify({ success: false, message: 'Authentication Failed.' }), {
      status: 401,
      headers,
    });
  }

  try {
    // Process the submitted JSON data.
    const data = await request.json();

    // Gather User-Agent & Cloudflare object information to attach to the new case.
    const userData = await buildUserData(request);

    // Submit the data to SFDC.
    const submission = await submitData(data, userData);

    if (submission.status !== 200) {
      return new Response(JSON.stringify({ success: false, message: submission.statusText }), {
        status: submission.status,
        headers,
      });
    }

    /**
     * Handle SFDC's silly non-error errors.
     *
     * In the event that a required field is missing (especially in the case of the Org ID),
     * SFDC responds with a 200 OK message, but with the header:
     *
     * Is-Processed: true Exception:common.exception.SalesforceGenericException
     *
     * This header indicates an invalid or missing required field.
     */
    const isProcessedHeader = submission.headers.get('is-processed');
    if (isProcessedHeader && isProcessedHeader.match(/.*Exception.*/g)) {
      return new Response(
        JSON.stringify({ success: false, message: 'An error occurred after submitting the lead.' }),
        { status: 500, headers },
      );
    }

    // Handle a successful form submission.
    return new Response(
      JSON.stringify({ success: true, message: 'Successfully submitted lead.' }),
      { status: 200, headers },
    );
  } catch (err) {
    // Handle any exceptions thrown.
    console.trace(err);
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers,
    });
  }
}

/**
 * Handle CORS preflight.
 */
async function handleCors(request: Request) {
  if (
    request.headers.get('Origin') &&
    request.headers.get('Access-Control-Request-Method') &&
    request.headers.get('Access-Control-Request-Headers')
  ) {
    return new Response(null, { headers: RES_HEADERS });
  } else {
    return new Response(null, { headers: { Allow: 'POST, OPTIONS' } });
  }
}

/**
 * Worker event listener.
 */
addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method === 'OPTIONS') {
    event.respondWith(handleCors(event.request));
  } else {
    event.respondWith(handleRequest(event.request));
  }
});
