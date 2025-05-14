import type { Element } from 'hast';

export const trackNode = (query: Record<string, string> = {}): { query: Record<string, string>, element: Element[] } => {
  const resultTrack: Record<string, Record<string, string>> = {}
  const resultElement: Element[] = []
  const resultQuery: Record<string, string> = {}
  const result = { query: resultQuery, element: resultElement }
  Object.keys(query).forEach((key) => {
    let keyMatch = key.trim().match(/track\[['"](\w+:?\w+)['"]\]/i)
    let queryKey = keyMatch ? keyMatch[1] : null
    if (queryKey) {
      let [lang, keyString] = queryKey.split(':')
      if (!resultTrack[lang]) resultTrack[lang] = {}
      const value = query[key]
      resultTrack[lang][keyString ?? "src"] = value
    } else {
      resultQuery[key] = query[key]
    }
  });

  Object.keys(resultTrack).forEach((lang) => {
    const track = resultTrack[lang]
    resultElement.push({
      type: 'element',
      tagName: 'track',
      properties: {
        kind: track.kind || 'subtitles',
        ...track
      },
      children: []
    })
  })
  result.query = resultQuery
  result.element = resultElement
  return { ...result }
}