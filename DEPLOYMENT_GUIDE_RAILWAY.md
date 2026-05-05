# 🚂 GUIDE DE DÉPLOIEMENT - RAILWAY.APP (ALTERNATIVE)

## ⏱️ Temps estimé : 15-20 minutes

---

## 📋 PRÉ-REQUIS

✅ Compte GitHub (gratuit)
✅ Compte Railway.app (gratuit)
✅ Code source Optix Royal

---

# PARTIE 1 : SETUP RAILWAY

## Étape 1.1 : Créer un Compte Railway

1. **Aller sur** : https://railway.app
2. **Login with GitHub**
3. **Autoriser Railway** à accéder à vos repos
4. ✅ Compte créé !

**Railway Free Tier** :
- $5 de crédit gratuit/mois
- Pas de carte de crédit requise
- Suffisant pour tester

---

# PARTIE 2 : DÉPLOYER LA DATABASE

## Étape 2.1 : Créer PostgreSQL Database

1. **Dashboard Railway** : https://railway.app/dashboard

2. **New Project**
   - Clic sur **New Project**

3. **Provision PostgreSQL**
   - Clic sur **Provision PostgreSQL**
   - ⏱️ Attendre 30 secondes

4. **Database créée** ✅
   - PostgreSQL démarre automatiquement

## Étape 2.2 : Récupérer les Credentials

1. **Cliquer sur la Database PostgreSQL**

2. **Onglet Variables**
   - Vous verrez toutes les variables générées automatiquement :
   ```
   DATABASE_URL
   PGHOST
   PGPORT
   PGUSER
   PGPASSWORD
   PGDATABASE
   ```

3. **Copier DATABASE_URL**
   - Clic sur l'icône **Copy** à côté de `DATABASE_URL`
   - Format : `postgresql://user:pass@host:port/db`
   - ⚠️ Sauvegarder cette URL

## Étape 2.3 : Initialiser le Schema

### Option A : Via psql (Ligne de commande)

```bash
# Se connecter à la database
psql "postgresql://postgres:password@containers-us-west-xxx.railway.app:7432/railway"

# Copier-coller le schema SQL
# (Voir schema.sql complet dans le guide Render)
```

### Option B : Via Railway CLI

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Connect to database
railway connect postgres

# Puis exécuter le SQL
```

### Option C : Via Script de Migration

```bash
# Créer migrate.js
cat > migrate.js << 'EOF'
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const schema = fs.readFileSync('./schema.sql', 'utf8');

pool.query(schema)
  .then(() => {
    console.log('✅ Schema created');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
EOF

# Exécuter
DATABASE_URL="votre_url" node migrate.js
```

---

# PARTIE 3 : DÉPLOYER LE BACKEND

## Étape 3.1 : Push Code sur GitHub

**Si pas encore fait** :

```bash
cd /app/backend-nodejs

# Créer .gitignore
echo "node_modules/
.env
logs/" > .gitignore

# Init et push
git init
git add .
git commit -m "Optix Royal Backend"
git remote add origin https://github.com/YOUR_USERNAME/optixroyal-backend.git
git push -u origin main
```

## Étape 3.2 : Déployer depuis GitHub

1. **Retour sur Railway Dashboard**

2. **Dans le même Project (avec la database)**
   - Clic sur **New** (en haut à droite)
   - Sélectionner **GitHub Repo**

3. **Configurer Repo**
   - Si pas encore connecté : **Configure GitHub App**
   - Sélectionner : **optixroyal-backend**
   - Clic sur **Deploy**

4. **Railway détecte automatiquement** :
   - ✅ Node.js app
   - ✅ package.json
   - ✅ Lance `yarn install`

## Étape 3.3 : Variables d'Environnement

1. **Cliquer sur le service Backend** (dans le project)

2. **Onglet Variables**

3. **Add Variables** (Clic sur **Raw Editor**)

```bash
# Copier-coller TOUT le bloc
NODE_ENV=production
PORT=8001
HOST=0.0.0.0

# Frontend URL
FRONTEND_URL=https://royal-trading-hub.preview.emergentagent.com

# JWT Secrets (GÉNÉRER DES CLÉS FORTES !)
JWT_SECRET=railway_optixroyal_jwt_secret_CHANGEZ_CETTE_CLE_123456789_xyz
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=railway_refresh_secret_AUTRE_CLE_987654321_abc
JWT_REFRESH_EXPIRES_IN=7d

# MetaApi (optionnel)
METAAPI_TOKEN=
METAAPI_ACCOUNT_ID=
MT5_DEFAULT_SERVER=MetaQuotes-Demo
MT5_DEFAULT_BALANCE=10000
MT5_DEFAULT_LEVERAGE=100

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

4. **Ajouter DATABASE_URL**
   - Railway le fait automatiquement !
   - Clic sur **New Variable** → **Add Reference**
   - Sélectionner `DATABASE_URL` depuis PostgreSQL service
   - ✅ Lié automatiquement

**OU manuellement** :
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
```

5. **Sauvegarder**
   - Les variables se sauvegardent automatiquement
   - Le service redémarre automatiquement

## Étape 3.4 : Configurer le Démarrage

1. **Onglet Settings**

2. **Start Command** (optionnel - Railway le détecte)
   ```
   node src/server.js
   ```

3. **Root Directory** (si backend dans un sous-dossier)
   - Si votre code est à la racine : laisser vide
   - Si dans `/backend` : mettre `backend`

## Étape 3.5 : Obtenir l'URL Publique

1. **Onglet Settings**

2. **Networking** → **Generate Domain**
   - Railway génère : `optixroyal-api-production.up.railway.app`
   - OU configurer custom domain

3. **Copier l'URL**
   - Format : `https://optixroyal-api-production.up.railway.app`

## Étape 3.6 : Vérifier le Déploiement

1. **Onglet Deployments**
   - Status doit être : **SUCCESS** ✅
   - Sinon, vérifier les **Logs**

2. **Tester l'API**
```bash
curl https://optixroyal-api-production.up.railway.app/api/health
```

**Réponse attendue** :
```json
{
  "status": "success",
  "message": "Optix Royal API is running"
}
```

---

# PARTIE 4 : CONFIGURATION FRONTEND

## Étape 4.1 : Mettre à Jour le Frontend

### 1. Modifier `.env` du Frontend

```bash
# /app/frontend/.env
REACT_APP_BACKEND_URL=https://optixroyal-api-production.up.railway.app
```

### 2. Rebuild Frontend

```bash
cd /app/frontend
yarn build
```

### 3. Redéployer

**Si sur Emergent** :
- Mettre à jour la variable `REACT_APP_BACKEND_URL`
- Redéployer

**Si sur Vercel/Netlify** :
- Push le code
- Déploiement automatique

## Étape 4.2 : Tester l'Intégration

1. **Ouvrir** : https://royal-trading-hub.preview.emergentagent.com/

2. **Créer un compte**
   - Remplir le formulaire
   - Cliquer "Créer un compte"

3. **Vérification**
   - ✅ Compte créé
   - ✅ Token JWT reçu
   - ✅ Redirection vers dashboard
   - ✅ Solde affiché : $10,000

---

# PARTIE 5 : AVANTAGES RAILWAY

## 5.1 : Auto-Redeploy

✅ Chaque `git push` redéploie automatiquement
✅ Pas de configuration nécessaire
✅ Rollback facile via l'interface

## 5.2 : Monitoring Intégré

**Metrics Tab** :
- CPU Usage
- Memory Usage
- Network (in/out)
- Request count

**Observability Tab** :
- Logs en temps réel
- Filtres avancés
- Export possible

## 5.3 : Database Management

**PostgreSQL Service** :
- Backups automatiques
- Metrics (connections, queries)
- Query explorer
- Direct SQL access

## 5.4 : CLI Puissant

```bash
# Logs en temps réel
railway logs

# Shell dans le container
railway shell

# Exécuter une commande
railway run node migrate.js

# Variables d'environnement
railway variables
```

---

# 🎯 CHECKLIST FINALE

## Setup Railway ✅
- [ ] Compte Railway créé
- [ ] Project créé
- [ ] PostgreSQL provisionné
- [ ] Schema SQL exécuté

## Backend Deployment ✅
- [ ] Code pushé sur GitHub
- [ ] Service déployé depuis GitHub
- [ ] Variables d'environnement configurées
- [ ] DATABASE_URL liée
- [ ] Domain généré
- [ ] Status : SUCCESS
- [ ] `/api/health` fonctionne

## Frontend Integration ✅
- [ ] REACT_APP_BACKEND_URL mis à jour
- [ ] Frontend redéployé
- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] API calls réussissent

---

# 🆘 TROUBLESHOOTING RAILWAY

## Problème 1 : "Build Failed"

**Solution** :
```bash
# Vérifier package.json
cat package.json

# Tester localement
yarn install
node src/server.js

# Vérifier les logs Railway
# Deployments → Click deployment → Logs
```

## Problème 2 : "Application Error"

**Causes communes** :
- Port hardcodé (utiliser `process.env.PORT`)
- Variables d'env manquantes
- Database non accessible

**Solution** :
1. Vérifier les logs
2. Vérifier variables d'env
3. Tester database connection

## Problème 3 : "Database Connection Error"

**Solution** :
```bash
# Vérifier que DATABASE_URL est liée
# Variables tab → DATABASE_URL doit être présent

# Tester la connexion
railway connect postgres
\dt  # Lister les tables
```

## Problème 4 : "Out of Credits"

**Railway Free Tier** : $5/mois

**Si dépassé** :
- Ajouter une carte (pas de charge si < $5)
- Ou passer à Hobby Plan ($5/mois)

---

# 📊 COMPARAISON RENDER vs RAILWAY

| Feature | Render | Railway |
|---------|--------|----------|
| **Free Tier** | 512 MB RAM | $5 crédit/mois |
| **Sleep** | Après 15 min | Non |
| **Build Time** | ~3-5 min | ~2-3 min |
| **Auto Deploy** | ✅ | ✅ |
| **Database** | PostgreSQL gratuit 90j | PostgreSQL inclus |
| **CLI** | Basique | Avancé |
| **Logs** | Bon | Excellent |
| **Ease of Use** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Recommandation** :
- **Render** : Meilleur pour long-terme (après 90j free DB)
- **Railway** : Meilleur pour développement et prototypage

---

# 📞 SUPPORT RAILWAY

**Documentation** : https://docs.railway.app
**Discord Community** : https://discord.gg/railway
**Status** : https://status.railway.app
**CLI Docs** : https://docs.railway.app/develop/cli

---

**🎉 SUCCÈS !** Backend déployé sur Railway !
