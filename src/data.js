// Everything on the site comes from here. Keep it short.
export const ME = {
  name: 'Samya Chadha',
  role: 'Designer & developer',
  focus: ['UI/UX', 'Product', 'Brand', 'Code'],
  email: 'samyachadha26@gmail.com',
  linkedin: 'https://www.linkedin.com/in/samyachadha26',
  github: 'https://github.com/samya26',
  cv: 'Samya-Chadha-CV.pdf',
  location: 'Chennai, India',
}

// The objects that orbit my head, in order. Each one is a project.
export const PROJECTS = [
  {
    id: 'dsert',
    img: 'dsert',
    title: 'D-SERT',
    kind: 'Brand · Packaging · Web',
    line: 'Brand identity and a live pre-order website for a Gurugram dessert brand.',
    points: [
      'Logo, menu, packaging and Instagram content',
      'Designed and built the website, with WhatsApp pre-orders',
    ],
    tags: ['Branding', 'UI/UX', 'React'],
    links: [
      { label: 'Live site', href: 'https://dsert-website.vercel.app' },
      { label: 'Instagram', href: 'https://www.instagram.com/_d_sert_/' },
    ],
    tint: '#c8955a',
  },
  {
    id: 'wrapt',
    img: 'wrapt',
    title: 'Wrapt',
    kind: 'AI brand & packaging studio',
    line: 'Takes a small brand from idea to logo to a 3D packaging mockup, in the browser.',
    points: [
      'AI writes the design plan, a custom engine renders logos and 3D cans, boxes, jars and pouches',
      'Sketch-to-logo studio, design checker, image and 360° video export',
    ],
    tags: ['Three.js', 'JavaScript', 'Gemini API'],
    links: [{ label: 'Live site', href: 'https://wrapt-phi.vercel.app' }],
    tint: '#b99ad8',
  },
  {
    id: 'urop',
    img: 'urop',
    title: 'AI grading of handwritten answer scripts',
    kind: 'Research · UROP, SRM IST · Ongoing',
    line: 'Reads handwritten exam scripts and grades them against rubrics.',
    points: [
      'Pilot: within about 1 mark of faculty grading',
      'Fine-tuning TrOCR on student handwriting · paper in preparation',
    ],
    tags: ['Python', 'OpenCV', 'TrOCR', 'Gemini Vision'],
    links: [],
    tint: '#69c26b',
  },
  {
    id: 'sia',
    img: 'sia',
    title: 'Sia',
    kind: 'AI personalised learning',
    line: 'A Learn → Apply → Teach flow that adapts to what each learner loves.',
    points: [
      'Story-based lessons, escape-room puzzles and an AI teach-back stage',
    ],
    tags: ['React', 'Vite', 'Gemini API'],
    links: [{ label: 'Live demo', href: 'https://sia-learn.onrender.com' }],
    tint: '#e0b84f',
  },
  {
    id: 'disasterguard',
    img: 'globe',
    title: 'DisasterGuard',
    kind: 'Winner · Hack for Humanity 2025',
    line: 'An emergency-response web app with live disaster maps.',
    points: [
      'Built at Hack for Humanity, SRM IST, and won (Sep 2025)',
    ],
    tags: ['React', 'TypeScript', 'Leaflet'],
    links: [{ label: 'Live demo', href: 'https://hack-humanity.vercel.app' }],
    tint: '#5aa7e6',
  },
  {
    id: 'cba',
    img: 'bank',
    title: 'Commonwealth Bank',
    kind: 'Technology job simulation · Forage · Aug 2026',
    line: 'Design, product and data tasks from a real bank brief.',
    points: [
      'Designed iOS banking widgets in several sizes',
      'Wrote user stories and BDD criteria; access and data tasks',
    ],
    tags: ['UI/UX', 'Product', 'Data'],
    links: [],
    tint: '#f2c230',
  },
]

export const SKILLS = [
  { group: 'Design & product', items: ['UI/UX', 'Interaction design', 'Prototyping', 'User flows', 'Visual design', 'Branding', 'Packaging', 'Requirements', 'BDD'] },
  { group: 'Code', items: ['Python', 'JavaScript', 'TypeScript', 'C++', 'HTML/CSS', 'React', 'Vite', 'Three.js', 'Streamlit', 'Tailwind CSS'] },
  { group: 'AI & ML', items: ['Gemini API', 'OpenCV', 'TrOCR', 'CRAFT', 'Sentence-BERT', 'BERT cross-encoders', 'LLMs'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Cursor', 'Excel', 'Unreal Engine (learning)'] },
]

export const EDUCATION = { school: 'SRM Institute of Science and Technology', degree: 'B.Tech, Computer Science and Engineering', detail: 'CGPA 8.1 / 10 · Chennai' }

export const AWARDS = [{ title: 'Winner, Hack for Humanity 2025', by: 'SRM IST · School of Computing · Sep 2025', note: 'Built DisasterGuard' }]
