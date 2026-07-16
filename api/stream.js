// api/stream.js
export const config = { runtime: 'edge' };

const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAANir%2BgEAAAAAZH6dJaBgW84ytZufdhjFqqyLJrM%3DAQ884kkInlJHnZMoeTz23GtXXCUenm0jFWUooVyxb7XkVrQTPW";

export default async function handler(req) {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(
          "https://api.x.com/2/tweets/search/stream?tweet.fields=created_at",
          {
            headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
          }
        );

        if (!response.ok) {
          controller.enqueue(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data:")) {
              try {
                const data = JSON.parse(line.replace("data:", "").trim());
                if (data.data?.text) {
                  controller.enqueue(
                    `data: ${JSON.stringify({
                      text: data.data.text,
                      created_at: data.data.created_at,
                    })}\n\n`
                  );
                }
              } catch (_) {}
            }
          }
        }
      } catch (err) {
        controller.enqueue(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
