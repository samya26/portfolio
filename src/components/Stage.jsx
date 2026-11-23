import { useEffect, useRef, useState } from 'react'
import { EDUCATION, ME, PROJECTS, SKILLS } from '../data.js'
import { celebrate } from '../confetti.js'

/* One pinned, scroll-driven scene (like a short film):
   intro → zoom into the face (résumé) → projects drop from the halo one by one
   → she turns to the side as the Works panel slides in → back view, contact. */

const N = PROJECTS.length
const TAU = Math.PI * 2
const P0 = 3.4 // first project stop
const T = P0 + N + 4.2 // total length in "beats"
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const ramp = (u, a, b) => ease(clamp((u - a) / (b - a)))
const win = (u, a, b, c, d) => Math.min(ramp(u, a, b), 1 - ramp(u, c, d))
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const focusOf = (u, i) => ease(clamp((0.7 - Math.abs(u - (P0 + 0.5 + i))) / 0.36))

// eye openings (as % of the square image) and the iris inside each
const EYES = [
  { l: 42.273, t: 48.727, w: 5.636, h: 3.364, il: 25.81, it: 2.7, iw: 58.06, ih: 97.3 },
  { l: 52.273, t: 48.182, w: 5.727, h: 3.636, il: 12.7, it: 5.0, iw: 60.32, ih: 95.0 },
]
const SHOT = { dsert: 'shot-dsert.jpg' }
const RESUME = [
  { when: 'Studying', what: EDUCATION.degree, where: `${EDUCATION.school} · CGPA 8.1` },
  { when: 'Sep 2025', what: 'Winner, Hack for Humanity', where: 'SRM IST · built DisasterGuard' },
  { when: 'Aug 2026', what: 'Commonwealth Bank job simulation', where: 'Forage · UI/UX, product, data' },
  { when: 'Ongoing', what: 'UROP research', where: 'AI grading of handwritten answer scripts' },
  { when: 'Ongoing', what: 'Brand & digital, D-SERT', where: 'Logo, packaging, content, website' },
]
const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]))
const COLUMNS = [
  { n: '01', title: 'Design & Brand', sub: 'Brand · Packaging · UI', items: ['dsert', 'wrapt', 'cba'] },
  { n: '02', title: 'AI & Web', sub: 'Research · Apps', items: ['urop', 'sia', 'disasterguard'] },
]

export default function Stage() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const charRef = useRef(null)
  const irisRefs = useRef([])
  const bubbleRef = useRef(null)
  const objRefs = useRef([])
  const cardRefs = useRef([])
  const introRef = useRef(null)
  const resumeRef = useRef(null)
  const panelRef = useRef(null)
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    let raf = 0, u = 0, target = 0, time = 0, last = performance.now()
    let mx = 0, my = 0, smx = 0, smy = 0, lx = 0, ly = 0, hasMouse = false, still = 0
    const rm = reduced()

    const read = () => {
      const s = sectionRef.current
      const span = s.offsetHeight - window.innerHeight
      target = clamp((window.scrollY - s.offsetTop) / span) * T
    }
    const onMove = (e) => { if (e.pointerType === 'mouse') { hasMouse = true; still = 0 } mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5 }

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      time += dt
      u += (target - u) * (rm ? 1 : 0.12)
      smx += (mx - smx) * 0.05; smy += (my - smy) * 0.05

      const st = stageRef.current
      const W = st.clientWidth, H = st.clientHeight
      const phone = W < 769
      // the character canvas is square; she fills its lower ~70%
      const S = phone ? Math.min(W * 1.75, H * 0.95) : Math.min(H * 0.98, W * 0.6)
      const fx = 0.5, fy = 0.47 // face, as a fraction of the square
      const bx = W / 2, by = H - S + fy * S // face position at rest

      // poses: where the face sits and how big she is
      const rest = { x: bx, y: H * (phone ? 0.38 : 0.36), s: phone ? 0.88 : 0.8 }
      const zoom = phone ? { x: W / 2, y: H * 0.27, s: 1.3 } : { x: W * 0.3, y: H * 0.48, s: 1.7 }
      const works = phone ? { x: W / 2, y: H * 0.17, s: 0.48 } : { x: W * 0.18, y: H * 0.42, s: 0.8 }
      const a = ramp(u, 0.55, 1.6), b = ramp(u, 2.55, 3.3), c = ramp(u, P0 + N + 0.1, P0 + N + 1.0)
      let px = rest.x, py = rest.y, ps = rest.s
      px = lerp(px, zoom.x, a); py = lerp(py, zoom.y, a); ps = lerp(ps, zoom.s, a)
      px = lerp(px, rest.x, b); py = lerp(py, rest.y, b); ps = lerp(ps, rest.s, b)
      px = lerp(px, works.x, c); py = lerp(py, works.y, c); ps = lerp(ps, works.s, c)
      // gentle life: breathing + mouse parallax
      if (!rm) { px += smx * -14; py += Math.sin(time * 1.2) * 2 + smy * -6 }

      const ch = charRef.current
      ch.style.width = ch.style.height = `${S}px`
      const left = bx - fx * S, top = H - S
      ch.style.transformOrigin = `${fx * S}px ${fy * S}px`
      ch.style.transform = `translate3d(${px - bx}px, ${py - (top + fy * S)}px, 0) scale(${ps})`
      ch.style.left = `${left}px`; ch.style.top = `${top}px`

      // eyes: follow the mouse; on phones (or when the mouse rests) they look around on their own
      still += dt
      let tx, ty
      if (hasMouse && still < 4) { tx = mx * 2; ty = my * 2 } else { tx = Math.sin(time * 0.6) * 0.8 + Math.sin(time * 1.7) * 0.2; ty = Math.sin(time * 0.9) * 0.4 }
      if (c > 0.5) { tx = lerp(tx, 1, c * 0.8); ty = lerp(ty, 0, c * 0.5) }
      lx += (clamp(tx, -1, 1) - lx) * (rm ? 1 : 0.14); ly += (clamp(ty, -1, 1) - ly) * (rm ? 1 : 0.14)
      irisRefs.current.forEach((el) => { if (el) el.style.transform = `translate(${lx * 16}%, ${ly * 5}%)` })
      bubbleRef.current.style.opacity = String(ramp(time, 1.2, 1.6) * (1 - ramp(u, 0.15, 0.5)))

      // halo of projects orbiting above her head
      const haloOn = Math.min(1 - ramp(u, 0.5, 1.0), 1) + ramp(u, 2.8, 3.3) * (1 - ramp(u, P0 + N - 0.1, P0 + N + 0.4))
      const headTop = py + (0.31 - fy) * S * ps
      const hcx = px, hcy = headTop - S * ps * 0.07
      const rx = S * ps * (phone ? 0.27 : 0.22), ry = rx * 0.24
      const osz = S * (phone ? 0.1 : 0.075)
      const fsX = phone ? W / 2 : W * 0.3, fsY = phone ? H * 0.3 : H * 0.48
      const fsS = phone ? Math.min(W * 0.56, H * 0.28) : Math.min(H * 0.46, W * 0.27)
      let fmax = 0, fi = -1
      const th0 = (rm ? 0 : time * 0.35) + u * 0.6
      PROJECTS.forEach((p, i) => {
        const el = objRefs.current[i]
        if (!el) return
        const f = focusOf(u, i)
        if (f > fmax) { fmax = f; fi = i }
        const th = th0 + (i * TAU) / N
        const d = Math.sin(th) // 1 front, -1 back
        const ox = hcx + rx * Math.cos(th), oy = hcy + ry * d
        const os = osz * (0.75 + 0.25 * (d + 1) / 2)
        const x = lerp(ox, fsX, f), y = lerp(oy, fsY, f), size = lerp(os, fsS, f)
        el.style.width = el.style.height = `${size}px`
        el.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0) rotate(${(1 - f) * Math.cos(th) * 10}deg)`
        el.style.zIndex = f > 0.05 ? 30 : d > 0 ? 14 : 6
        const o = f > 0.05 ? 1 : haloOn * (fmax > 0.05 ? 1 - fmax : 1)
        el.style.opacity = String(o)
        el.style.filter = d < 0 && f < 0.05 ? `brightness(0.85) blur(${-d}px)` : 'none'
        const card = cardRefs.current[i]
        if (card) {
          const cf = clamp((f - 0.55) / 0.45)
          card.style.opacity = String(cf)
          card.style.transform = `translate3d(0, ${(1 - cf) * 26}px, 0)`
          card.style.visibility = f > 0.01 ? 'visible' : 'hidden'
          card.style.pointerEvents = f > 0.5 ? 'auto' : 'none'
        }
      })
      // hide the moment the angle changes behind a quick soft blur, like a camera refocusing
      const blur = fmax * 3
      ch.style.filter = blur > 0.05 ? `blur(${blur}px)` : 'none'
      ch.style.opacity = String(1 - fmax * 0.72)

      // intro text + résumé
      const intro = 1 - ramp(u, 0.25, 0.9)
      introRef.current.style.opacity = String(intro)
      introRef.current.style.transform = `translate3d(0, ${(1 - intro) * -30}px, 0)`
      const res = win(u, 1.25, 1.75, 2.45, 2.85)
      resumeRef.current.style.opacity = String(res)
      resumeRef.current.style.transform = `translate3d(${phone ? 0 : (1 - res) * 40}px, ${phone ? (1 - res) * 40 : 0}px, 0)`
      resumeRef.current.style.visibility = res > 0.01 ? 'visible' : 'hidden'

      // dark Works panel slides in, then scrolls sideways through its columns
      const pin = ramp(u, P0 + N + 0.2, P0 + N + 1.0)
      const pan = panelRef.current
      pan.style.transform = phone ? `translate3d(0, ${(1 - pin) * 100}%, 0)` : `translate3d(${(1 - pin) * 100}%, 0, 0)`
      pan.style.visibility = pin > 0.001 ? 'visible' : 'hidden'
      const tr = trackRef.current
      const extra = Math.max(0, tr.scrollWidth - pan.clientWidth)
      tr.style.transform = `translate3d(${-extra * ramp(u, P0 + N + 1.2, T - 0.2)}px, 0, 0)`
      st.style.setProperty('--dark', (pin * (phone ? 0.2 : 0.35)).toFixed(3))

      barRef.current.style.transform = `scaleX(${u / T})`
      const nextActive = fmax > 0.5 ? fi : -1
      setActive((pv) => (pv === nextActive ? pv : nextActive))
      raf = requestAnimationFrame(frame)
    }

    read(); u = target
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const goBeat = (beat) => {
    const s = sectionRef.current
    const top = s.offsetTop + (beat / T) * (s.offsetHeight - window.innerHeight)
    window.dispatchEvent(new CustomEvent('pf:scroll', { detail: top }))
  }

  return (
    <section className="stage" ref={sectionRef} style={{ height: `${T * 70 + 100}vh` }} aria-label="Samya Chadha portfolio">
      <div className="stage__view" ref={stageRef}>
        <div className="stage__tex" aria-hidden="true" />
        <div className="stage__dark" aria-hidden="true" />

        <div className="char" ref={charRef} aria-hidden="true">
          <img className="char__img" src="img/front-noeyes.webp" alt="" draggable="false" fetchPriority="high" />
          {EYES.map((e, i) => (
            <div key={i} className="eye" style={{ left: `${e.l}%`, top: `${e.t}%`, width: `${e.w}%`, height: `${e.h}%` }}>
              <img ref={(el) => (irisRefs.current[i] = el)} src={`img/iris${i}.webp`} alt="" draggable="false" style={{ left: `${e.il}%`, top: `${e.it}%`, width: `${e.iw}%`, height: `${e.ih}%` }} />
            </div>
          ))}
          <p className="bubble" ref={bubbleRef}>hi there! <span>👋</span></p>
        </div>

        {PROJECTS.map((p, i) => (
          <button key={p.id} ref={(el) => (objRefs.current[i] = el)} className="obj" onClick={() => goBeat(P0 + 0.5 + i)} aria-label={`Show ${p.title}`} tabIndex={-1}>
            <img src={`img/${p.img}.webp`} alt="" draggable="false" />
          </button>
        ))}

        <div className="intro" ref={introRef}>
          <h1 className="intro__title">About Samya</h1>
          <p className="intro__bio">
            I'm Samya, a designer who codes. I spend my days on interfaces, brands and packaging,
            and the code that makes them real. I love taking one idea all the way, from sketch to shelf.
          </p>
          <div className="intro__scroll" aria-hidden="true"><span>Scroll</span><i /></div>
        </div>

        <aside className="resume" ref={resumeRef} aria-label="Résumé">
          <h2 className="resume__title">Résumé</h2>
          <ol className="resume__list">
            {RESUME.map((r) => (
              <li key={r.what}>
                <p className="resume__when">{r.when}</p>
                <p className="resume__what">{r.what}</p>
                <p className="resume__where">{r.where}</p>
              </li>
            ))}
          </ol>
        </aside>

        {PROJECTS.map((p, i) => (
          <article key={p.id} ref={(el) => (cardRefs.current[i] = el)} className="pcard" style={{ '--tint': p.tint }} aria-hidden={active !== i}>
            <p className="pcard__n">{String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</p>
            <h2 className="pcard__title">{p.title}</h2>
            <p className="pcard__kind">{p.kind}</p>
            <p className="pcard__line">{p.line}</p>
            <ul className="pcard__points">{p.points.map((t) => <li key={t}>{t}</li>)}</ul>
            <p className="pcard__tags">{p.tags.join(' · ')}</p>
            {p.links.length > 0 && (
              <div className="pcard__links">
                {p.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" tabIndex={active === i ? 0 : -1}>{l.label} ↗</a>)}
              </div>
            )}
          </article>
        ))}

        <div className="panel" ref={panelRef}>
          <div className="panel__track" ref={trackRef}>
            <div className="col col--head"><h2 className="panel__title">Works</h2><p className="panel__hint">Keep scrolling →</p></div>
            {COLUMNS.map((c) => (
              <div key={c.n} className="col">
                <p className="col__n">{c.n}</p>
                <h3 className="col__title">{c.title}</h3>
                <p className="col__sub">{c.sub}</p>
                {c.n === '01'
                  ? <a className="col__shot" href={byId.dsert.links[0].href} target="_blank" rel="noopener noreferrer"><i /><img src={`img/${SHOT.dsert}`} alt="D-SERT website" loading="lazy" /></a>
                  : <div className="col__tiles">{c.items.map((id) => <span key={id} style={{ '--tint': byId[id].tint }}><img src={`img/${byId[id].img}.webp`} alt="" loading="lazy" /></span>)}</div>}
                <ul className="col__rows">
                  {c.items.map((id) => {
                    const p = byId[id]
                    const link = p.links[0]
                    return (
                      <li key={id}>
                        {link
                          ? <a href={link.href} target="_blank" rel="noopener noreferrer"><span><img className="col__ico" src={`img/${p.img}.webp`} alt="" />{p.title}</span><em>{link.label} ↗</em></a>
                          : <div><span><img className="col__ico" src={`img/${p.img}.webp`} alt="" />{p.title}</span><em>{p.id === 'urop' ? 'Research' : 'Case study'}</em></div>}
                      </li>
                    )
                  })}
                </ul>
                {c.n === '02' && <p className="col__awards"><span>Awards</span>Winner · Hack for Humanity 2025</p>}
              </div>
            ))}
            <div className="col">
              <p className="col__n">03</p>
              <h3 className="col__title">Skills</h3>
              {SKILLS.map((g) => (
                <div key={g.group} className="col__skills">
                  <p>{g.group}</p>
                  <ul>{g.items.slice(0, 8).map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="col col--contact">
              <p className="col__n">04</p>
              <p className="contact__open"><i />Open to internships · UI/UX · Product</p>
              <p className="contact__hi">Let's make something.</p>
              <a className="contact__mail" href={`mailto:${ME.email}`}>{ME.email}</a>
              <div className="contact__links">
                <a href={ME.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
                <a href={ME.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                <a className="is-solid" href={ME.cv} download="Samya-Chadha-CV.pdf" onClick={celebrate}>Download CV ↓</a>
              </div>
              <p className="contact__fine">© {new Date().getFullYear()} {ME.name} · {ME.location}</p>
            </div>
          </div>
        </div>

        <div className="corner corner--tl" aria-hidden="true"><b>{ME.name}</b><span>Designer &amp; developer</span></div>
        <div className="sparkles" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6].map((i) => <i key={i} />)}</div>
        <div className="corner corner--bl" aria-hidden="true">Design · Code · Play</div>
        <div className="corner corner--r" aria-hidden="true">Based in Chennai</div>
        <div className="progress" aria-hidden="true"><i ref={barRef} /></div>
      </div>
    </section>
  )
}
