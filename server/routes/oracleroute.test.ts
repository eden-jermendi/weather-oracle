import request from 'supertest'
import { describe, it, expect, vi, afterEach } from 'vitest'
import server from '../server'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GET /v1/oracle', () => {
  it('returns resolved coordinates for a valid city', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ lat: -41.2865, lon: 174.7762 }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data_1h: {
            felttemperature: [17.4],
            relativehumidity: [68],
          },
          data_current: {
            temperature: 18.2,
            windspeed: 12.4,
            cloudcover: 60,
            precipitation: 0.3,
            pictocode: 3,
            isdaylight: 1,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'The winds favor your journey today.' }],
              },
            },
          ],
        }),
      })

    vi.stubGlobal(
      'fetch',
      fetchMock,
    )

    const response = await request(server).get('/v1/oracle?city=Wellington')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      city: 'Wellington',
      lat: -41.2865,
      lon: 174.7762,
      oracle: 'The winds favor your journey today.',
      oraclePrompt: expect.any(String),
      weather: {
        temperature: 18.2,
        feelsLike: 17.4,
        humidity: 68,
        windSpeed: 12.4,
        cloudiness: 60,
        precipitation: 0.3,
        pictocode: 3,
        isDaylight: true,
      },
    })
  })

  it('returns 400 when city query parameter is missing', async () => {
    const response = await request(server).get('/v1/oracle')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'city query parameter is required',
    })
  })

  it('returns 502 when gemini response is empty', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ lat: -41.2865, lon: 174.7762 }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data_1h: {
            felttemperature: [17.4],
            relativehumidity: [68],
          },
          data_current: {
            temperature: 18.2,
            windspeed: 12.4,
            cloudcover: 60,
            precipitation: 0.3,
            pictocode: 3,
            isdaylight: 1,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '   ' }] } }],
        }),
      })

    vi.stubGlobal('fetch', fetchMock)

    const response = await request(server).get('/v1/oracle?city=Wellington')

    expect(response.status).toBe(502)
    expect(response.body).toEqual({
      error: 'gemini returned empty response',
    })
  })
})
