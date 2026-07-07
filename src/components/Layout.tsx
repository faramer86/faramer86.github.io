import type { ReactNode } from 'react'
import { Nav } from './Nav'
import { Footer } from './Footer'
import './Layout.css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
