import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { Request, Response, Headers } = require('cross-fetch');
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Ensure Response.json is available for NextResponse.json to fall back to if Next.js relies on it
if (!global.Response.json) {
  global.Response.json = function(data, init) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
      }
    });
  };
}
