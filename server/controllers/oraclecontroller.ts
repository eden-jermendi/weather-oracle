import { Request, Response } from 'express'
import request from 'superagent'

const API_KEY = process.env.OPENWEATHER_API_KEY

export async function getOracle(req: Request, res: Response) {
  const city = req.query.city as string

  if (!city) {
    return res.status(400).json({ error: 'city query parameter is required' })
  }

  try {
    const weatherResponse = await request
      .get('https://api.openweathermap.org/data/2.5/weather')
      .query({
        q: city,
        appid: API_KEY,
        units: 'metric'
      })

    const weatherMain = weatherResponse.body.weather?.[0]?.main || 'Unknown'
    const weatherDesc = weatherResponse.body.weather?.[0]?.description || 'Unknown'
    const temp = weatherResponse.body.main?.temp ?? null

    const oracleMessage = generateOracle(weatherMain)

    res.json({
      city,
      temp,
      weather: weatherDesc,
      oracle: oracleMessage
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'The oracle could not read the skies.' })
  }
}

function generateOracle(weather: string) {
  switch (weather) {
    case 'Rain':
      return 'Dark clouds gather. Prepare for reflection and quiet moments.'
    case 'Clear':
      return 'The sun shines brightly. Fortune walks beside you today.'
    case 'Clouds':
      return 'The sky hides its secrets. Stay patient.'
    case 'Snow':
      return 'The world sleeps beneath white silence.'
    case 'Thunderstorm':
      return 'Powerful forces move today. Act with courage.'
    default:
      return 'The winds whisper mysteries beyond sight.'
  }
}