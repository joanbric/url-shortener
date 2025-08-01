export const GET = async () => {
  const {TURSO_URL} = import.meta.env
  return new Response(JSON.stringify('Hola! Como estas? El la variable importada con destructuring es: ' + TURSO_URL), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}