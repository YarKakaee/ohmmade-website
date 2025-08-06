# ⚡ OhmMade

> Turning One-Time Projects Into Lifelong Impact

OhmMade is where circuits meet creativity. Discover, share, and build amazing hardware projects — from Arduino hacks to Raspberry Pi wizardry. Our platform empowers makers to publish, showcase, and inspire the next generation of electronics enthusiasts.

🌐 [Visit the Live Site »](https://ohmmade.ca)  
🆘 [Support Center »](https://support.ohmmade.ca)

---

## 🚀 Features

### 🧠 Core Platform

- **Learn by Doing** – Step-by-step guides for electronics and microcontroller projects
- **Project Publishing** – Submit your own builds with tutorials, code, images & more
- **Explore Projects** – Search by device, category, difficulty, or time-to-build
- **Community Interaction** – Like, comment, and engage with fellow builders
- **User Dashboard** – View your activity, liked projects, saved tutorials, and more
- **Authentication** – Supabase Auth with custom modal-based UI (Google + Email)
- **Beautiful, Responsive UI** – Built for creators on every screen

### 🎯 Gamification & Engagement

- **Watts System** – Earn points for publishing, likes, and community engagement
- **Leveling Up** – Progress from Newbie to Grandmaster with achievements
- **Badges & Rewards** – Unlock special badges for milestones and contributions
- **Activity Tracking** – Monitor your impact and engagement across the platform

### 🆘 Support & Documentation

- **Help Center** – Comprehensive FAQ and troubleshooting guides
- **Publishing Guidelines** – Best practices for creating engaging tutorials
- **Profile Guidelines** – Tips for optimizing your maker profile
- **Community Support** – Discussion forums for questions and collaboration

---

## 🏗️ Platform Architecture

OhmMade is built as a **monorepo** with specialized applications:

### 🌐 Main Web App (`ohmmade.ca`)

- **Purpose**: Primary user-facing platform
- **Features**: Project discovery, publishing, user profiles, community features
- **Tech**: Next.js 15, React 19, Supabase, Prisma, TailwindCSS

### 🆘 Support App (`support.ohmmade.ca`)

- **Purpose**: Help center and documentation
- **Features**: FAQ, guides, community discussions, troubleshooting
- **Tech**: Next.js 15, React 19, Supabase, TailwindCSS

---

## 🛠️ Tech Stack

OhmMade is built with modern web technologies and best-in-class tools to deliver an exceptional user experience.

### ⚛️ Frontend

| Technology               | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| **Next.js (App Router)** | App structure, routing, RSC support            |
| **React**                | Core frontend library                          |
| **Axios**                | API requests to backend                        |
| **Framer Motion**        | Animations and scroll-based storytelling       |
| **Editor.js** (Codex)    | Rich block-based content editor                |
| **Radix UI**             | Accessible UI primitives (modals, popovers)    |
| **React Hot Toast**      | Toast notifications                            |
| **React Hook Form**      | Form state management                          |
| **FontAwesome + Lucide** | Icon libraries for clean, scalable UI elements |

---

### 🔐 Backend & Authentication

| Technology                | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| **Supabase**              | Backend-as-a-service (Auth, DB, Storage)                      |
| **Supabase Auth**         | Google + Email login support                                  |
| **Supabase Storage**      | Image uploads for thumbnails and assets                       |
| **Prisma ORM**            | Schema + typed database access                                |
| **App Router API Routes** | Secure REST endpoints (server + RSC ready)                    |
| **Middleware**            | Handles route protection, redirects, and custom request logic |

---

### 🎨 Styling & Design

| Technology             | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| **TailwindCSS**        | Utility-first responsive design                   |
| **Shadcn/ui**          | Component library built on Tailwind + Radix       |
| **Highlight.js**       | Syntax highlighting for embedded code blocks      |
| **Responsive Layouts** | Optimized for desktop, tablet, and mobile screens |

---

### 🔧 Tooling & Developer Experience

| Technology         | Purpose                                      |
| ------------------ | -------------------------------------------- |
| **Turborepo**      | Monorepo build system and task orchestration |
| **Vercel**         | Hosting with edge functions & instant deploy |
| **GitHub**         | Version control and team collaboration       |
| **GitHub Actions** | (Optional) CI/CD workflows                   |

---

### 🔐 Auth Providers

- ✅ Email + Password
- ✅ Google OAuth
- 🟡 GitHub, Discord, Apple (coming soon)

---

## 🧠 Advanced Features

### 📸 Content & Media

- **Image uploads & thumbnails** with preview support via Supabase
- **Rich content publishing** with Codex Editor and custom blocks
- **Component tracking** for project materials and requirements
- **Difficulty levels** and build time estimates

### 🔐 Security & Performance

- **Middleware-based route protection & auth checks**
- **Real-time toast notifications** for publishing, errors, and more
- **SEO optimization** with dynamic metadata, structured data, and sitemaps
- **Performance optimizations** with preconnect, DNS prefetch, and image optimization

### 📈 User Experience

- **Scalable user model**: likes, saves, public profiles, progress tracking
- **Gamification system**: Watts, levels, badges, and achievements
- **Community features**: Follows, activity feeds, and engagement metrics
- **Responsive design**: Optimized for all devices and screen sizes

---

## 🎯 SEO & Discoverability

### 🌐 Search Engine Optimization

- **Dynamic Metadata**: Page-specific titles, descriptions, and keywords
- **Structured Data**: Rich snippets for projects, users, and organization
- **Sitemaps**: Auto-generated XML sitemaps for efficient crawling
- **Robots.txt**: Proper search engine guidance and crawling rules
- **Open Graph**: Rich social media sharing with custom images
- **Twitter Cards**: Optimized Twitter sharing experience

### 📊 Analytics & Monitoring

- **Performance tracking** with Core Web Vitals
- **Search console integration** for SEO monitoring
- **User engagement metrics** and conversion tracking
- **Content performance** analysis and optimization

---

## 🚀 Deployment & Infrastructure

### 🌍 Production Environment

- **Main App**: `https://ohmmade.ca`
- **Support App**: `https://support.ohmmade.ca`
- **CDN**: Global content delivery for optimal performance
- **SSL**: Full HTTPS encryption across all domains

### 🔧 Development Workflow

- **Monorepo structure** with shared packages
- **Hot reloading** for rapid development
- **Type safety** with TypeScript and Prisma
- **Code quality** with ESLint and Prettier
- **Version control** with Git and GitHub

---

## 💡 Contributing

We love open source and would love your help improving OhmMade.

1. Fork the repository
2. Create a new branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push your branch: `git push origin feat/your-feature`
5. Open a Pull Request

> We review PRs regularly and are happy to support new contributors!

---

## 🙌 Team OhmMade

> Built by students. Powered by passion.

| Name              | Role                                   |
| ----------------- | -------------------------------------- |
| **Yar Kakaee**    | Founder & Head of Engineering          |
| **Tristan Biley** | Co-Founder, Head of Finance & Strategy |
| **Serkan Nur**    | Co-Founder, Head of Hardware & Systems |
| **Andres Holmes** | Head of Marketing & Outreach           |

---

## 🔗 Links

- 🌐 [Website](https://ohmmade.ca)
- 🆘 [Support Center](https://support.ohmmade.ca)
- 🧪 [GitHub](https://github.com/OhmMadeTech)
- 📷 [Instagram](https://www.instagram.com/ohmmade.ca/)
- 🎥 [YouTube](https://www.youtube.com/@OhmMadeOfficial)
- 🧵 [Twitter/X](https://x.com/OhmMadeTech)
- 💼 [LinkedIn](https://www.linkedin.com/company/ohmmade/)
- 🎶 [TikTok](https://www.tiktok.com/@ohmmadetech)

---

## 📜 License

MIT License — free to use, modify, and share. Just don't remove the credits. 🙏

---

> "Built by makers, for makers." ⚡
