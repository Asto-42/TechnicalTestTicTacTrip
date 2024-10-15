# Test Technique Tictactrip - API de Justification de Texte

Ce projet est une API Node.js développée en TypeScript, qui permet de justifier du texte via un endpoint `/api/justify`. Elle utilise une authentification par token et limite chaque utilisateur à 80 000 mots par jour.

## Fonctionnalités

- **Endpoint `/api/justify`** : Justifie le texte fourni via une requête POST avec un Content-Type de type `text/plain`.
- **Endpoint `/api/token`** : Génère un token unique pour chaque utilisateur en fonction de son adresse e-mail.
- **Rate limit** : Chaque token est limité à 80 000 mots par jour. Si la limite est dépassée, une erreur 402 est renvoyée.
- **Tests** : L'API est couverte par des tests unitaires.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- Node.js v16+ et npm
- Git

## Installation

### Cloner le projet depuis GitHub :

```bash
git clone https://github.com/Asto-42/TechnicalTestTicTacTrip
```

### Accédez au répertoire du projet :

```bash
cd test-technique-tictactrip
```

### Installez les dépendances :

```bash
npm install
```

## Exécution de l'API en local

Pour démarrer l'API en local, exécutez la commande suivante :

```bash
npm run dev
```

L'API sera accessible à l'adresse suivante :

```
http://localhost:3000
```

## Endpoints de l'API

### 1. Génération d'un token

- **Méthode** : POST
- **URL** : `/api/token`
- **Body** : `{ "email": "foo@bar.com" }`
- **Réponse** : `{ "token": "<token>" }`

Exemple :

```bash
curl -X POST http://localhost:3000/api/token \
-H "Content-Type: application/json" \
-d '{"email": "foo@bar.com"}'
```

### 2. Justification de texte

- **Méthode** : POST
- **URL** : `/api/justify`
- **Headers** : `Authorization: Bearer <token>` et `Content-Type: text/plain`
- **Body** : texte à justifier (texte brut)
- **Réponse** : texte justifié

Exemple :

```bash
curl -X POST http://localhost:3000/api/justify \
-H "Authorization: Bearer <votre-token>" \
-H "Content-Type: text/plain" \
-d "Votre texte à justifier ici."
```

### 3. Limite de mots (Rate limit)

Chaque token est limité à 80 000 mots par jour. Si la limite est dépassée, une erreur `402 Payment Required` est renvoyée.

## Tests

Pour exécuter les tests unitaires, utilisez la commande suivante :

```bash
npm run test
```

Les tests couvrent les fonctionnalités suivantes :
- Génération de tokens
- Justification de texte
- Gestion des erreurs (texte manquant, token manquant, etc.)
- Limitation de 80 000 mots par jour

## Déploiement

L'API est déployée sur [Vercel](https://vercel.com/). Si vous souhaitez déployer votre propre version :

1. Installez Vercel CLI :

   ```bash
   npm install -g vercel
   ```

2. Déployez l'application :

   ```bash
   vercel
   ```

3. Suivez les instructions dans le terminal pour terminer le déploiement.