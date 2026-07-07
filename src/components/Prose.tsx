import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import type { PluggableList } from 'unified'
import './Prose.css'

const remarkPlugins: PluggableList = [remarkGfm, remarkMath]
const rehypePlugins: PluggableList = [
  rehypeKatex,
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
  rehypeHighlight,
]

export function Prose({ children }: { children: string }) {
  return (
    <div className="prose">
      <Markdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
      >
        {children}
      </Markdown>
    </div>
  )
}
