# Farming-assistant-backend

FastAPI intelligence backend for Kisan Mitra (Smart Krishi).

## Features
- **Multimodal Plant Leaf Pathology**: Google Gemini Multimodal Vision cascade with local PyTorch YOLO PlantDiseaseDetection transformer fallback.
- **Precision Multilingual Voice Copilot**: Real-time Telugu, Hindi, and English agricultural Q&A with farm telemetry personalization.
- **In-Memory Audio Caching**: Ultra-fast gTTS sub-millisecond audio streaming.
- **Zero-Cost Free Tier Deployment**: Ready for deployment on Render, Railway, Koyeb, or Hugging Face Spaces.

## Quick Start
```bash
pip install -r requirements.txt
python -m uvicorn main:app --port 8000
```

