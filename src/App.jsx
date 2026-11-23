import { useEffect } from 'react'
import Lenis from 'lenis'
import { ME } from './data.js'
import Stage from './components/Stage.jsx'

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" /></svg>
)
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z" /></svg>
)

export default function App() {
  // smooth, weighty scrolling on laptops; phones keep their native scroll
  useEffect(() => {
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis = null, raf = 0
    if (!touch && !rm) {
      lenis = new Lenis({ duration: 1.25, smoothWheel: true, wheelMultiplier: 0.85 })
      const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    }
    const go = (e) => (lenis ? lenis.scrollTo(e.detail, { duration: 1.6 }) : window.scrollTo({ top: e.detail, behavior: 'smooth' }))
    window.addEventListener('pf:scroll', go)
    return () => { cancelAnimationFrame(raf); lenis && lenis.destroy(); window.removeEventListener('pf:scroll', go) }
  }, [])

  return (
    <>
      <nav className="top" aria-label="Links">
        <a href={ME.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon /></a>
        <a href={ME.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
        <a href={ME.cv} target="_blank" rel="noopener noreferrer" className="top__cv">CV</a>
      </nav>
      <main><Stage /></main>
    </>
  )
}
