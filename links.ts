import { type APIRoute } from 'astro';
import { turso } from "@/libs/db";
import {verifyPassword} from '@libs/hasher'
export const prerender = false;

export const GET: APIRoute = async ({params, request }) => {
  const { searchParams } = new URL(request.url);
  const id = params.id || searchParams.get('id')  

  try {
    const result = await turso.execute(`SELECT id, case when password is null then url else "protected" end as url, created_at FROM urls ${id ? `WHERE id = ?` : ''} ORDER BY created_at DESC LIMIT 20`, id ? [id] : []);
    const urls = result.rows.map(row => ({
      id: row.id,
      url: row.url,
      createdAt: row.created_at
    }));

    return new Response(JSON.stringify(urls), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch{
    return new Response(JSON.stringify("Failed to fetch URLs"), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}


export const POST: APIRoute = async ({ request, redirect }) => {
  const data = await request.formData()

  const { id, password } = Object.fromEntries(data.entries());


  if (!id) {
    return new Response(JSON.stringify("ID is required"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (!password) {
    return new Response(JSON.stringify("Password is required"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const result = await turso.execute('SELECT url, password FROM urls WHERE id = ?', [id.toString()]);
  if (result.rows.length === 0) {
    return new Response(JSON.stringify("URL not found"), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const {url, password: storedPassword} = result.rows[0];

  if (!storedPassword) {
    return new Response(JSON.stringify("This URL does not require a password"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const isValid = await verifyPassword(storedPassword.toString(), password.toString())

  if (!isValid) {
    return new Response(JSON.stringify("Invalid password"), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  if (!url) {
    return new Response(JSON.stringify("URL is empty"), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return redirect(url.toString(), 307);

}