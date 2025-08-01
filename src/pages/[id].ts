import type { APIRoute } from "astro";
import { turso } from "@/libs/db";


export const prerender = false

export const GET: APIRoute = async ({ params, redirect }) => {

  if (!params.id) {
    return new Response(JSON.stringify("ID is required"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const results = await turso.execute('SELECT url, password FROM urls WHERE id = ?', [params.id]);
  if (results.rows.length === 0) {
    return new Response(JSON.stringify("URL not found"), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { url, password } = results.rows[0];
if(password) return redirect(`/auth/${params.id}`, 307);

  if (!url) {
    return new Response(JSON.stringify("URL is empty"), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return redirect(url?.toString(), 307);
}

