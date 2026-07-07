export interface ReadingTime {
  words: number
  minutes: number
}

const WPM = 200

export function readingTime(markdown: string): ReadingTime {
  const text = markdown
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')    // inline/fenced code -> inner text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links/images -> label
    .replace(/[#>*_~`-]/g, ' ')               // markdown punctuation
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / WPM))
  return { words, minutes }
}
