export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/jobs/${id}/flag-reason`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}