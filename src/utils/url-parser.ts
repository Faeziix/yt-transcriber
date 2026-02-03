const VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/

export function extractVideoId(input: string): string | null {
  const trimmed = input.trim()

  if (VIDEO_ID_REGEX.test(trimmed)) {
    return trimmed
  }

  try {
    const url = new URL(trimmed)
    const hostname = url.hostname.replace('www.', '').replace('m.', '').replace('music.', '')

    if (hostname === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0]
      return VIDEO_ID_REGEX.test(id) ? id : null
    }

    if (hostname === 'youtube.com') {
      const vParam = url.searchParams.get('v')
      if (vParam && VIDEO_ID_REGEX.test(vParam)) {
        return vParam
      }

      const pathSegments = url.pathname.split('/').filter(Boolean)
      const pathPatterns = ['watch', 'embed', 'v', 'shorts', 'live', 'clip']

      for (let i = 0; i < pathSegments.length; i++) {
        if (pathPatterns.includes(pathSegments[i]) && pathSegments[i + 1]) {
          const id = pathSegments[i + 1]
          if (VIDEO_ID_REGEX.test(id)) {
            return id
          }
        }
      }
    }
  } catch {
    return null
  }

  return null
}

export function isValidVideoId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id)
}
