import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const lat = Number(req.query.lat)
    const lon = Number(req.query.lon)

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({ error: 'Invalid lat or lon' })
    }

    const apiKey = process.env.METEOBLUE_API_KEY

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: 'METEOBLUE_API_KEY is not set on the server' })
    }

    const url = new URL('https://my.meteoblue.com/packages/current')
    url.searchParams.set('lat', String(lat))
    url.searchParams.set('lon', String(lon))
    url.searchParams.set('apikey', apiKey)

    const weatherResponse = await fetch(url)

    if (!weatherResponse.ok) {
      const text = await weatherResponse.text()
      return res
        .status(502)
        .json({ error: 'meteoblue request failed', details: text })
    }

    const data = await weatherResponse.json()

    //current data use
    const current = data?.data_current

    const weatherResult = {
      temperature: current?.temperature ?? 0,
      windSpeed: current?.windspeed ?? 0,
      cloudiness: current?.cloudcover ?? 0,
      precipitation: current?.precipitation ?? 0,
      pictocode: current?.pictocode ?? 0,
      isDaylight: current?.isdaylight === 1,
      //isDaylight = 1 means it's daylight, 0 means it's not day. 0/1 conversion makes it to a boolean - easier use on the frontend.
    }

    return res.json(weatherResult)
  } catch (err) {
    console.error('Error fetching weather:', err)

    if (err instanceof Error) {
      return res.status(500).json({
        error: 'Failed to fetch weather',
        details: err.message,
      })
    }

    return res.status(500).json({ error: 'Failed to fetch weather' })
  }
})

export default router
