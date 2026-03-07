
import request from 'superagent'

// Match your backend port
const ROOT_URL = new URL('/v1', document.baseURI) //to avoid hardcoding locahost

export async function getOracle(city: string) {
  const res = await request
    .get(`${ROOT_URL}/oracle`)
    .query({ city })

  return res.body
}

// export async function getGreeting() {
//   const res = await request.get(`${rootURL}/greeting`)
//   return res.body.greeting as string
// }

export type WeatherData = {
  temperature: number
  windSpeed: number
  cloudiness: number
  precipitation: number
  pictocode: number
  isDaylight: boolean
}

export async function getWeather(lat: number, lon: number) {
  const res = await request.get(`${ROOT_URL}/weather`).query({ lat, lon })
  return res.body as WeatherData
}
