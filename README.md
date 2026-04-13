# ORION v2 — React + Node.js + MongoDB

## Structure
```
orion-v2/
├── client/    ← React (frontend)
└── server/    ← Node.js + Express (backend)
```

## Lancement rapide

### 1. Backend
```bash
cd server
cp .env.example .env
# Remplis .env avec tes clés
npm install
npm run dev
# → http://localhost:3001
```

### 2. Frontend
```bash
cd client
npm install
npm start
# → http://localhost:3000
```

## Configuration .env (server/)

| Variable | Description | Où l'obtenir |
|---|---|---|
| `GEMINI_API_KEY` | Clé API Gemini | https://aistudio.google.com |
| `MONGO_URI` | URI MongoDB Atlas | https://cloud.mongodb.com |
| `JWT_SECRET` | Clé secrète JWT | Chaîne aléatoire longue |

## MongoDB Atlas (gratuit)

1. Va sur https://cloud.mongodb.com
2. Crée un compte gratuit
3. Crée un cluster M0 (gratuit)
4. Database Access → Add user
5. Network Access → Allow from anywhere (0.0.0.0/0)
6. Connect → Drivers → copie l'URI
7. Remplace `<password>` par ton mot de passe

## Déploiement Render

### Backend
- New Web Service → connecte ton GitHub
- Root Directory : `server`
- Build Command : `npm install`
- Start Command : `npm start`
- Ajoute les variables d'env

### Frontend
- New Static Site → connecte ton GitHub
- Root Directory : `client`
- Build Command : `npm run build`
- Publish Directory : `build`
- Ajoute : `REACT_APP_API_URL=https://ton-backend.onrender.com/api`
