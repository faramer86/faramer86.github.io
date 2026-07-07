export interface Frontmatter {
  data: Record<string, unknown>
  content: string
}

function parseScalar(raw: string): unknown {
  const v = raw.trim()
  if (v === 'true') return true
  if (v === 'false') return false
  if (v !== '' && !Number.isNaN(Number(v))) return Number(v)
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1)
  }
  return v
}

function parseValue(raw: string): unknown {
  const v = raw.trim()
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim()
    if (inner === '') return []
    return inner.split(',').map((item) => parseScalar(item))
  }
  return parseScalar(v)
}

export function parseFrontmatter(raw: string): Frontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) return { data: {}, content: raw }

  const [, block, content] = match
  const data: Record<string, unknown> = {}
  for (const line of block.split(/\r?\n/)) {
    if (line.trim() === '') continue
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    data[key] = parseValue(line.slice(idx + 1))
  }
  return { data, content }
}
