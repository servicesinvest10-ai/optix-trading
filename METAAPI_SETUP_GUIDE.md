# 🔧 Configuration MetaApi MT5 - Guide d'Installation

## Prérequis
- Un compte MetaApi (gratuit) : https://metaapi.cloud
- Un compte MT5 Démo chez IC Markets

---

## Étape 1 : Créer un compte MetaApi

1. Rendez-vous sur https://metaapi.cloud
2. Cliquez sur "Sign Up" et créez votre compte
3. Confirmez votre email
4. Connectez-vous à votre tableau de bord

---

## Étape 2 : Obtenir votre Token MetaApi

1. Connectez-vous à https://app.metaapi.cloud
2. Allez dans **Settings** → **API Access Tokens**
3. Créez un nouveau token ou copiez le token existant
4. **Important** : Gardez ce token secret !

---

## Étape 3 : Créer un compte MT5 Démo IC Markets

1. Rendez-vous sur https://www.icmarkets.com
2. Créez un compte démo MT5
3. Notez vos identifiants :
   - **Login** : Numéro de compte (ex: 12345678)
   - **Password** : Mot de passe du compte
   - **Server** : ICMarketsSC-Demo

---

## Étape 4 : Ajouter votre compte MT5 à MetaApi

1. Dans le dashboard MetaApi, cliquez sur **"+ Add Account"**
2. Sélectionnez **"Connect existing account"**
3. Remplissez les informations :
   - **Account Type** : MetaTrader 5
   - **Broker** : IC Markets
   - **Server** : ICMarketsSC-Demo
   - **Login** : Votre numéro de compte
   - **Password** : Votre mot de passe
   - **Name** : "Optix Royal Demo"
4. Cliquez sur **"Add Account"**
5. Attendez que le statut passe à **"DEPLOYED"**
6. Copiez l'**Account ID** (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

---

## Étape 5 : Configurer Optix Royal

Modifiez le fichier `/app/backend/.env` :

```env
# MetaApi MT5 Configuration
METAAPI_TOKEN=votre_token_metaapi_ici
METAAPI_ACCOUNT_ID=votre_account_id_ici
```

Exemple :
```env
METAAPI_TOKEN=eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9...
METAAPI_ACCOUNT_ID=royal-trading-hub
```

---

## Étape 6 : Redémarrer l'application

```bash
# En local
cd /app/backend
sudo supervisorctl restart backend

# Vérifier les logs
tail -f /var/log/supervisor/backend.err.log
```

---

## Vérification

1. Connectez-vous à Optix Royal avec un compte utilisateur
2. Allez dans l'onglet **"MT5 Trading"**
3. La bannière devrait indiquer **"Connecté à MT5 (IC Markets Demo)"**
4. Vos positions MT5 réelles devraient s'afficher

---

## API Endpoints MT5

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/mt5/status` | GET | Statut de connexion |
| `/api/mt5/connect` | POST | Connecter à MT5 |
| `/api/mt5/disconnect` | POST | Déconnecter |
| `/api/mt5/account` | GET | Info du compte |
| `/api/mt5/positions` | GET | Positions ouvertes |
| `/api/mt5/orders` | GET | Ordres en attente |
| `/api/mt5/symbols` | GET | Symboles disponibles |
| `/api/mt5/price/{symbol}` | GET | Prix actuel |
| `/api/mt5/trade` | POST | Exécuter un trade |
| `/api/mt5/close/{id}` | POST | Fermer une position |
| `/api/mt5/modify/{id}` | PUT | Modifier SL/TP |
| `/api/mt5/history` | GET | Historique des trades |

---

## Mode Simulation

Sans credentials MetaApi configurés, l'application fonctionne en **Mode Simulation** :
- Prix simulés mais réalistes
- Trades virtuels stockés en base de données
- Parfait pour les tests et démonstrations

---

## Dépannage

### Erreur "Account not deployed"
- Attendez quelques minutes après l'ajout du compte
- Vérifiez l'état dans le dashboard MetaApi

### Erreur "Invalid credentials"
- Vérifiez votre token MetaApi
- Vérifiez l'account ID

### Erreur "Connection timeout"
- Vérifiez votre connexion internet
- Le serveur MT5 peut être temporairement indisponible

---

## Support

- Documentation MetaApi : https://metaapi.cloud/docs/client/
- Support IC Markets : https://www.icmarkets.com/support
