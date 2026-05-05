# 🚀 GUIDE DE DÉPLOIEMENT - RENDER.COM (RECOMMANDÉ)

## ⏱️ Temps estimé : 20-30 minutes

---

## 📋 PRÉ-REQUIS

✅ Compte GitHub (gratuit)
✅ Compte Render.com (gratuit)
✅ Code source Optix Royal prêt

---

# PARTIE 1 : PRÉPARATION DU CODE

## Étape 1.1 : Créer un Repository GitHub

### 1. Aller sur GitHub
- Ouvrir https://github.com
- Clic sur le **+** en haut à droite → **New repository**

### 2. Configurer le Repository
```
Repository name: optixroyal-backend
Description: Optix Royal Trading Platform Backend
Visibility: ✅ Private (recommandé) ou Public
✅ Add a README file
.gitignore template: Node
License: MIT (optionnel)
```

### 3. Créer le Repository
Clic sur **Create repository**

## Étape 1.2 : Pousser le Code Backend

### 1. Initialiser Git (dans votre terminal local)
```bash
cd /app/backend-nodejs
git init
git add .
git commit -m "Initial commit - Optix Royal Backend"
```

### 2. Connecter au Repository GitHub
```bash
# Remplacer YOUR_USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/YOUR_USERNAME/optixroyal-backend.git
git branch -M main
git push -u origin main
```

✅ **Vérification** : Votre code devrait maintenant être visible sur GitHub

---

# PARTIE 2 : BASE DE DONNÉES POSTGRESQL

## Étape 2.1 : Créer une Base de Données Gratuite

### Option A : Utiliser Render PostgreSQL (Gratuit pendant 90 jours)

1. **Aller sur Render Dashboard** : https://dashboard.render.com

2. **Créer une nouvelle Database**
   - Clic sur **New +** → **PostgreSQL**

3. **Configuration**
   ```
   Name: optixroyal-db
   Database: optixroyal_db
   User: optixroyal_user
   Region: Frankfurt (EU) ou Oregon (US) - choisir le plus proche
   PostgreSQL Version: 15 (ou dernière version)
   Instance Type: Free
   ```

4. **Créer la Database**
   - Clic sur **Create Database**
   - ⏱️ Attendre 2-3 minutes pour la création

5. **Récupérer l'URL de Connexion**
   - Une fois créée, aller dans l'onglet **Info**
   - Copier **Internal Database URL** (commence par `postgresql://...`)
   - ⚠️ **IMPORTANT** : Sauvegarder cette URL, vous en aurez besoin

### Option B : Utiliser Supabase (Gratuit à vie)

1. **Créer compte** : https://supabase.com
2. **New Project**
   ```
   Name: optixroyal
   Database Password: [choisir un mot de passe fort]
   Region: West EU ou East US
   ```
3. **Récupérer Connection String**
   - Settings → Database → Connection String → URI
   - Copier l'URL complète

## Étape 2.2 : Initialiser le Schema Database

### 1. Installer PostgreSQL Client (si pas déjà installé)
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Windows
# Télécharger depuis https://www.postgresql.org/download/windows/
```

### 2. Se Connecter à la Database
```bash
# Remplacer DATABASE_URL par votre URL de connexion
psql "postgresql://user:password@host:port/database"
```

### 3. Créer le Schema

**Copier-coller le SQL suivant** (disponible dans `/app/backend-nodejs/schema.sql`) :

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create other tables...
-- (Voir le fichier schema.sql complet)
```

**OU plus simple** : Créer un fichier `migrate.js` :

```javascript
// /app/backend-nodejs/migrate.js
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const schema = fs.readFileSync('./schema.sql', 'utf8');

pool.query(schema)
  .then(() => {
    console.log('✅ Database schema created successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error creating schema:', err);
    process.exit(1);
  });
```

Puis exécuter :
```bash
DATABASE_URL="your_database_url" node migrate.js
```

✅ **Vérification** : Tables créées avec succès

---

# PARTIE 3 : DÉPLOYER LE BACKEND SUR RENDER

## Étape 3.1 : Créer le Web Service

1. **Dashboard Render** : https://dashboard.render.com

2. **New Web Service**
   - Clic sur **New +** → **Web Service**

3. **Connecter GitHub**
   - Clic sur **Connect GitHub**
   - Autoriser Render à accéder à vos repos
   - Sélectionner **optixroyal-backend**

4. **Configuration du Service**
   ```
   Name: optixroyal-api
   Region: Frankfurt (EU) ou Oregon (US)
   Branch: main
   Root Directory: (laisser vide)
   Runtime: Node
   Build Command: yarn install
   Start Command: node src/server.js
   Instance Type: Free
   ```

## Étape 3.2 : Variables d'Environnement

### 1. Aller dans **Environment**

### 2. Ajouter ces Variables d'Environnement :

```bash
# Server
NODE_ENV=production
PORT=8001
HOST=0.0.0.0

# Frontend (votre URL déployée)
FRONTEND_URL=https://royal-trading-hub.preview.emergentagent.com

# Database (URL copiée précédemment)
DATABASE_URL=postgresql://user:password@host:port/database
DB_HOST=dpg-xxxxx.frankfurt-postgres.render.com
DB_PORT=5432
DB_NAME=optixroyal_db
DB_USER=optixroyal_user
DB_PASSWORD=votre_mot_de_passe

# JWT Secrets (GÉNÉRER DES CLÉS FORTES)
JWT_SECRET=optixroyal_jwt_secret_prod_2024_CHANGEZ_CETTE_CLE_TRES_LONGUE_ET_SECURISEE_123456789
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=optixroyal_refresh_secret_prod_2024_AUTRE_CLE_ENCORE_PLUS_LONGUE_987654321
JWT_REFRESH_EXPIRES_IN=7d

# MetaApi (Optionnel - pour MT5 réel)
METAAPI_TOKEN=votre_token_metaapi
METAAPI_ACCOUNT_ID=votre_account_id
MT5_DEFAULT_SERVER=MetaQuotes-Demo
MT5_DEFAULT_BALANCE=10000
MT5_DEFAULT_LEVERAGE=100

# Email (Optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASSWORD=votre_app_password
SMTP_FROM=noreply@optixroyal.com

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 3. Générer des JWT Secrets Forts

**Option 1 : En ligne de commande**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2 : Site web**
https://www.uuidgenerator.net/guid

⚠️ **IMPORTANT** : Ne JAMAIS partager vos secrets JWT !

## Étape 3.3 : Déployer

1. **Sauvegarder les Variables d'Environnement**
   - Clic sur **Save Changes**

2. **Déploiement Automatique**
   - Render va automatiquement :
     - ✅ Cloner votre repo
     - ✅ Installer les dépendances (`yarn install`)
     - ✅ Démarrer le serveur (`node src/server.js`)

3. **Suivre les Logs**
   - Onglet **Logs** pour voir le déploiement en temps réel
   - ⏱️ Premier déploiement : 3-5 minutes

4. **Vérifier le Statut**
   - Une fois terminé, vous devriez voir : **Live** 🟢

## Étape 3.4 : Tester l'API Déployée

### 1. Récupérer l'URL de votre API
Exemple : `https://optixroyal-api.onrender.com`

### 2. Test Health Check
```bash
curl https://optixroyal-api.onrender.com/api/health
```

**Réponse attendue** :
```json
{
  "status": "success",
  "message": "Optix Royal API is running",
  "timestamp": "2024-01-13T...",
  "environment": "production"
}
```

### 3. Test Inscription
```bash
curl -X POST https://optixroyal-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@optixroyal.com",
    "password": "Test123456",
    "full_name": "Test User"
  }'
```

✅ **Si vous recevez un token JWT** : Backend déployé avec succès !

---

# PARTIE 4 : CONFIGURER LE FRONTEND

## Étape 4.1 : Mettre à Jour le Frontend Déployé

### Option A : Si vous contrôlez le déploiement frontend

1. **Modifier le fichier `.env` du frontend**
```bash
REACT_APP_BACKEND_URL=https://optixroyal-api.onrender.com
```

2. **Rebuild et Redéployer le frontend**
```bash
cd /app/frontend
yarn build
# Puis redéployer sur votre plateforme
```

### Option B : Configuration via Platform (Emergent)

Si votre frontend est sur Emergent :
1. Aller dans les **Environment Variables**
2. Ajouter/Modifier :
   ```
   REACT_APP_BACKEND_URL=https://optixroyal-api.onrender.com
   ```
3. Redéployer le frontend

## Étape 4.2 : Tester l'Intégration Complète

1. **Ouvrir le frontend déployé**
   https://royal-trading-hub.preview.emergentagent.com/

2. **Créer un compte**
   - Clic "Compte Elite"
   - Remplir le formulaire
   - Soumettre

3. **Vérifier la connexion**
   - Vous devriez être connecté
   - Solde démo : $10,000.00
   - Profil visible dans le header

✅ **SUCCÈS** : Frontend + Backend connectés !

---

# PARTIE 5 : CONFIGURATION AVANCÉE (OPTIONNEL)

## 5.1 : Custom Domain (Optionnel)

### Sur Render :
1. **Settings** → **Custom Domain**
2. Ajouter : `api.optixroyal.com`
3. Configurer DNS :
   - Type: CNAME
   - Name: api
   - Value: optixroyal-api.onrender.com
4. Render génère automatiquement SSL (HTTPS)

## 5.2 : Monitoring et Logs

### Render Dashboard
- **Metrics** : CPU, Mémoire, Requêtes
- **Logs** : Logs en temps réel
- **Events** : Historique des déploiements

### Configuration Alerts (Email)
1. **Settings** → **Notifications**
2. Activer : Deployment failures, Service crashes

## 5.3 : Scaling (Payant)

**Plan Free** : 512 MB RAM, sleep après 15 min d'inactivité

**Pour éviter le sleep** (7$/mois) :
1. **Settings** → **Instance Type**
2. Choisir **Starter** ($7/mois)
3. Avantages :
   - Pas de sleep
   - Plus de RAM
   - Meilleure performance

---

# 🎯 CHECKLIST FINALE

## Backend ✅
- [ ] Code pushé sur GitHub
- [ ] Database PostgreSQL créée
- [ ] Schema SQL exécuté
- [ ] Web Service Render créé
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi (status: Live)
- [ ] `/api/health` retourne 200 OK
- [ ] Test inscription réussit

## Frontend ✅
- [ ] REACT_APP_BACKEND_URL mis à jour
- [ ] Frontend rebuild et redéployé
- [ ] Connexion au backend fonctionne
- [ ] Inscription frontend → backend → success
- [ ] Login fonctionne
- [ ] Dashboard affiche les données

## Production Ready 🚀
- [ ] HTTPS activé (automatique avec Render)
- [ ] CORS configuré correctement
- [ ] Secrets JWT forts et uniques
- [ ] Database backups activés (Render Pro)
- [ ] Monitoring configuré

---

# 🆘 TROUBLESHOOTING

## Problème 1 : "Application failed to respond"
**Solution** :
- Vérifier les logs : Onglet Logs
- Vérifier `Start Command`: doit être `node src/server.js`
- Vérifier `PORT` dans les env vars

## Problème 2 : "Database connection failed"
**Solution** :
- Vérifier `DATABASE_URL` est correct
- Tester la connexion avec `psql`
- Vérifier que le schema est créé

## Problème 3 : "CORS error" depuis le frontend
**Solution** :
- Vérifier `FRONTEND_URL` dans les env vars
- Doit correspondre EXACTEMENT à l'URL du frontend
- Pas de slash `/` à la fin

## Problème 4 : "Build failed"
**Solution** :
- Vérifier `package.json` est présent
- Vérifier `Build Command`: `yarn install`
- Vérifier les logs pour l'erreur exacte

---

# 📞 SUPPORT

**Render Documentation** : https://render.com/docs
**Render Community** : https://community.render.com
**Render Status** : https://status.render.com

---

**🎉 FÉLICITATIONS !** Votre backend Optix Royal est maintenant déployé et accessible publiquement !
