import { turso } from '@/libs/db'
import type { APIRoute } from 'astro'
import { hashPassword } from '@libs/hasher'
import { isValidPassword } from '@libs/dataValidation'
import { BASE_URL } from '@libs/getBaseURL'
export const prerender = false

function customHashParser(hash: string) {
  return hash
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

export const POST: APIRoute = async ({ request }) => {
  const { url, customHash, authCode } = await request.json()

  const urlId = Math.random().toString(36).substring(2, 8) // Generate a random ID for the URL

  if (!url) {
    return new Response(JSON.stringify('A valid URL is required'), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  let useCustomHash = false
  let customHashParsed = null

  if (customHash) {
    customHashParsed = customHashParser(customHash)
    const hashExists = await turso.execute('SELECT id FROM urls WHERE id = ?', [customHashParsed])
    if (hashExists.rows.length > 0) {
      return new Response(JSON.stringify('Custom hash already registered. Please choose a different one.'), {
        status: 409,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
    useCustomHash = true
  }

  try {
    const isURLRegisteredResult = await turso.execute('SELECT id FROM urls WHERE url = ?', [url])
    if (isURLRegisteredResult.rows.length > 0) {
      // URL already exists, return the existing shortened URL
      const existingUrl = isURLRegisteredResult.rows[0]
      return new Response(JSON.stringify({ shortenedUrl: `${BASE_URL}/${existingUrl.id}` }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  } catch {
    return new Response(JSON.stringify('Error checking URL registration.'), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  let hashedPassword = null
  if (
    authCode !== null &&
    authCode !== undefined &&
    typeof authCode === 'string' &&
    authCode.trim() !== '' &&
    authCode !== 'null' &&
    authCode !== 'undefined' &&
    authCode !== 'false' &&
    authCode !== '0' &&
    authCode.length > 8 &&
    isValidPassword(authCode)
  ) {
    hashedPassword = await hashPassword(authCode)
  }

  const result = await turso.execute('INSERT INTO urls (id, url, created_at, password) VALUES (?, ?, ?, ?)', [
    useCustomHash ? customHashParsed : urlId,
    url,
    Date.now(),
    hashedPassword
  ])
  if (result.rowsAffected === 0) {
    return new Response(JSON.stringify('Failed to save URL. Please try again later.'), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  // Return the shortened URL
  return new Response(JSON.stringify({ shortenedUrl: `${BASE_URL}/${useCustomHash ? customHashParsed : urlId}` }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
