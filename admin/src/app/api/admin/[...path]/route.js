import { backendFetch } from "@/lib/backendFetch";

async function handler(request, { params }) {
  const { path } = await params;
  const { search } = new URL(request.url);
  const targetPath = `/api/v1/admin/${path.join("/")}${search}`;

  const options = { method: request.method };
  if (request.method !== "GET" && request.method !== "DELETE") {
    options.headers = { "Content-Type": "application/json" };
    options.body = await request.text();
  }

  const result = await backendFetch(targetPath, options);
  return Response.json(result.data, { status: result.status });
}

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };