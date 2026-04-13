# 🚀 Déploiement ORION sur Render

## Prérequis

- Compte GitHub (gratuit) → https://github.com
- Compte Render (gratuit) → https://render.com
- Compte MongoDB Atlas (gratuit) → https://cloud.mongodb.com
- Clé API Gemini → https://aistudio.google.com

---

## ÉTAPE 1 — MongoDB Atlas (base de données)

1. Va sur https://cloud.mongodb.com
2. Crée un compte gratuit
3. **Create a deployment** → choisir **M0 Free**
4. Région : Europe (Frankfurt)
5. **Database Access** → Add new user → copie le mot de passe

6. **Network Access** → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
7. **Connect** → Drivers → copie l'URI
   ```
   mongodb+srv://user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Remplace `<password>` par ton mot de passe

---

## ÉTAPE 2 — GitHub (héberger le code)

1. Va sur https://github.com → New repository
2. Nom : `orion-v2` → Public → Create
3. Dans ton terminal, depuis le dossier `orion-v2/` :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/matteobriey8-dot/orion-v2.git
   git push -u origin main
   ```

---

## ÉTAPE 3 — Déployer le Backend sur Render

1. Va sur https://render.com → **New** → **Web Service**
2. **Connect GitHub** → sélectionne `orion-v2`
3. Configuration :
   - **Name** : `orion-server`
   - **Root Directory** : `server`
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : Free
4. **Environment Variables** → Add :

| Clé | Valeur |
|-----|--------|
| `NODE_ENV` | `production` |
| `GEMINI_API_KEY` | ta clé Gemini |
| `GEMINI_MODEL` | `gemini-2.0-flash` |
| `MONGO_URI` | ton URI MongoDB Atlas |
| `JWT_SECRET` | une longue chaîne aléatoire (ex: `orion_super_secret_jwt_2024_change_moi`) |
| `ALLOWED_ORIGINS` | `*` (tu changeras après) |

5. **Create Web Service** → attends 2-3 min
6. Note l'URL : `https://orion-server-h6fg.onrender.com`

---

## ÉTAPE 4 — Déployer le Frontend sur Render

1. **New** → **Static Site**
2. Connecte le même repo `orion-v2`
3. Configuration :
   - **Name** : `orion-client`
   - **Root Directory** : `client`
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `build`
4. **Environment Variables** → Add :

| Clé | Valeur |
|-----|--------|
| `REACT_APP_API_URL` | `https://orion-server-h6fg.onrender.com/api` |

5. **Redirects/Rewrites** → Add rule :
   - Source : `/*`
   - Destination : `/index.html`
   - Type : **Rewrite**

6. **Create Static Site** → attends 3-5 min
7. Note l'URL : `https://orion-client-xxxx.onrender.com`

---

## ÉTAPE 5 — Finaliser la config CORS

Retourne sur ton service backend Render :
1. **Environment** → modifie `ALLOWED_ORIGINS` :
   ```
   https://orion-client-xxxx.onrender.com
   ```
2. **Manual Deploy** → **Deploy latest commit**

---

## ÉTAPE 6 — Tester !

Ouvre : `https://orion-client-xxxx.onrender.com`

✅ L'app doit s'afficher  
✅ Crée un compte → tu arrives sur le dashboard  
✅ Va dans Chat → envoie un message → réponse Gemini  

---

## ⚠️ Notes importantes

### Free tier Render
- Le backend se met en **veille après 15 min d'inactivité**
- Au premier appel après veille, il faut attendre ~30 sec de démarrage
- Solution : upgrade à Starter ($7/mois) ou utiliser un service de ping (ex: UptimeRobot)

### Domaine personnalisé
- Render permet d'ajouter ton propre domaine gratuitement
- Dashboard service → Settings → Custom Domain

### Mise à jour de l'app
```bash
git add .
git commit -m "Mise à jour"
git push
```
Render redéploie automatiquement !

---

## Commandes utiles en local

```bash
# Backend
cd server && npm run dev    # http://localhost:3001

# Frontend  
cd client && npm start      # http://localhost:3000

# Vérifier le backend
curl http://localhost:3001/api/health
```
