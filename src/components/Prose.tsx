import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import './Prose.css'

export function Prose({ children }: { children: string }) {
  return (
    <div className="prose">
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          rehypeHighlight,
        ]}
      >
        {children}
      </Markdown>
    </div>
  )
}
