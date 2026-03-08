import { describe, it, expect } from 'vitest'
import { buildOraclePrompt } from './buildOraclePrompt'

const weather = {
  city: 'Wellington',
  temperature: 18,
  feelsLike: 16,
  humidity: 72,
  windSpeed: 24,
  description: 'Cloudy with strong winds',
}

describe('buildOraclePrompt', () => {
  it('builds a prompt containing key weather data', () => {
    const prompt = buildOraclePrompt(weather)

    expect(typeof prompt).toBe('string')
    expect(prompt).toContain('Wellington')
    expect(prompt).toContain('18')
    expect(prompt).toContain('16')
    expect(prompt).toContain('72')
    expect(prompt).toContain('24')
    expect(prompt).toContain('Cloudy with strong winds')
  })

  it('uses default style direction when no personality is provided', () => {
    const prompt = buildOraclePrompt(weather)

    expect(prompt).toContain('Style direction:')
    expect(prompt).not.toContain('Oracle personality:')
  })

  it('injects selected personality rules when personality is provided', () => {
    const prompt = buildOraclePrompt(weather, 'tea-leaf-trickster')

    expect(prompt).toContain('Oracle personality:')
    expect(prompt).toContain('Tea-Leaf Trickster')
    expect(prompt).toContain('include one clever remark or witty observation')
    expect(prompt).toContain('never mock the user')
  })
})
