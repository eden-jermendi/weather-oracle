
import request from 'superagent'

// Match your backend port
const ROOT_URL = 'http://localhost:3000/v1'

export async function getOracle(city: string) {
  const res = await request
    .get(`${ROOT_URL}/oracle`)
    .query({ city })

  return res.body
}