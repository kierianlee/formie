export async function POST(req: Request) {
  const formData = await req.formData();

  const entries = Object.fromEntries(formData.entries());

  return Response.json(entries);
}
