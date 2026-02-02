# 🚀 Configuration Stripe CLI pour les Webhooks en Local

## Pourquoi Stripe CLI ?

En développement local, Stripe ne peut pas appeler directement votre serveur (localhost) pour envoyer les webhooks. Stripe CLI résout ce problème en :
1. Créant un tunnel entre Stripe et votre serveur local
2. Redirigeant les événements webhook vers localhost
3. Permettant de tester les emails de confirmation en local

## Installation

### Sur macOS (avec Homebrew)

```bash
# Installer Homebrew si pas déjà installé
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Stripe CLI
brew install stripe/stripe-cli/stripe
```

### Alternative : Téléchargement direct

Si vous ne voulez pas installer Homebrew :

1. Téléchargez Stripe CLI depuis : https://github.com/stripe/stripe-cli/releases/latest
2. Téléchargez `stripe_X.X.X_mac-os_arm64.tar.gz` (pour Mac M1/M2/M3) ou `stripe_X.X.X_mac-os_x86_64.tar.gz` (pour Mac Intel)
3. Décompressez le fichier
4. Déplacez le binaire : `sudo mv stripe /usr/local/bin/`

### Vérifier l'installation

```bash
stripe --version
```

## Configuration

### 1. Se connecter à votre compte Stripe

```bash
stripe login
```

Cette commande va :
- Ouvrir votre navigateur
- Vous demander d'autoriser Stripe CLI
- Sauvegarder vos credentials automatiquement

### 2. Obtenir votre webhook secret pour le développement

Une fois connecté, lancez le tunnel webhook :

```bash
stripe listen --forward-to localhost:3001/api/payment/webhook
```

Cette commande va afficher quelque chose comme :

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxx (^C to quit)
```

**Copiez ce secret !** Vous en aurez besoin pour le fichier `.env`

### 3. Mettre à jour votre fichier .env

Ouvrez `backend/.env` et remplacez :

```env
# Remplacez cette ligne
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret

# Par le secret affiché par stripe listen (commence par whsec_)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

### 4. Redémarrer votre serveur backend

```bash
cd backend
npm run dev
```

## Utilisation quotidienne

### Pour tester les webhooks en local :

**Terminal 1** - Lancer le serveur backend :
```bash
cd backend
npm run dev
```

**Terminal 2** - Lancer Stripe CLI pour écouter les webhooks :
```bash
stripe listen --forward-to localhost:3001/api/payment/webhook
```

**Terminal 3** (optionnel) - Voir les logs Stripe :
```bash
stripe logs tail
```

### Maintenant, quand vous passez une commande :

1. ✅ Le client remplit le formulaire
2. ✅ Redirection vers Stripe Checkout
3. ✅ Paiement avec carte test : `4242 4242 4242 4242`
4. ✅ Stripe envoie le webhook à votre localhost via le tunnel
5. ✅ **Les emails sont envoyés automatiquement !**

## Cartes de test Stripe

Utilisez ces cartes de test pour simuler des paiements :

### Paiement réussi
```
Numéro : 4242 4242 4242 4242
Date : n'importe quelle date future (ex: 12/25)
CVC : n'importe quel 3 chiffres (ex: 123)
```

### Paiement refusé
```
Numéro : 4000 0000 0000 0002
Date : n'importe quelle date future
CVC : n'importe quel 3 chiffres
```

### Nécessite authentification 3D Secure
```
Numéro : 4000 0025 0000 3155
Date : n'importe quelle date future
CVC : n'importe quel 3 chiffres
```

## Commandes utiles Stripe CLI

### Écouter tous les événements
```bash
stripe listen --forward-to localhost:3001/api/payment/webhook
```

### Écouter seulement checkout.session.completed
```bash
stripe listen --events checkout.session.completed --forward-to localhost:3001/api/payment/webhook
```

### Déclencher manuellement un événement de test
```bash
stripe trigger checkout.session.completed
```

### Voir les logs des webhooks
```bash
stripe logs tail
```

### Voir l'historique des événements
```bash
stripe events list
```

## Tester le flux complet

### 1. Vérifier que tout fonctionne

Dans 3 terminaux différents :

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Stripe CLI :**
```bash
stripe listen --forward-to localhost:3001/api/payment/webhook
```

**Terminal 3 - Frontend :**
```bash
cd frontend
npm run dev
```

### 2. Passer une commande test

1. Allez sur http://localhost:5173
2. Ajoutez des produits au panier
3. Allez au checkout
4. Remplissez le formulaire avec vos vraies données (l'email doit être le vôtre)
5. Cliquez sur "Procéder au paiement"
6. Sur la page Stripe, utilisez la carte test : `4242 4242 4242 4242`
7. Validez le paiement

### 3. Vérifier les résultats

**Dans le terminal Stripe CLI, vous devriez voir :**
```
2025-01-10 10:30:45   --> checkout.session.completed [evt_xxxxx]
2025-01-10 10:30:45  <--  [200] POST http://localhost:3001/api/payment/webhook
```

**Dans le terminal backend, vous devriez voir :**
```
✅ Emails envoyés pour commande CMD-1234567890
```

**Dans votre boîte email :**
- ✅ Email de confirmation de commande
- ✅ Email de notification admin (si configuré)

## Résolution de problèmes

### ❌ "Connection refused" dans Stripe CLI

**Cause :** Le serveur backend n'est pas démarré

**Solution :** Lancez `npm run dev` dans le dossier backend

### ❌ "Webhook signature verification failed"

**Cause :** Le STRIPE_WEBHOOK_SECRET dans .env ne correspond pas au secret de Stripe CLI

**Solution :**
1. Relancez `stripe listen --forward-to localhost:3001/api/payment/webhook`
2. Copiez le nouveau secret affiché (whsec_xxx)
3. Mettez à jour `STRIPE_WEBHOOK_SECRET` dans `.env`
4. Redémarrez le serveur backend

### ❌ Les emails ne sont pas envoyés

**Vérifications :**
1. Le webhook a bien été reçu (visible dans les logs Stripe CLI)
2. Les credentials email sont corrects dans `.env`
3. Le serveur backend affiche `✅ Emails envoyés pour commande...`
4. Vérifiez vos spams

### ❌ "You have not configured your API key"

**Solution :**
```bash
stripe login
```

## Production

En production, vous n'aurez PAS besoin de Stripe CLI :

1. Configurez un vrai webhook dans le dashboard Stripe : https://dashboard.stripe.com/webhooks
2. Pointez vers votre URL de production : `https://votredomaine.com/api/payment/webhook`
3. Copiez le secret webhook fourni par Stripe
4. Ajoutez-le dans vos variables d'environnement de production

## Documentation officielle

- Stripe CLI : https://stripe.com/docs/stripe-cli
- Webhooks : https://stripe.com/docs/webhooks
- Testing : https://stripe.com/docs/testing

---

✅ Une fois configuré, Stripe CLI tournera en arrière-plan et transmettra tous les webhooks à votre serveur local !
