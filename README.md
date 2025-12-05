# MULTITOOL // UTILITY OS

A Neo-Brutalist utility dashboard with AI-powered tools.

![Neo-Brutalism Design](https://img.shields.io/badge/Design-Neo--Brutalism-black?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Python-FastAPI-blue?style=for-the-badge&logo=python)

## 🛠️ Tools

| Tool                   | Description                             | Status  |
| ---------------------- | --------------------------------------- | ------- |
| **Grammar Fixer**      | AI-powered text correction using Gemini | ✅ Live |
| **YouTube Downloader** | Extract video info & download links     | ✅ Live |
| **BG Remover**         | AI background removal with rembg        | ✅ Live |

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Vercel        │     │   Render        │
│   (Next.js)     │────▶│   (FastAPI)     │
│                 │     │                 │
│ • Grammar API   │     │ • YouTube API   │
│ • Frontend      │     │ • BG Remover    │
└─────────────────┘     └─────────────────┘
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Add environment variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   PYTHON_API_URL=https://your-render-app.onrender.com
   ```
3. Deploy

### Backend (Render)

1. Create new Web Service on Render
2. Connect the `api/` folder
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`

## 💻 Local Development

```bash
# Frontend
npm install
npm run dev

# Backend (separate terminal)
cd api
pip install -r requirements.txt
python server.py
```

## 🎨 Design

- **Style:** Neo-Brutalism
- **Fonts:** Space Grotesk (display), JetBrains Mono (body)
- **Features:** Hard shadows, thick borders, dot-grid background

## 📊 Analytics

- Vercel Web Analytics
- Vercel Speed Insights

## 📝 License

MIT
