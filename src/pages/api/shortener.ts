import { turso } from "@/libs/db";
import type { APIRoute } from "astro";
import {hashPassword} from '@libs/hasher'
import { isValidPassword } from '@libs/dataValidation';
const { VERCEL_URL } = import.meta.env;
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { url, customHash, authCode } = await request.json();

  const urlId = Math.random().toString(36).substring(2, 8); // Generate a random ID for the URL

  if (!url) {
    return new Response(JSON.stringify("A valid URL is required"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  let useCustomHash = false;

  if (customHash) {
    const hashExists = await turso.execute('SELECT id FROM urls WHERE id = ?', [customHash]);
    if (hashExists.rows.length > 0) {
      return new Response(JSON.stringify("Custom hash already registered. Please choose a different one."), {
        status: 409,
        headers: {
          "Content-Type": "application/json",
        },
      });
  
    }
    useCustomHash = true;
  }

  try{
    const isURLRegisteredResult = await turso.execute('SELECT id FROM urls WHERE url = ?', [url]);
    if (isURLRegisteredResult.rows.length > 0) {
      // URL already exists, return the existing shortened URL
      const existingUrl = isURLRegisteredResult.rows[0];
      return new Response(JSON.stringify({ shortenedUrl: `${VERCEL_URL}/${existingUrl.id}` }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }catch{
    return new Response(JSON.stringify("Error checking URL registration."), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  let hashedPassword = null;
  if(authCode !== null && authCode !== undefined && typeof authCode === 'string' && authCode.trim() !== '' && authCode !== 'null' && authCode !== 'undefined' && authCode !== 'false' && authCode !== '0'&& authCode.length > 8 && isValidPassword(authCode)) {
    hashedPassword = await hashPassword(authCode);
  }

  const result = await turso.execute('INSERT INTO urls (id, url, created_at, password) VALUES (?, ?, ?, ?)', [useCustomHash ? customHash : urlId, url, Date.now(), hashedPassword]);
  if(result.rowsAffected === 0) {
    return new Response(JSON.stringify("Failed to save URL. Please try again later."), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Return the shortened URL
  return new Response(JSON.stringify({ shortenedUrl: `${VERCEL_URL}/${useCustomHash ? customHash : urlId}` }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}