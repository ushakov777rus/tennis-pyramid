export async function GET(): Promise<Response> {
  return new Response(null, {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export async function HEAD(): Promise<Response> {
  return new Response(null, {
    status: 410,
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
