# 🎓 Corrige Tes Cours

Une plateforme éducative intelligente alimentée par l'IA pour les étudiants universitaires francophones.

## ✨ Fonctionnalités

### 📚 Gestion de cours
- Créez et organisez vos notes de cours
- Éditez et enrichissez votre contenu
- Organisez par matière

### 🤖 Résumés intelligents avec DeepSeek R1
- Génération automatique de résumés structurés
- Utilise le modèle DeepSeek R1 (671B paramètres)
- Sortie en Markdown avec mise en forme claire
- Identification des concepts clés
- Organisation logique de l'information

### 🧠 Quiz intelligents
- **3 types de quiz** : QCM uniquement, Questions ouvertes, ou Mixte
- Génération automatique basée sur le contenu de vos cours
- Navigation intuitive entre les questions
- Évaluation automatique :
  - QCM : vérification instantanée
  - Questions ouvertes : évaluation IA avec feedback détaillé

### 📊 Tableau de bord Performance
- Statistiques complètes :
  - Quiz complétés
  - Score moyen
  - Meilleur score
  - Cours actifs
- Graphiques interactifs (Recharts) :
  - Distribution des scores
  - Évolution récente
  - Performance par cours
- Historique détaillé des quiz

## 🛠️ Stack technique

### Frontend
- **React 18** + TypeScript
- **Vite** - Build tool ultra-rapide
- **Wouter** - Routing léger
- **TanStack Query** - Gestion d'état serveur
- **Shadcn/ui** + Radix UI - Composants accessibles
- **Tailwind CSS** - Styling moderne
- **Recharts** - Graphiques interactifs

### Backend
- **Express.js** + TypeScript
- **PostgreSQL** (Neon) - Base de données
- **Drizzle ORM** - Type-safe queries
- **Replit Auth** - Authentification (Google OAuth)

### IA
- **OpenRouter API** - Gateway vers les modèles IA
- **DeepSeek R1** - Modèle de raisonnement (671B paramètres, MIT)
  - Génération de résumés
  - Création de quiz
  - Évaluation des réponses ouvertes

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- PostgreSQL database
- Clé API OpenRouter

### Installation

1. Clonez le repository
```bash
git clone <votre-repo>
cd corrige-tes-cours
```

2. Installez les dépendances
```bash
npm install
```

3. Configurez les variables d'environnement
```bash
# .env
DATABASE_URL=postgresql://...
OPENROUTER_API_KEY=your_key_here
SESSION_SECRET=your_secret_here
```

4. Initialisez la base de données
```bash
npm run db:push
```

5. Lancez l'application
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5000`

## 📱 Utilisation

### 1. Créer un cours
1. Connectez-vous avec votre compte Google
2. Cliquez sur "Cours" dans la sidebar
3. Cliquez sur "Créer un cours"
4. Remplissez le titre, le contenu et la matière
5. Cliquez sur "Créer"

### 2. Générer un résumé IA
1. Sur votre cours, cliquez sur "Générer un résumé IA"
2. Attendez quelques secondes
3. Consultez votre résumé structuré en Markdown

### 3. Créer un quiz intelligent
1. Cliquez sur "Quiz" dans la sidebar
2. Sélectionnez un cours
3. Choisissez le type de quiz (QCM, Ouvert, ou Mixte)
4. Cliquez sur "Générer le quiz"
5. Répondez aux questions
6. Consultez vos résultats avec explications détaillées

### 4. Suivre vos performances
1. Cliquez sur "Performances" dans la sidebar
2. Visualisez vos statistiques
3. Analysez vos graphiques de progression
4. Consultez l'historique de vos quiz

## 🔒 Sécurité

- **Authentification** : OAuth2 via Replit Auth (Google)
- **Sessions** : Stockées en PostgreSQL avec cookies HTTP-only
- **API Routes** : Protégées par middleware `isAuthenticated`
- **Ownership** : Validation stricte des ressources par utilisateur
- **Validation** : Tous les inputs validés avec Zod schemas

## 📊 Modèle de données

```
users (Replit Auth)
  ├── courses
  │     ├── summaries (AI-generated)
  │     └── quizzes
  │           └── quiz_results
  └── sessions
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des fonctionnalités
- Soumettre des pull requests

## 📝 Licence

MIT License - voir le fichier LICENSE pour plus de détails

## 🙏 Remerciements

- **DeepSeek** pour le modèle R1
- **OpenRouter** pour l'accès API simplifié
- **Replit** pour l'infrastructure et l'authentification
- La communauté open-source pour tous les outils utilisés

---

Créé avec ❤️ pour les étudiants universitaires francophones
