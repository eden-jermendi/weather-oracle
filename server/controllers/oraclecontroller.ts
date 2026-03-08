import { Request, Response } from 'express'
import {
  buildOraclePrompt,
  ORACLE_PERSONALITIES,
  OraclePersonality,
} from '../utils/buildOraclePrompt'

export async function getOracle(req: Request, res: Response) {
  const city = (req.query.city as string)?.trim()
  const personalityQuery = (req.query.personality as string | undefined)?.trim()

  let personality: OraclePersonality | undefined
  if (personalityQuery) {
    if (
      ORACLE_PERSONALITIES.includes(personalityQuery as OraclePersonality) ===
      false
    ) {
      return res.status(400).json({
        error: `personality must be one of: ${ORACLE_PERSONALITIES.join(', ')}`,
      })
    }
    personality = personalityQuery as OraclePersonality
  }

  if (!city) {
    return res.status(400).json({ error: 'city query parameter is required' })
  }

  const apiKey = process.env.METEOBLUE_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'METEOBLUE_API_KEY is not set' })
  }

  try {
    const url = new URL('https://www.meteoblue.com/en/server/search/query3')
    url.searchParams.set('query', city)
    url.searchParams.set('apikey', apiKey)

    const locationResponse = await fetch(url)

    if (!locationResponse.ok) {
      const details = await locationResponse.text()
      return res
        .status(502)
        .json({ error: 'meteoblue location search failed', details })
    }

    const locationData = await locationResponse.json()
    const firstResult = locationData?.results?.[0]
    const lat = Number(firstResult?.lat)
    const lon = Number(firstResult?.lon)

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(404).json({ error: 'city not found' })
    }

    const weatherUrl = new URL(
      'https://my.meteoblue.com/packages/current_basic-1h',
    )
    weatherUrl.searchParams.set('lat', String(lat))
    weatherUrl.searchParams.set('lon', String(lon))
    weatherUrl.searchParams.set('apikey', apiKey)

    const weatherResponse = await fetch(weatherUrl)
    if (!weatherResponse.ok) {
      const details = await weatherResponse.text()
      return res
        .status(502)
        .json({ error: 'meteoblue weather request failed', details })
    }

    const weatherData = await weatherResponse.json()
    const current = weatherData?.data_current
    const hourlyHumidity = weatherData?.data_1h?.relativehumidity?.[0]
    const hourlyFeelsLike = weatherData?.data_1h?.felttemperature?.[0]
    const promptInput = {
      city,
      temperature: current?.temperature ?? 0,
      feelsLike: hourlyFeelsLike ?? current?.temperature ?? 0,
      humidity: hourlyHumidity ?? current?.relativehumidity ?? 0,
      windSpeed: current?.windspeed ?? 0,
      description: `Pictocode ${current?.pictocode ?? 'unknown'}`,
    }
    const oraclePrompt = buildOraclePrompt(promptInput, personality)
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set' })
    }

    const geminiUrl = new URL(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    )
    geminiUrl.searchParams.set('key', geminiApiKey)

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: oraclePrompt }] }],
      }),
    })

    let oracle =
      'The oracle hears static in the skies. Weather signs are present, but the prophecy is faint.'

    if (!geminiResponse.ok) {
      const details = await geminiResponse.text()
      console.warn('Gemini request failed, using fallback oracle', {
        status: geminiResponse.status,
        details,
      })
    } else {
      const geminiData = await geminiResponse.json()
      const generatedOracle = geminiData?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part?.text ?? '')
        .join('\n')
        .trim()

      if (generatedOracle) {
        oracle = generatedOracle
      }
    }

    return res.json({
      city,
      lat,
      lon,
      oracle,
      oraclePrompt,
      weather: {
        temperature: current?.temperature ?? null,
        feelsLike: hourlyFeelsLike ?? current?.temperature ?? null,
        humidity: hourlyHumidity ?? current?.relativehumidity ?? null,
        windSpeed: current?.windspeed ?? null,
        cloudiness: current?.cloudcover ?? null,
        precipitation: current?.precipitation ?? null,
        pictocode: current?.pictocode ?? null,
        isDaylight: current?.isdaylight === 1,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to resolve city coordinates' })
  }
}
