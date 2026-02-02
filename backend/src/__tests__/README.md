# Tests Backend - E-commerce API

Ce dossier contient tous les tests pour l'API backend du projet e-commerce.

## Structure des Tests

```
__tests__/
├── services/          # Tests unitaires des services
│   ├── authService.test.js
│   ├── productService.test.js
│   └── orderService.test.js
├── integration/       # Tests d'intégration des routes API
│   ├── health.test.js
│   ├── products.test.js
│   └── orders.test.js
└── helpers/          # Utilitaires et données de test
    ├── mockData.js
    └── testUtils.js
```

## Installation

Les dépendances de test sont déjà installées. Si nécessaire :

```bash
npm install --save-dev jest @jest/globals supertest
```

## Commandes de Test

### Exécuter tous les tests
```bash
npm test
```

### Exécuter les tests en mode watch (développement)
```bash
npm run test:watch
```

### Générer le rapport de couverture
```bash
npm run test:coverage
```

### Exécuter un fichier de test spécifique
```bash
npm test -- authService.test.js
```

### Exécuter les tests par catégorie
```bash
# Tests unitaires uniquement
npm test -- services/

# Tests d'intégration uniquement
npm test -- integration/
```

## Types de Tests

### Tests Unitaires (Services)
- Testent la logique métier isolément
- Utilisent des mocks pour les dépendances
- Rapides et indépendants

### Tests d'Intégration (Routes)
- Testent les endpoints API
- Vérifient les réponses HTTP
- Simulent les requêtes client

## Écrire de Nouveaux Tests

### Exemple de test unitaire

```javascript
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as myService from '../../services/myService.js';
import * as myRepo from '../../repositories/myRepository.js';

jest.mock('../../repositories/myRepository.js');

describe('MyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait faire quelque chose', async () => {
    myRepo.someMethod.mockResolvedValue({ id: 1 });

    const result = await myService.doSomething();

    expect(myRepo.someMethod).toHaveBeenCalled();
    expect(result).toEqual({ id: 1 });
  });
});
```

### Exemple de test d'intégration

```javascript
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';

describe('GET /api/endpoint', () => {
  it('devrait retourner 200', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);

    expect(response.body).toHaveProperty('data');
  });
});
```

## Bonnes Pratiques

1. **Nommer clairement les tests** : Utilisez des descriptions explicites
2. **Un test = une assertion principale** : Gardez les tests focalisés
3. **Nettoyer après chaque test** : Utilisez `beforeEach` et `afterEach`
4. **Mocker les dépendances externes** : Base de données, API externes, etc.
5. **Tester les cas d'erreur** : Pas seulement les chemins heureux

## Couverture de Code

L'objectif est d'atteindre au minimum :
- 80% de couverture des lignes
- 80% de couverture des branches
- 80% de couverture des fonctions

Les fichiers suivants sont exclus de la couverture :
- `src/server.js` (point d'entrée)
- `src/config/**` (configuration)
- `src/middleware/**` (middleware Express)

## Résolution des Problèmes

### Les tests échouent avec des erreurs de modules
Assurez-vous que votre `package.json` contient `"type": "module"`.

### Les mocks ne fonctionnent pas
Vérifiez que vous utilisez `jest.mock()` avant les imports.

### Timeout des tests
Augmentez le timeout dans `jest.config.js` si nécessaire :
```javascript
testTimeout: 10000 // 10 secondes
```

## Ressources

- [Documentation Jest](https://jestjs.io/)
- [Documentation Supertest](https://github.com/visionmedia/supertest)
- [Bonnes pratiques de testing](https://github.com/goldbergyoni/javascript-testing-best-practices)
