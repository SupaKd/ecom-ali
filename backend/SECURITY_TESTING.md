# 🧪 Tests de Sécurité

## Comment Tester les Mesures de Sécurité

### 1. Tester le Rate Limiting sur le Login

```bash
# Test: Faire plus de 5 tentatives de connexion en 15 minutes
# Devrait bloquer après la 5ème tentative

for i in {1..7}; do
  echo "Tentative $i:"
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n\n"
  sleep 1
done

# Résultat attendu:
# - Tentatives 1-5: 401 Unauthorized
# - Tentatives 6-7: 429 Too Many Requests
```

### 2. Tester la Protection XSS

```bash
# Test: Envoyer un payload XSS dans le login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<script>alert(1)</script>@test.com","password":"test"}' \
  -v

# Résultat attendu:
# - Le script devrait être sanitizé
# - Log "Tentative suspecte" devrait apparaître dans la console du serveur
```

### 3. Tester la Validation des Emails

```bash
# Test 1: Email invalide
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email","password":"test123"}' \
  | json_pp

# Résultat attendu: {"error": "Format d'email invalide"}

# Test 2: Email trop long (> 255 caractères)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$(printf 'a%.0s' {1..260})@test.com\",\"password\":\"test\"}" \
  | json_pp

# Résultat attendu: {"error": "Email trop long"}
```

### 4. Tester la Validation des Mots de Passe

```bash
# Test 1: Mot de passe trop court
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123"}' \
  | json_pp

# Résultat attendu: {"error": "Mot de passe invalide"}

# Test 2: Mot de passe trop long (> 100 caractères)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"$(printf 'a%.0s' {1..110})\"}" \
  | json_pp

# Résultat attendu: {"error": "Mot de passe invalide"}
```

### 5. Tester les Headers de Sécurité (Helmet)

```bash
# Vérifier les headers de sécurité
curl -I http://localhost:3001/api/health

# Headers attendus:
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: DENY
# - Strict-Transport-Security (si HTTPS)
# - Content-Security-Policy
```

### 6. Tester la Protection Upload

```bash
# Test 1: Upload d'un fichier non autorisé
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Test Product" \
  -F "image=@malicious.php"

# Résultat attendu: Erreur "Seules les images (JPEG, PNG, WEBP) sont autorisées"

# Test 2: Upload d'un fichier trop gros (> 5MB)
dd if=/dev/zero of=big.jpg bs=1M count=6
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Test Product" \
  -F "image=@big.jpg"

# Résultat attendu: Erreur "File too large"
```

### 7. Tester la Sanitization SQL Injection

```bash
# Test: Tentative d'injection SQL
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com'\'' OR '\''1'\''='\''1","password":"test"}' \
  -v

# Résultat attendu:
# - Log "Tentative suspecte" dans la console
# - Requête bloquée ou email mal formé
```

### 8. Tester le Rate Limiting Global

```bash
# Test: Faire plus de 100 requêtes en 15 minutes
for i in {1..105}; do
  curl -s http://localhost:3001/api/health > /dev/null
  echo "Requête $i"
done

# Résultat attendu: Blocage après 100 requêtes
```

### 9. Tester la Gestion des Erreurs

```bash
# En développement (NODE_ENV=development)
curl http://localhost:3001/api/nonexistent

# Résultat attendu: Erreur avec stack trace

# En production (NODE_ENV=production)
NODE_ENV=production npm start
curl http://localhost:3001/api/nonexistent

# Résultat attendu: Erreur générique sans stack trace
```

### 10. Tester CORS

```bash
# Test: Requête depuis une origin non autorisée
curl http://localhost:3001/api/health \
  -H "Origin: http://malicious-site.com" \
  -v

# Résultat attendu: Pas de header Access-Control-Allow-Origin

# Test: Requête depuis l'origin autorisée
curl http://localhost:3001/api/health \
  -H "Origin: http://localhost:5173" \
  -v

# Résultat attendu: Header Access-Control-Allow-Origin présent
```

## Tests Automatisés avec Jest

Créer un fichier `__tests__/security.test.js`:

```javascript
describe('Security Tests', () => {
  test('Rate limiting should block after 5 login attempts', async () => {
    // Faire 6 tentatives de login
    // Vérifier que la 6ème est bloquée
  });

  test('XSS payloads should be sanitized', async () => {
    // Envoyer un payload XSS
    // Vérifier qu'il est nettoyé
  });

  test('Invalid email format should be rejected', async () => {
    // Envoyer un email invalide
    // Vérifier le code d'erreur 400
  });
});
```

## Vérification Continue

### Audit des Dépendances

```bash
# Vérifier les vulnérabilités connues
npm audit

# Corriger automatiquement (attention aux breaking changes)
npm audit fix

# Afficher le rapport détaillé
npm audit --json
```

### Mise à Jour des Dépendances

```bash
# Vérifier les packages obsolètes
npm outdated

# Mettre à jour les packages mineurs/patch
npm update

# Pour les mises à jour majeures, vérifier manuellement
```

## Outils Recommandés

1. **OWASP ZAP** - Scanner de vulnérabilités
2. **Burp Suite** - Tests de pénétration
3. **npm audit** - Audit des dépendances
4. **Snyk** - Surveillance continue des vulnérabilités
5. **ESLint Security Plugin** - Analyse statique du code

## Logs de Sécurité à Surveiller

Surveiller ces patterns dans les logs:
- 🚨 "Tentative suspecte détectée"
- 🔴 "Erreur capturée" (erreurs 500)
- Multiples 401/403 depuis la même IP
- Requêtes inhabituelles (paths étranges, payloads suspects)

## Checklist de Tests

- [ ] Rate limiting testé et fonctionnel
- [ ] Validation des entrées testée
- [ ] Sanitization XSS testée
- [ ] Upload sécurisé testé
- [ ] Headers de sécurité vérifiés
- [ ] CORS testé
- [ ] Gestion d'erreurs testée
- [ ] Détection d'activités suspectes testée
- [ ] npm audit exécuté sans vulnérabilités critiques
- [ ] Tests en environnement de production simulé
