import request from 'superagent'

const rootURL = new URL(`/v1`, document.baseURI)

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
  const res = await request.get(`${rootURL}/weather`).query({ lat, lon })
  return res.body as WeatherData
}
