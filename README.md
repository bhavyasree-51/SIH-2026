# SIH-2026: Kisan Mitra (Smart Krishi Assistant) 🌾🤖

> **Smart India Hackathon (SIH 2026)** — An end-to-end AI-powered Precision Agricultural Assistant and Volunteer Field Network built for Indian farmers.

---

## 🌟 Key Features

- 🌿 **Multimodal Plant Pathology & Disease Detection**: Instant leaf lesion scanning across 38 PlantVillage crop classes powered by Google Gemini 3.5 Multimodal Vision + ICAR scientific chemical/organic recommendations.
- 🎙️ **Multilingual AI Voice Copilot**: Native conversational agricultural voice assistant in **Telugu (`తెలుగు`)**, **Hindi (`हिंदी`)**, and **English** with real-time text-to-speech read aloud.
- 🧑‍🌾 **Farmer Portal**: Interactive crop disease reports, localized weather forecasts, soil moisture & nutrient advisory, mandi market trends, and subsidy schemes (PMKSY, PM-KISAN).
- 🤝 **Field Volunteer Portal**: Farmer enrollment, village farm directory, disease triage review queue, and broadcast advisories.
- 🗄️ **Supabase Cloud Database Persistence**: Real-time cloud sync for registered farmer and volunteer profiles with offline local caching.
- 📱 **Mobile APK Ready**: Fully compatible with Android WebView / Median.co for instant mobile deployment.

---

## 🏗️ Architecture & Tech Stack

### 🎨 Frontend (`/src`)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Modern CSS3 Glassmorphism + Responsive Mobile-First Design
- **Icons**: Lucide React
- **Voice / Speech**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) + AI4Bharat IndicTrans2 Tagging
- **Database**: Supabase JS Client (`@supabase/supabase-js`)
- **Deployment**: Vercel (`vercel.json`)

### ⚙️ Backend (`/backend`)
- **Framework**: FastAPI (Python 3.10+) + Uvicorn ASGI
- **AI Models**: Google Gemini 3.1 / 3.5 Flash Multimodal Vision & Generative AI
- **Taxonomy**: PlantVillage 38-Class Dataset + ICAR Agronomic Diagnostic Engine
- **Deployment**: Render / Railway / Docker (`Procfile`)

---

## 🚀 Quick Start & Setup

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start local dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI server (http://localhost:8000)
python -m uvicorn main:app --reload --port 8000
```

---

## 📂 Project Structure

```
SIH-2026/
├── backend/                  # FastAPI Python Backend
│   ├── main.py               # API endpoints, Gemini Vision cascade, Agronomic DB
│   ├── requirements.txt      # Python dependencies
│   ├── Procfile              # Cloud deployment process file
│   └── .env.example          # Backend environment variables template
├── src/                      # Vite + React Frontend
│   ├── components/           # UI Components (Navigation, Headers, Cards)
│   ├── pages/                # Disease Detection, Voice Copilot, Farmer & Volunteer Portals
│   ├── services/             # Gemini AI, Vision Pathologist, Supabase AuthService
│   ├── hooks/                # Voice Assistant and Speech Hooks
│   ├── i18n/                 # Multilingual Localization (Telugu, Hindi, English)
│   └── lib/                  # Supabase Client & Config
├── public/                   # Static assets & icons
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite build configuration
└── README.md                 # Project documentation
```

---

## 📄 License
This project is developed for **Smart India Hackathon (SIH 2026)**. Open source under the MIT License.

