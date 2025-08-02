const { PUBLIC_VERCEL_ENV, PUBLIC_VERCEL_PROJECT_PRODUCTION_URL } = import.meta
	.env;

export const BASE_URL =
	PUBLIC_VERCEL_ENV === 'local'
		? 'http://localhost:4321'
		: `https://${PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;