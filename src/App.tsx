import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Publications from './pages/Publications'
import Software from './pages/Software'
import Posts from './pages/Posts'
import Post from './pages/Post'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/software" element={<Software />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:slug" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
