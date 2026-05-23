# 🌳 Tree-Map — Visual Family Tree & Relationship Roadmap

Tree-Map is a **premium full-stack genealogy platform** that lets you visually build, explore, and share your family tree. Connect people, discover relationships, and find exactly how any two people are related using an intelligent graph traversal engine — all on a beautiful, animated drag-and-drop canvas.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Visual Tree Editor** | Infinite drag-and-drop canvas powered by React Flow |
| 🔗 **Relationship Mapping** | 15+ relationship types with animated edge connections |
| 🔍 **Path Finder** | BFS algorithm finds shortest relationship path between any two people |
| 📤 **Export** | PNG, PDF, or JSON backup |
| 👤 **Member Profiles** | Photos, birthdate, notes, phone, email per person |
| 🔐 **JWT Auth** | Secure register/login with bcrypt password hashing |
| 📱 **Fully Responsive** | Desktop, tablet, and mobile optimized |
| 🌐 **REST API** | Complete backend with rate limiting, CORS, and Helmet |

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS v4
- @xyflow/react (React Flow)
- Framer Motion
- Zustand (state management)
- React Router v6
- Axios
- react-hot-toast
- html2canvas + jsPDF

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- bcryptjs + JSON Web Tokens
- Helmet, express-rate-limit, CORS

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://cloud.mongodb.com))

---

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT_SECRET
npm install
npm start
```

Server runs on **http://localhost:5000**

**Seed sample data:**
```bash
node seed.js
# Demo credentials: demo@tree-map.app / demo123456
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs on **http://localhost:5173**

---

## 📁 Project Structure

```
tree-map/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── treeController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── FamilyTree.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── trees.js
│   │   ├── members.js
│   │   └── relationships.js
│   ├── .env.example
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── BackgroundBlobs.jsx
│       │   ├── Footer.jsx
│       │   ├── PathFinder.jsx
│       │   ├── PersonModal.jsx
│       │   ├── PersonNode.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── RelationshipModal.jsx
│       │   └── Sidebar.jsx
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── TreeEditor.jsx
│       │   ├── Trees.jsx
│       │   └── Settings.jsx
│       ├── services/
│       │   └── api.js
│       ├── store/
│       │   ├── authStore.js
│       │   └── treeStore.js
│       └── utils/
│           ├── exportUtils.js
│           └── relationshipEngine.js
│
└── footer/             ← Standalone footer (HTML + CSS)
    ├── index.html
    └── footer.css
```

---

## 🔌 API Reference

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in, receive JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Trees
| Method | Route | Description |
|---|---|---|
| GET | `/api/trees` | List all trees (protected) |
| POST | `/api/trees` | Create tree (protected) |
| GET | `/api/trees/:id` | Get single tree (protected) |
| PUT | `/api/trees/:id` | Update tree (protected) |
| DELETE | `/api/trees/:id` | Delete tree (protected) |

### Members
| Method | Route | Description |
|---|---|---|
| POST | `/api/members` | Add member to tree |
| PUT | `/api/members/:id` | Update member |
| DELETE | `/api/members/:id` | Remove member |

### Relationships
| Method | Route | Description |
|---|---|---|
| POST | `/api/relationships` | Add relationship |
| DELETE | `/api/relationships/:id` | Remove relationship |

---

## 🧠 Relationship Algorithm

The **Path Finder** uses BFS (Breadth-First Search) on a bidirectional graph:

```
findRelationshipPath(members, relationships, sourceId, targetId)
  → { path: [{from, to, type}], label: "Paternal Uncle" }
```

Compound labels are inferred from path patterns:
- `father → father` → **Paternal Grandfather**
- `father → brother` → **Paternal Uncle**
- `mother → brother → son` → **First Cousin**
- etc.

---

## 🚢 Deployment

### Frontend → Netlify / Vercel

```bash
cd frontend
npm run build
# Deploy /dist folder
```

Set environment variable:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render / Railway

1. Connect your GitHub repo
2. Set environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   FRONTEND_URL=https://your-app.netlify.app
   ```
3. Build command: `npm install`
4. Start command: `node server.js`

---

## 🗃 Database Models

### User
```js
{ name, email, password (hashed), avatar, timestamps }
```

### FamilyTree
```js
{
  title, description, owner (ref: User),
  members: [{ id, name, gender, birthDate, deathDate, photo, notes, phone, email, position }],
  relationships: [{ id, source, target, relationType }],
  timestamps
}
```

---

## 🔐 Security

- **bcrypt** — password hashing (12 rounds)
- **JWT** — stateless authentication (7-day expiry)
- **Helmet** — secure HTTP headers
- **express-rate-limit** — 100 req / 15 min per IP
- **CORS** — restricted to frontend origin
- **Input validation** — Mongoose schema validators

---

## 🎨 Footer (Standalone)

The `footer/` directory contains a fully standalone dark-blue themed footer:

```html
<!-- Include Font Awesome v6 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
<link rel="stylesheet" href="footer/footer.css" />

<!-- Then paste footer/index.html markup -->
```

Social links:
- 🌐 [vvraju.netlify.app](https://vvraju.netlify.app/)
- 💻 [github.com/vvraju56](https://github.com/vvraju56)
- 🔗 [LinkedIn](https://www.linkedin.com/in/vishnuraju-v-757b9929b)

---

## 👨‍💻 Author

Built with ❤️ by **VV** — [vvraju.netlify.app](https://vvraju.netlify.app/)

---

## 📄 License

MIT — free to use, modify, and distribute.
