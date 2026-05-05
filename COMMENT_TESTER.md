# 🚨 IMPORTANT - Comment Tester Optix Royal

## ❌ Problème Actuel

Vous essayez d'accéder à :
- **Frontend déployé** : https://royal-trading-hub.preview.emergentagent.com/
- **Backend local** : http://localhost:8001

**Ceci ne fonctionne PAS** à cause de :
1. **CORS** - Le navigateur bloque les requêtes HTTPS → HTTP localhost
2. **Réseau** - Le frontend déployé ne peut pas accéder à votre machine locale

## ✅ Solution : 2 Options

### Option 1 : Tester en LOCAL (RECOMMANDÉ) ⚡

**Dans votre navigateur, ouvrez :**
```
http://localhost:3000
```

**PAS** https://royal-trading-hub.preview.emergentagent.com/

#### Test Rapide :
1. Ouvrir **http://localhost:3000**
2. Cliquer sur "Compte Elite" ou "Ouvrir un compte"
3. Remplir :
   - Email: test@test.com
   - Password: Test123456
   - Nom: Test User
4. Cliquer "Créer un compte"
5. ✅ Vous devriez être connecté !

### Option 2 : Déployer le Backend 🚀

Pour que https://royal-trading-hub.preview.emergentagent.com/ fonctionne, il faut déployer le backend sur un serveur accessible publiquement.

#### Déploiement Rapide (Render.com - GRATUIT)

1. **Créer compte sur** : https://render.com
2. **Nouveau Web Service** → Connect GitHub repo
3. **Environment Variables** :
   ```
   DATABASE_URL=<votre_postgresql_url>
   JWT_SECRET=<secret_key_securisé>
   FRONTEND_URL=https://royal-trading-hub.preview.emergentagent.com
   ```
4. **Deploy!**
5. Copier l'URL publique (ex: https://optixroyal-api.onrender.com)
6. Mettre à jour frontend : `REACT_APP_BACKEND_URL=https://optixroyal-api.onrender.com`

## 🧪 Test API Backend (Fonc tionne Déjà!)

Le backend Python **fonctionne parfaitement** en local :

```bash
# Test Register
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "full_name": "Test User"
  }'

# Test Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'

# Test Markets
curl http://localhost:8001/api/markets/

# Test Health
curl http://localhost:8001/api/health
```

## 📊 Services Actuels

```
✅ Backend Python (FastAPI) : http://localhost:8001
✅ Frontend React          : http://localhost:3000
✅ MongoDB                 : mongodb://localhost:27017

⚠️ Frontend déployé        : https://royal-trading-hub.preview.emergentagent.com (ne peut pas accéder à localhost)
```

## 🎯 Pour Résoudre Votre Problème MAINTENANT

**Étape 1** : Ouvrez votre navigateur
**Étape 2** : Allez sur **http://localhost:3000** (PAS le site déployé)
**Étape 3** : Cliquez sur "Compte Elite"
**Étape 4** : Créez votre compte
**Étape 5** : ✅ Ça marche !

## 🔧 Backend Node.js (Alternative)

J'ai aussi créé un backend Node.js complet dans `/app/backend-nodejs/` si vous préférez Node.js au lieu de Python.

**Pour l'utiliser :**
```bash
cd /app/backend-nodejs
yarn install
# Configurer PostgreSQL
# Copier .env.example → .env
node src/server.js
```

## ❓ Besoin d'Aide ?

**Erreur "CORS" ou "ERR_CONNECTION_REFUSED"** ?
→ Vous êtes sur le frontend déployé. Utilisez http://localhost:3000

**Erreur "Network Error"** ?
→ Vérifiez que le backend tourne : `curl http://localhost:8001/api/health`

**Erreur lors de l'inscription** ?
→ Si vous êtes sur localhost:3000, le backend devrait fonctionner. Partagez l'erreur exacte.

---

**TL;DR** : Utilisez **http://localhost:3000** et non le site déployé si le backend est en local.
