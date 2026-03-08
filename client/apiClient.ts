import request from 'superagent'

const ROOT_URL = new URL('/v1', document.baseURI) // to avoid hardcoding localhost

export type OraclePersonality =
  | 'daughter-of-the-silver-moon'
  | 'tea-leaf-trickster'
  | 'the-veiled-priestess'

export async function getOracle(
  city: string,
  personality?: OraclePersonality,
) {
  const query = personality ? { city, personality } : { city }
  const res = await request.get(`${ROOT_URL}/oracle`).query(query)

  return res.body
}
