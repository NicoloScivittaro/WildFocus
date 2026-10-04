import { describe, expect, it } from 'vitest'
import { siteConfig } from './siteConfig'

const instagramUrl =
  'https://www.instagram.com/wildfocus.editing?stkn=MXQ4aDhhejZwN2VrMg%3D%3D&utm_source=qr'
const tiktokUrl = 'https://www.tiktok.com/@wildfocus.editing'

describe('siteConfig socials and contacts', () => {
  it('exposes exactly the supplied Instagram and TikTok profiles', () => {
    expect(siteConfig.socials.map((social) => social.platform)).toEqual(['Instagram', 'TikTok'])
    expect(siteConfig.socials[0].url).toBe(instagramUrl)
    expect(siteConfig.socials[1].url).toBe(tiktokUrl)
  })

  it('does not invent extra social profiles', () => {
    expect(siteConfig.socials).toHaveLength(2)
    expect(JSON.stringify(siteConfig.socials)).not.toMatch(/youtube|linkedin/i)
  })

  it('uses the real contact email', () => {
    expect(siteConfig.email).toBe('Wildfocus.editing@gmail.com')
  })

  it('mirrors socials and email in the structured data', () => {
    expect(siteConfig.jsonLd.email).toBe('Wildfocus.editing@gmail.com')
    expect(siteConfig.jsonLd.sameAs).toEqual([instagramUrl, tiktokUrl])
  })
})
