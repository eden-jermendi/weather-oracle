import request from 'supertest'
import { describe, it, expect } from 'vitest'
import server from '../server'

describe('GET /v1/oracle', () => {
  it('returns oracle response for any valid city', async () => {
    const response = await request(server).get('/v1/oracle?city=Wellington')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      city: 'Wellington',
      oracle: expect.any(String),
    })
  })

  it('returns 400 when city query parameter is missing', async () => {
    const response = await request(server).get('/v1/oracle')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'city query parameter is required',
    })
  })
})
