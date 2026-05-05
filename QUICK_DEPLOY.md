# 🚀 DÉPLOIEMENT RAPIDE - 5 MINUTES

## ⚡ Le Plus Rapide : Railway

### 1. Setup (2 minutes)
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Init project
cd /app/backend-nodejs
railway init
```

### 2. Database (1 minute)
```bash
# Provisionner PostgreSQL
railway add postgres

# Obtenir l'URL
railway variables
```

### 3. Deploy (2 minutes)
```bash
# Push et deploy en une commande
railway up

# Obtenir l'URL publique
railway domain
```

**✅ FAIT ! Backend déployé**

---

## 🎯 Checklist Ultra-Rapide

### Avant de Déployer
- [ ] Code sur GitHub
- [ ] `.env.example` créé (pas de `.env` dans git)
- [ ] `package.json` présent
- [ ] `src/server.js` fonctionne en local

### Variables d'Environnement Minimales
```bash
NODE_ENV=production
PORT=8001
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=votre_secret_tres_long_et_securise
FRONTEND_URL=https://votre-frontend.com
```

### Après le Déploiement
```bash
# Tester
curl https://votre-api.railway.app/api/health

# Si erreur, voir les logs
railway logs
```

---

## 🆚 RENDER vs RAILWAY - Choix Rapide

### Choisir RENDER si :
- ✅ Vous voulez un free tier plus long (90 jours DB)
- ✅ Vous préférez une interface web simple
- ✅ Projet long-terme

### Choisir RAILWAY si :
- ✅ Vous voulez déployer MAINTENANT (plus rapide)
- ✅ Vous aimez le CLI
- ✅ Prototype/MVP rapide
- ✅ Pas de sleep automatique

---

## 🔧 Setup PostgreSQL Schema

**Option 1 : Render Dashboard**
- Data → Query → Coller le SQL
- Exécuter

**Option 2 : Railway CLI**
```bash
railway connect postgres
# Puis coller le schema SQL
```

**Option 3 : psql**
```bash
psql "votre_database_url" < schema.sql
```

---

## 📱 Connecter le Frontend

### 1. Copier l'URL de l'API
- Render: `https://optixroyal-api.onrender.com`
- Railway: `https://optixroyal-api-production.up.railway.app`

### 2. Configurer le Frontend
```bash
# .env du frontend
REACT_APP_BACKEND_URL=https://votre-api-url
```

### 3. Rebuild
```bash
cd /app/frontend
yarn build
# Redéployer
```

---

## ⚠️ Erreurs Communes

### "Application failed to respond"
➡️ Vérifier `PORT` dans code : `process.env.PORT || 8001`

### "Database connection failed"
➡️ Vérifier `DATABASE_URL` dans les variables d'env

### "CORS error"
➡️ Vérifier `FRONTEND_URL` correspond exactement

---

## 🎉 Test Final

```bash
# Health check
curl https://votre-api/api/health

# Register
curl -X POST https://votre-api/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123","full_name":"Test"}'

# Si vous recevez un token JWT → ✅ SUCCESS
```

---

**Temps total** : 5-10 minutes si tout va bien

**Voir guides complets** :
- [DEPLOYMENT_GUIDE_RENDER.md](./DEPLOYMENT_GUIDE_RENDER.md)
- [DEPLOYMENT_GUIDE_RAILWAY.md](./DEPLOYMENT_GUIDE_RAILWAY.md)
