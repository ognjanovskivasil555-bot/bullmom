// api/search.js
export const config = { runtime: 'edge' };

const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAANir%2BgEAAAAA4YTulXSnJ%2FQMrehQso8AX5oKrqc%3DCTE7SW1w5nrLP9Okz9vEyxz6LiVjjNiTGk7CDcyslaU5jAERHO";

export default async function handler(req) {
  try {
    const query = encodeURIComponent('from:helenahseva');
    const url = `https://api.x.com/2/tweets/search/recent?query=${query}&tweet.fields=created_at&max_results=10`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    });

    const data = await response.json();

    if (data.errors) {
      return new Response(JSON.stringify({ error: data.errors[0].message }), { status: 400 });
    }

    const posts = data.data?.map(tweet => ({
      text: tweet.text,
      created_at: tweet.created_at,
    })) || [];

    return new Response(JSON.stringify({ posts, count: posts.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
