# Deployment Guide

MirrorMint is optimized for cloud deployment using Railway and Netlify.

## Backend (Railway)
1. Set the Root Directory to `/backend`.
2. Ensure `ALLOWED_ORIGINS` is set to your Netlify URL.
3. Railway uses the `Procfile` to run Gunicorn.

## Frontend (Netlify)
1. Set the Base Directory to `/frontend`.
2. Set `NEXT_PUBLIC_API_URL` to your Railway public URL.
3. Netlify automatically handles the Next.js build process.

## Environment Variables
Ensure all keys from `.env.example` are populated in your cloud provider's dashboard.
