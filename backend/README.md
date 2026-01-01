# README.md for Hugging Face Spaces
---
title: Dental Caries Detection API
emoji: 🦷
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# Dental Caries Detection API

AI-powered dental caries detection system using YOLOv8.

## Features
- Real-time dental caries detection
- Patient management
- Detection history tracking
- PDF report generation
- Secure authentication

## API Documentation
Visit `/docs` for interactive API documentation (Swagger UI).

## Environment Variables
Configure the following secrets in Hugging Face Space settings:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `GROQ_API_KEY`: Groq API key for chatbot

## Usage
The API will be available at your Hugging Face Space URL.
