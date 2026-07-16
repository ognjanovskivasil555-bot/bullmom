// api/get-token.js
export const config = { runtime: 'edge' };

const consumerKey = 'UuCQhaQyWBD7aenRLZjKNdCYN';
const consumerSecret = 'dlUcDaDcFS35NutnLGCanlzb7Wtd8fXsHk82zJVxKo7tQZzPsj';

export default async function handler(req) {
  const credentials = btoa(`${consumerKey}:${consumerSecret}`);

  const response = await fetch('https://api.x.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();

  return new Response(JSON.stringify({
    bearer_token: data.access_token
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
