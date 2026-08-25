import { describe, expect, it } from 'vitest'
import { generatedAudioCacheId } from './audioEngine'

describe('generated audio cache id', () => {
  it('is stable for the same voice, speed and text', () => {
    const key = 'british\0' + '1.000\0' + 'Please switch to the BMS dashboard.'
    expect(generatedAudioCacheId(key)).toBe(generatedAudioCacheId(key))
    expect(generatedAudioCacheId(key)).toMatch(/^[a-f0-9]{16}$/)
  })

  it('keeps different pronunciation requests separate', () => {
    expect(generatedAudioCacheId('british\0word')).not.toBe(
      generatedAudioCacheId('american\0word'),
    )
  })
})
