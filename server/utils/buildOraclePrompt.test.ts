import { describe, it, expect } from 'vitest'
import { buildOraclePrompt } from './buildOraclePrompt'

describe('buildOraclePrompt', () => {
  it('builds a prompt containing key weather data', () => {
    const weather = {
      city: 'Wellington',
      temperature: 18,
      feelsLike: 16,
      humidity: 72,
      windSpeed: 24,
      description: 'Cloudy with strong winds',
    }

    const prompt = buildOraclePrompt(weather)

    expect(typeof prompt).toBe('string')
    expect(prompt).toContain('Wellington')
    expect(prompt).toContain('18')
    expect(prompt).toContain('16')
    expect(prompt).toContain('72')
    expect(prompt).toContain('24')
    expect(prompt).toContain('Cloudy with strong winds')
  })
})
