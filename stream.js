// api/search.js
export const config = { runtime: 'edge' };

const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAIyg%2BgEAAAAATNIpxV8HdwKrMpuIq7%2FEkfe0pwI%3D3SVm6M3c4gDOihuPElZNvh8ZWZsJsYOPBbT915nHz7H12keU34";

export default async function handler(req) {
  const query = encodeURIComponent('from:helenahseva $BULLMOM');
  const url = `https://api.x.com/2/tweets/search/recent?query=${query}&tweet.fields=created_at&max_results=5`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
  });

  const data = await response.json();

  const posts = data.data?.map(tweet => ({
    text: tweet.text,
    created_at: tweet.created_at,
  })) || [];

  return new Response(JSON.stringify({ posts }), {
    headers: { "Content-Type": "application/json" },
  });
}
