import request from 'superagent'

const ROOT_URL = new URL('/v1', document.baseURI) // to avoid hardcoding localhost

export async function getOracle(city: string) {
  const res = await request.get(`${ROOT_URL}/oracle`).query({ city })

  return res.body
}
