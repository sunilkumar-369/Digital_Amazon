// Sample listings so the store never looks empty on day one.
// They are clearly badged "Sample" in the UI and have no download file.
// Hide them with VITE_SHOW_SAMPLES=false once real sellers have listed products.
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const base = { sample: true, sellerId: 'sample', status: 'published', createdAt: null };

export const SAMPLE_PRODUCTS = [
  { ...base, id: 'sample-1', title: 'Pro Video Editing LUTs Pack', category: 'Video Assets', price: 49.99, sellerName: 'Cinematic Studio', imageUrl: u('photo-1574717024653-61fd2cf4d44d'), description: 'A pack of cinematic colour-grading LUTs for Premiere Pro, DaVinci Resolve and Final Cut. Drop them on your footage for an instant film look.' },
  { ...base, id: 'sample-2', title: 'Advanced React Dashboard Template', category: 'Source Code', price: 79, sellerName: 'UI Forge', imageUrl: u('photo-1555066931-4365d14bab8c'), description: 'A production-ready React admin dashboard with charts, tables, auth screens and dark mode. Clean, documented code.' },
  { ...base, id: 'sample-3', title: 'Midjourney Mastery E-Book', category: 'E-Books', price: 19.5, sellerName: 'AI Visions', imageUrl: u('photo-1589998059171-988d887df646'), description: 'A practical guide to prompting, styles and workflows for AI image generation, with copy-ready prompt examples.' },
  { ...base, id: 'sample-4', title: 'Cinematic Sound Effects Library', category: 'Audio', price: 29.99, sellerName: 'Audio Hub', imageUrl: u('photo-1615554851459-4f7db201d4a6'), description: 'Hundreds of royalty-free whooshes, hits, risers and ambiences for trailers, reels and games.' },
  { ...base, id: 'sample-5', title: 'Notion Life Planner OS', category: 'Templates', price: 24, sellerName: 'Productivity Inc', imageUrl: u('photo-1586281380349-632531db7ed4'), description: 'One Notion workspace for goals, habits, finances and weekly planning. Duplicate and start using in minutes.' },
  { ...base, id: 'sample-6', title: 'SaaS Landing Page UI Kit', category: 'Source Code', price: 59, sellerName: 'UI Forge', imageUrl: u('photo-1460925895917-afdab827c52f'), description: 'Responsive landing-page sections — hero, pricing, FAQ, testimonials — in React + Tailwind.' },
  { ...base, id: 'sample-7', title: 'Viral YouTube Thumbnail Pack', category: 'Graphics', price: 15, sellerName: 'Creator DAO', imageUrl: u('photo-1611162617474-5b21e879e113'), description: 'Editable thumbnail templates designed for high click-through, with fonts and layered source files.' },
  { ...base, id: 'sample-8', title: 'Blender 3D Environment Course', category: 'Courses', price: 199, sellerName: '3D Masters', imageUrl: u('photo-1618005182384-a83a8bd57fbe'), description: 'A project-based video course on building full 3D environments in Blender, from blockout to render.' },
];
