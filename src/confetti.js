// Little celebration when someone downloads the CV
export function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return toast()
  const c = document.createElement('canvas')
  c.className = 'confetti'
  const d = Math.min(2, window.devicePixelRatio || 1)
  const W = innerWidth, H = innerHeight
  c.width = W * d; c.height = H * d
  document.body.appendChild(c)
  const x = c.getContext('2d'); x.scale(d, d)
  const cols = ['#f7d6e0', '#ffffff', '#e8b04a', '#d4566f', '#9ed8b0', '#b99ad8']
  const ps = Array.from({ length: 160 }, (_, i) => ({
    x: i % 2 ? W * 0.15 : W * 0.85, y: H * 0.85,
    vx: (i % 2 ? 1 : -1) * (3 + Math.random() * 7), vy: -(9 + Math.random() * 11),
    r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3,
    w: 6 + Math.random() * 6, h: 4 + Math.random() * 4, c: cols[i % cols.length],
  }))
  let t = 0
  const step = () => {
    t++; x.clearRect(0, 0, W, H)
    ps.forEach((p) => {
      p.vy += 0.32; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c
      x.globalAlpha = Math.max(0, 1 - t / 170); x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.cos(t * 0.15 + p.r)); x.restore()
    })
    t < 170 ? requestAnimationFrame(step) : c.remove()
  }
  requestAnimationFrame(step)
  toast()
}
function toast() {
  document.querySelector('.toast')?.remove()
  const el = document.createElement('div')
  el.className = 'toast'
  el.innerHTML = '<b>Yay, CV on its way! 🎉</b><span>Thanks for stopping by. I’d love to hear from you.</span>'
  document.body.appendChild(el)
  setTimeout(() => el.classList.add('is-out'), 3600)
  setTimeout(() => el.remove(), 4200)
}
