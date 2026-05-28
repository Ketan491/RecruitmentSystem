# RecruitAI — AI-Powered Smart Recruitment Platform

A full-stack web application that helps job seekers optimize their resumes and prepare for interviews using AI, while giving HR teams powerful candidate analytics.

## ✨ Features

### For Candidates
- **Resume Upload & Parsing** — Upload PDF resumes; AI extracts skills, experience, and education
- **ATS Scorer** — Paste a job description and get a match score with skill gap analysis
- **Interview Analyzer** — Real-time AI feedback on your interview answers via speech or text
- **Job Board** — Browse and search curated tech job listings; HR team can post new roles
- **Recommendations** — Personalized job and skill recommendations based on your profile
- **Analytics Dashboard** — Track your ATS scores and interview sessions over time

### For HR Teams
- **Candidate Overview** — View all registered candidates, their skills, and best ATS scores
- **Analytics** — Aggregated charts: skill frequency, score distributions, registration trends

## 🛠 Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18, Vite, TailwindCSS, Framer Motion, GSAP |
| Backend   | FastAPI (Python), Motor (async MongoDB driver) |
| Database  | MongoDB |
| Auth      | JWT (HS256) via python-jose |
| AI / NLP  | spaCy, scikit-learn, PyPDF2, NLTK |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Configure environment
cp .env.example .env            # then edit .env with your values

# Seed demo accounts (optional)
python seed_data.py

# Start server
python run.py                   # or: uvicorn app.main:app --reload
```

Backend runs at **http://localhost:8000** · API docs at **http://localhost:8000/docs**

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env            # set VITE_API_URL if backend isn't on :8000

# Start dev server
npm run dev
```

Frontend runs at **http://localhost:5173**

## 🔐 Demo Credentials

After running `python seed_data.py`:

| Role      | Email            | Password    |
|-----------|------------------|-------------|
| Candidate | user@demo.com    | password123 |
| HR        | hr@demo.com      | password123 |

## 📁 Project Structure

```
AI-Smart-Recruitment/
├── backend/
│   ├── app/
│   │   ├── ai/              # NLP: resume parser, ATS scorer, interview analyzer, recommender
│   │   ├── core/            # Config, database connection, JWT security
│   │   ├── middleware/      # Auth dependency (get_current_user, get_hr_user)
│   │   ├── models/          # Pydantic request/response schemas
│   │   ├── routes/          # FastAPI routers (auth, resume, ats, jobs, hr, …)
│   │   └── utils/           # MongoDB helpers, serialization, time utilities
│   ├── requirements.txt
│   ├── run.py               # Dev runner
│   └── seed_data.py         # Demo data seeder
│
└── frontend/
    └── src/
        ├── components/      # Reusable UI (Sidebar, ScoreRing, ErrorBoundary, …)
        ├── context/         # AuthContext, ToastContext
        ├── pages/           # Route-level page components (lazy-loaded)
        ├── styles/          # Tailwind base + custom utility classes
        └── utils/           # api.js (namespaced), constants.js (ROUTES, API)
```

## ⚙️ Environment Variables

### Backend `.env`
```env
MONGODB_URL=mongodb://localhost:27017
DB_NAME=recruitment_db
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
UPLOAD_DIR=./uploads
CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000
```

## 🚢 Deployment

### Backend (Heroku / Railway)
A `Procfile` is included:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Update `CORS_ORIGINS` in your environment to your deployed frontend URL.

### Frontend (Vercel / Netlify)
```bash
npm run build          # outputs to dist/
```
Set `VITE_API_URL` to your deployed backend URL in the platform's environment settings.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push and open a Pull Request

## 📄 License

MIT © 2024 RecruitAI
