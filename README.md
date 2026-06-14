# Urban Eye 🏙️

A smart civic complaint management platform where citizens can report real-world issues — potholes, water problems, garbage, streetlights — track their resolution in real time, and see the community impact through a public **Impact Portfolio**.

---

## 🚀 Features

### 👤 Citizen
- 🔐 Register & Login with JWT authentication
- 📬 Submit complaints with photo, category, city & address
- 📊 Track status (New → In Progress → Resolved) in real time
- 🏆 **My Impact tab** — personal gallery of resolved complaints + success rate stats
- ✉️ Email notification when complaint is resolved

### 🛡️ Admin
- 📋 View & manage all citizen complaints
- 🔄 Update complaint status with one click (triggers email to citizen)
- 🔍 Search & filter by status, city, address, email
- 🏆 **Portfolio Manager tab** — resolved grid, top cities chart, category breakdown, CSV export
- 👥 Full user/system visibility

### 👮 Officer
- 📋 View all citizen complaints (same as Admin)
- 🔄 Update complaint status → resolve issues directly
- 🏆 Access to Portfolio Manager tab
- ❌ No admin-only user management

### 🌐 Public
- 🗺️ **Impact Portfolio page** (`/portfolio`) — live paginated gallery of all resolved issues
- 📈 Animated stat counters: Resolved, Cities Covered, Citizens Helped, Success Rate %
- 🏷️ Filter by category (Roads, Water, Waste, etc.) and search by city
- 🏆 Top cities bar chart by resolved count
- ⏱️ **Real-time updates** — stats refresh every 30s, complaints every 45s (no page reload needed)

---

## 📦 Tech Stack

| Layer     | Technology                               |
|-----------|------------------------------------------|
| Frontend  | React 19, Tailwind CSS v4, React Router v7 |
| Backend   | Node.js, Express.js v5                   |
| Database  | MongoDB (Mongoose)                       |
| Auth      | JWT (stored in localStorage)             |
| Images    | Local file storage (`/public/uploads`)   |
| Email     | Nodemailer                               |
| Dev Tools | Vite, Nodemon, cross-env                 |

---

## 🗂️ Project Structure

```
Urban Eye/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── PortfolioPage.jsx        # Public impact gallery
│   │   │   ├── CitizenDashboard.jsx     # My Complaints + My Impact tabs
│   │   │   ├── AdminDashboard.jsx       # Complaints + Portfolio tabs
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   └── PricingPage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── context/
│   │       └── AuthContext.jsx
│   └── vite.config.js
│
└── server/                      # Express backend
    ├── controllers/
    │   ├── complaintController.js   # CRUD + stats + pagination
    │   └── userController.js
    ├── models/
    │   ├── Complaint.js             # category, city, state, address, imageUrl, status
    │                            # category enum: Roads, Water, Waste, Lighting, Safety, Parks, Other
    │   └── User.js                  # email, fullName, role (Citizen | Admin | Officer)
    ├── routes/
    │   ├── complaintRoutes.js
    │   └── userRoutes.js
    ├── middleware/
    │   └── auth.js                  # protectRoute, authorizeAdmin, authorizeStaff (Admin|Officer)
    ├── config/
    │   ├── db.js
    │   └── email.js
    ├── public/uploads/              # Local image storage
    └── server.js
```

---

## 🛠️ Setup & Development

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/urban-eye.git
cd "Urban Eye"
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT = 5000
MONGODB_URI = mongodb://127.0.0.1:27017
JWT_SECRET = "your_secret_here"
NODE_ENV = development
```

Start the server:
```bash
npm run dev        # development mode (hot reload)
# or
npm start
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev        # starts Vite at http://localhost:5173
```

> Vite proxies `/api` and `/uploads` to `http://localhost:5000` automatically.

### 4. Create an Admin user
```bash
cd server
node createAdmin.js
```

### 5. Create an Officer user
In MongoDB Compass (or Mongosh), update any Citizen user's role:
```js
db.users.updateOne({ email: "officer@example.com" }, { $set: { role: "Officer" } })
```

---

## 🔌 API Endpoints

| Method | Route                     | Auth            | Description                       |
|--------|---------------------------|-----------------|-----------------------------------|
| POST   | `/api/auth/register`      | Public          | Register citizen                  |
| POST   | `/api/auth/login`         | Public          | Login → returns JWT               |
| GET    | `/api/complaint/stats`    | Public          | Impact portfolio stats (live)     |
| GET    | `/api/complaint/public`   | Public          | Paginated resolved complaints     |
| POST   | `/api/complaint`          | Citizen         | Submit new complaint              |
| GET    | `/api/complaint/my`       | Citizen         | Get own complaints                |
| GET    | `/api/complaint`          | Admin / Officer | Get all complaints                |
| PUT    | `/api/complaint/:id`      | Admin / Officer | Update complaint status           |

---

## 🎯 Complaint Categories

- 🛣️ Roads & Potholes
- 💧 Water Supply
- ♻️ Waste & Sanitation
- 💡 Street Lighting
- 🛡️ Public Safety
- 🌳 Parks & Recreation
- 📋 Other

---

## 📜 License

ISC
