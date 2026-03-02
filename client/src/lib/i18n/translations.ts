// Translations for French and English
// Note: "Corrige Tes Cours" is the brand name and should NOT be translated

export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    // Common
    loading: "Chargement...",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    create: "Créer",
    search: "Rechercher",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    submit: "Soumettre",
    close: "Fermer",
    yes: "Oui",
    no: "Non",
    or: "ou",
    and: "et",
    
    // User-friendly error messages
    errors: {
      generic: "Oups ! Quelque chose n'a pas fonctionné. Réessaie dans un instant.",
      network: "Problème de connexion. Vérifie ta connexion internet.",
      notFound: "Cette ressource n'existe plus ou a été déplacée.",
      forbidden: "Tu n'as pas accès à cette ressource.",
      unauthorized: "Connecte-toi pour accéder à cette fonctionnalité.",
      validation: "Certaines informations sont incorrectes. Vérifie et réessaie.",
      fileTooLarge: "Ce fichier est trop volumineux. Essaie avec un fichier plus petit.",
      invalidFileType: "Ce type de fichier n'est pas accepté.",
      uploadFailed: "L'envoi du fichier a échoué. Réessaie.",
      uploadLimitReached: "Tu as atteint ta limite d'envois ce mois-ci. Passe au Premium pour continuer !",
      aiUnavailable: "Notre IA est momentanément occupée. Réessaie dans quelques secondes.",
      quizGenerationFailed: "La génération du quiz a rencontré un problème. Réessaie.",
      summaryGenerationFailed: "La génération du résumé a rencontré un problème. Réessaie.",
      chatLimitReached: "Tu as utilisé tous tes messages gratuits. Reviens plus tard ou passe au Premium !",
      paymentFailed: "Le paiement n'a pas abouti. Vérifie tes informations et réessaie.",
      sessionExpired: "Ta session a expiré. Reconnecte-toi pour continuer.",
      tryAgain: "Réessayer",
      contactSupport: "Si le problème persiste, contacte notre support.",
    },
    
    // Navigation
    nav: {
      home: "Accueil",
      courses: "Mes Cours",
      chat: "Tariq IA",
      stats: "Statistiques",
      profile: "Profil",
      subscription: "Abonnement",
      account: "Mon Compte",
      logout: "Déconnexion",
      features: "Fonctionnalités",
      pricing: "Tarifs",
      about: "À propos",
      login: "Connexion",
      signup: "Inscription",
    },
    
    // Landing Page
    landing: {
      heroTitle: "Révise plus intelligemment, pas plus longtemps",
      heroSubtitle: "L'IA qui transforme tes cours en résumés clairs et quiz personnalisés. Pour tous les étudiants.",
      cta: "Commencer gratuitement",
      tryDemo: "Essayer sans inscription",
      trustedBy: "Utilisé par des étudiants de",
      features: {
        title: "Tout ce dont tu as besoin pour réussir",
        subtitle: "Des outils puissants pour optimiser ton apprentissage",
        summary: {
          title: "Résumés intelligents",
          description: "L'IA analyse tes cours et génère des résumés clairs et structurés",
        },
        quiz: {
          title: "Quiz personnalisés",
          description: "Teste tes connaissances avec des quiz générés automatiquement",
        },
        chat: {
          title: "Tariq IA",
          description: "Pose tes questions à notre assistant IA disponible 24/7",
        },
        upload: {
          title: "Upload de fichiers",
          description: "Importe tes PDF et documents Word facilement",
        },
      },
      howItWorks: {
        title: "Comment ça marche ?",
        step1: {
          title: "Ajoute tes cours",
          description: "Saisis tes notes ou uploade tes fichiers PDF/Word",
        },
        step2: {
          title: "L'IA travaille pour toi",
          description: "Notre IA génère des résumés et quiz personnalisés",
        },
        step3: {
          title: "Révise efficacement",
          description: "Utilise les résumés et quiz pour maîtriser tes cours",
        },
      },
      pricing: {
        title: "Des fonctionnalités pour chaque étudiant",
        free: {
          title: "Gratuit",
          price: "",
          features: [
            "Saisie de cours illimitée",
            "Résumés IA illimités",
            "Quiz personnalisés illimités",
            "2 uploads de fichiers/mois",
            "5 messages Tariq IA/session",
          ],
        },
        premium: {
          title: "Premium",
          price: "",
          period: "",
          features: [
            "Tout du plan Gratuit",
            "Uploads de fichiers illimités",
            "Tariq IA illimité",
            "Pas de cooldown",
            "Support prioritaire",
          ],
          cta: "Passer au Premium",
        },
      },
      cta2: {
        title: "Prêt à révolutionner tes révisions ?",
        subtitle: "Rejoins des milliers d'étudiants qui réussissent avec Corrige Tes Cours",
        button: "Commencer maintenant",
      },
    },
    
    // Auth
    auth: {
      login: {
        title: "Connexion",
        subtitle: "Content de te revoir !",
        email: "Email",
        password: "Mot de passe",
        submit: "Se connecter",
        noAccount: "Pas encore de compte ?",
        signupLink: "Inscris-toi",
        orContinueWith: "Ou continuer avec",
        google: "Continuer avec Google",
        forgotPassword: "Mot de passe oublié ?",
      },
      signup: {
        title: "Inscription",
        subtitle: "Crée ton compte gratuitement",
        firstName: "Prénom",
        lastName: "Nom",
        email: "Email",
        password: "Mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        submit: "S'inscrire",
        hasAccount: "Déjà un compte ?",
        loginLink: "Connecte-toi",
        orContinueWith: "Ou continuer avec",
        google: "S'inscrire avec Google",
      },
      errors: {
        invalidEmail: "Email invalide",
        passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
        passwordMismatch: "Les mots de passe ne correspondent pas",
        loginFailed: "Email ou mot de passe incorrect",
        signupFailed: "Erreur lors de l'inscription",
      },
    },
    
    // Dashboard
    dashboard: {
      welcome: "Bienvenue",
      welcomeBack: "Content de te revoir",
      welcomeSubtitle: "Prêt à booster ta réussite aujourd'hui ?",
      stats: {
        courses: "Cours",
        summaries: "Résumés",
        quizzes: "Quiz",
        averageScore: "Score moyen",
      },
      myCourses: "Mes Cours",
      myQuizzes: "Mes Quiz",
      averageScore: "Moyenne",
      coursesRegistered: "cours enregistrés",
      quizzesCompleted: "quiz complétés",
      scoreAverage: "de moyenne",
      recentCourses: "Cours récents",
      recentQuizzes: "Quiz récents",
      noCourses: "Aucun cours pour le moment",
      noQuizzes: "Aucun quiz pour le moment",
      addFirstCourse: "Ajouter ton premier cours",
      takeFirstQuiz: "Passez votre premier quiz",
      viewAll: "Voir tout",
      score: "Score",
      noData: "Pas encore de données",
      flashcardsToReview: "Flashcards à revoir",
      noFlashcardsToReview: "Aucune flashcard à revoir",
      startReview: "Commencer la révision",
      lastModified: "Dernière modification",
    },
    
    // Getting Started Section
    gettingStarted: {
      title: "Pour commencer",
      subtitle: "Découvre les fonctionnalités principales de Corrige Tes Cours",
      createCourse: "Créer un cours",
      createCourseDesc: "Commence par créer ton premier cours pour profiter des résumés IA et des quiz personnalisés.",
      generateQuiz: "Générer un quiz",
      generateQuizDesc: "Une fois ton cours créé, génère automatiquement un quiz adapté à ton niveau.",
      trackProgress: "Suivre tes progrès",
      trackProgressDesc: "Visualise ton évolution et reste motivé grâce aux statistiques détaillées.",
    },
    
    // Courses
    courses: {
      title: "Mes Cours",
      subtitle: "Gère et organise tes cours",
      addCourse: "Ajouter un cours",
      uploadFile: "Uploader un fichier",
      noCourses: "Aucun cours pour le moment",
      noCoursesSubtitle: "Commence par ajouter ton premier cours",
      searchPlaceholder: "Rechercher un cours...",
      form: {
        title: "Titre du cours",
        titlePlaceholder: "Ex: Introduction à la Microéconomie",
        subject: "Matière",
        subjectPlaceholder: "Ex: Économie",
        content: "Contenu du cours",
        contentPlaceholder: "Colle tes notes de cours ici...",
        save: "Enregistrer le cours",
        saving: "Enregistrement...",
      },
      upload: {
        title: "Uploader un fichier",
        dragDrop: "Glisse et dépose ton fichier ici",
        or: "ou",
        browse: "Parcourir",
        formats: "PDF, DOC, DOCX (max 10MB)",
        uploading: "Upload en cours...",
        processing: "Traitement du fichier...",
        limitReached: "Tu as atteint ta limite d'uploads ce mois",
        limitInfo: "uploads restants ce mois",
        premiumUnlimited: "Uploads illimités avec Premium",
      },
      actions: {
        viewSummary: "Voir le résumé",
        generateSummary: "Générer un résumé",
        createQuiz: "Créer un quiz",
        edit: "Modifier",
        delete: "Supprimer",
      },
      deleteConfirm: {
        title: "Supprimer ce cours ?",
        message: "Cette action est irréversible. Le cours et tous ses résumés/quiz seront supprimés.",
        cancel: "Annuler",
        confirm: "Supprimer",
      },
    },
    
    // Summaries
    summary: {
      title: "Résumé",
      generating: "Génération du résumé en cours...",
      generatingSubtitle: "L'IA analyse ton cours pour créer un résumé clair et structuré",
      downloadPdf: "Télécharger en PDF",
      regenerate: "Régénérer",
      noSummary: "Aucun résumé pour ce cours",
      generateNow: "Générer maintenant",
    },
    
    // Quizzes
    quizzes: {
      title: "Mes Quiz",
      subtitle: "Teste tes connaissances",
      noQuizzes: "Aucun quiz pour le moment",
      noQuizzesSubtitle: "Crée un quiz à partir d'un de tes cours",
      createQuiz: "Créer un quiz",
      selectCourse: "Sélectionne un cours",
      selectCourseSubtitle: "Choisis le cours sur lequel tu veux être interrogé",
      quizType: {
        title: "Type de quiz",
        mcq: "QCM (Choix multiples)",
        mcqDesc: "Questions à choix multiples avec 4 options",
        open: "Questions ouvertes",
        openDesc: "Questions nécessitant une réponse rédigée",
      },
      questionCount: "Nombre de questions",
      generate: "Générer le quiz",
      generating: "Génération en cours...",
      startQuiz: "Commencer le quiz",
      question: "Question",
      of: "sur",
      yourAnswer: "Ta réponse",
      answerPlaceholder: "Écris ta réponse ici...",
      submit: "Soumettre",
      next: "Question suivante",
      finish: "Terminer le quiz",
      results: {
        title: "Résultats",
        score: "Ton score",
        correct: "Bonnes réponses",
        incorrect: "Mauvaises réponses",
        retry: "Refaire le quiz",
        backToQuizzes: "Retour aux quiz",
      },
      feedback: {
        correct: "Bonne réponse !",
        incorrect: "Mauvaise réponse",
        correctAnswer: "La bonne réponse était",
        explanation: "Explication",
      },
    },
    
    // Chat (Tariq IA)
    chat: {
      title: "Tariq IA",
      subtitle: "Ton assistant IA pour réussir",
      placeholder: "Pose ta question à Tariq...",
      send: "Envoyer",
      typing: "Tariq écrit...",
      welcome: {
        title: "Salut ! Je suis Tariq, ton assistant IA",
        subtitle: "Pose-moi n'importe quelle question sur tes cours. Je suis là pour t'aider à réussir !",
      },
      suggestions: [
        "Explique-moi le concept de...",
        "Quelles sont les différences entre... et... ?",
        "Comment résoudre ce type de problème ?",
        "Peux-tu me donner un exemple de... ?",
      ],
      limit: {
        reached: "Tu as atteint ta limite de messages",
        remaining: "messages restants",
        cooldown: "Prochaine session dans",
        premium: "Passe au Premium pour un accès illimité",
      },
    },
    
    // Performance/Stats
    performance: {
      title: "Statistiques",
      subtitle: "Suis ta progression",
      overview: "Vue d'ensemble",
      quizHistory: "Historique des quiz",
      noData: "Pas encore de données",
      startLearning: "Commence à apprendre pour voir tes statistiques",
      avgScore: "Score moyen",
      totalQuizzes: "Quiz complétés",
      totalCourses: "Cours étudiés",
      streak: "Jours consécutifs",
      improvement: "Amélioration",
      lastWeek: "Cette semaine",
      lastMonth: "Ce mois",
    },
    
    // Account
    account: {
      title: "Mon Compte",
      subtitle: "Gère ton profil et tes préférences",
      profile: {
        title: "Informations personnelles",
        firstName: "Prénom",
        lastName: "Nom",
        email: "Email",
        phone: "Téléphone",
        phonePlaceholder: "+237 6XX XXX XXX",
        save: "Enregistrer les modifications",
        saving: "Enregistrement...",
        saved: "Modifications enregistrées",
      },
      preferences: {
        title: "Préférences",
        language: "Langue",
        languageDesc: "Choisis ta langue préférée pour l'interface et le contenu généré",
        french: "Français",
        english: "English",
        theme: "Thème",
        themeDesc: "Choisis entre le mode clair et sombre",
        light: "Clair",
        dark: "Sombre",
        system: "Système",
      },
      subscription: {
        title: "Abonnement",
        currentPlan: "Plan actuel",
        free: "Gratuit",
        premium: "Premium",
        expiresOn: "Expire le",
        manage: "Gérer l'abonnement",
      },
      danger: {
        title: "Zone dangereuse",
        deleteAccount: "Supprimer mon compte",
        deleteWarning: "Cette action est irréversible. Toutes tes données seront supprimées.",
      },
    },
    
    // Subscription
    subscription: {
      title: "Mon Abonnement",
      subtitle: "Gère ton abonnement et accède aux fonctionnalités Premium",
      currentPlan: "Plan actuel",
      free: "Gratuit",
      premium: "Premium",
      premiumFeatures: "Fonctionnalités Premium",
      unlockAll: "Débloquez tout le potentiel de Corrige Tes Cours",
      expiresOn: "Date d'expiration",
      price: "",
      currency: "",
      perMonth: "",
      subscribe: "Passer au Premium",
      subscribing: "Initialisation...",
      unlimited: "Illimité",
      upgradeToPremium: "Passer au Premium",
      unlockAllFeatures: "Débloque toutes les fonctionnalités",
      paymentMethods: "Moyens de paiement",
      paymentMethodsDesc: "Paiement sécurisé par carte bancaire",
      mtn: "",
      orange: "",
      card: "Carte bancaire",
      cameroon: "",
      visaMastercard: "Visa, Mastercard",
      securedBy: "Tes paiements sont sécurisés par",
      success: "Paiement réussi !",
      successDesc: "Ton abonnement Premium est maintenant actif",
      failed: "Paiement échoué",
      pending: "Paiement en attente",
      pendingDesc: "Ton paiement est en cours de traitement. Nous te confirmerons dès validation.",
      features: {
        everything: "Tout du plan Gratuit",
        unlimitedUploads: "Upload de fichiers illimité",
        unlimitedChat: "Tariq IA illimité (pas de limite)",
        noCooldown: "Pas de cooldown",
        advancedStats: "Statistiques avancées",
        prioritySupport: "Support prioritaire",
      },
      freeFeatures: {
        courses: "Jusqu'à 3 cours",
        summaries: "1 résumé IA par mois",
        pdfDownload: "Téléchargement PDF des résumés",
        quizzes: "1 quiz par mois",
        uploads: "Upload : 2 fichiers/mois (10MB max)",
        chat: "Tariq IA : 5 messages/session (3h cooldown)",
      },
    },
    
    // Footer
    footer: {
      tagline: "L'IA qui t'aide à réussir tes examens",
      description: "Votre plateforme d'apprentissage intelligente pour réussir vos études",
      followUs: "Suivez-nous",
      navigation: "Navigation",
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
      terms: "Conditions d'utilisation",
      contact: "Contact",
      legalSection: "Légal",
      copyright: "Tous droits réservés",
    },
    
    // Features Page
    featuresPage: {
      badge: "Fonctionnalités complètes",
      heroTitle: "Tout ce dont vous avez besoin pour exceller",
      heroSubtitle: "Découvrez comment Corrige Tes Cours transforme votre façon d'apprendre et de réviser avec des outils puissants mais simples",
      ctaTitle: "Prêt à transformer votre façon d'étudier ?",
      ctaSubtitle: "Rejoignez des milliers d'étudiants qui améliorent leurs résultats avec Corrige Tes Cours",
      ctaButton: "Créer un compte gratuit",
      features: {
        notes: {
          title: "Prise de notes intelligente",
          description: "Créez et organisez vos cours en un seul endroit avec un système de catégorisation simple et efficace.",
          details: ["Éditeur de texte intuitif", "Organisation par matières", "Recherche instantanée", "Stockage sécurisé"]
        },
        summaries: {
          title: "Résumés IA",
          description: "Générez automatiquement des résumés structurés avec les points clés de vos cours.",
          details: ["Résumés clairs et précis", "Points essentiels identifiés", "Format structuré", "Téléchargement PDF"]
        },
        upload: {
          title: "Upload de fichiers",
          description: "Importez vos cours en PDF ou Word et laissez l'IA extraire le contenu automatiquement.",
          details: ["Support PDF et Word", "Extraction automatique", "Jusqu'à 10MB par fichier", "2 fichiers/mois (gratuit)"]
        },
        quiz: {
          title: "Quiz personnalisés",
          description: "Des quiz adaptés à vos cours : QCM, questions ouvertes ou format mixte selon vos besoins.",
          details: ["QCM interactifs", "Questions ouvertes", "Format mixte", "Correction automatique"]
        },
        tariq: {
          title: "Tariq IA - Votre tuteur personnel",
          description: "Posez vos questions et obtenez des explications claires avec votre assistant IA intelligent.",
          details: ["Réponses instantanées", "Explications détaillées", "5 messages/session (gratuit)", "Illimité en Premium"]
        },
        evaluation: {
          title: "Évaluation automatique",
          description: "Recevez un feedback détaillé sur vos réponses pour progresser rapidement.",
          details: ["Correction intelligente", "Feedback personnalisé", "Suggestions d'amélioration", "Score détaillé"]
        },
        tracking: {
          title: "Suivi de performance",
          description: "Visualisez votre progression avec des statistiques et graphiques intuitifs.",
          details: ["Dashboard complet", "Graphiques de progression", "Analyse par matière", "Points à améliorer"]
        },
        advancedStats: {
          title: "Statistiques avancées",
          description: "Accédez à des analyses approfondies de vos performances (Premium).",
          details: ["Tendances d'apprentissage", "Comparaisons temporelles", "Rapports détaillés", "Insights personnalisés"]
        },
        revision: {
          title: "Révisions optimisées",
          description: "Concentrez vos révisions sur ce qui compte vraiment grâce à des suggestions personnalisées.",
          details: ["Révisions ciblées", "Priorisation intelligente", "Planning adapté", "Rappels utiles"]
        }
      }
    },
    
    // Pricing Page
    pricingPage: {
      badge: "Plans simples et transparents",
      heroTitle: "Choisissez le plan qui vous correspond",
      heroSubtitle: "Commencez gratuitement et passez au Premium quand vous êtes prêt. Aucun engagement, annulez quand vous voulez.",
      mostPopular: "Le plus populaire",
      free: {
        name: "Gratuit",
        period: "toujours",
        description: "Pour commencer et découvrir la plateforme",
        features: [
          "Saisir ses cours (illimité)",
          "Upload de fichiers : 2/mois (max 10MB)",
          "Résumés IA (illimités)",
          "Téléchargement PDF des résumés",
          "Quiz personnalisés (illimités)",
          "Tariq IA : 5 messages/session",
          "Cooldown de 3h entre sessions",
          "Statistiques de base"
        ],
        cta: "Commencer gratuitement"
      },
      premium: {
        name: "Premium",
        period: "par mois",
        description: "Tout ce qu'il faut pour exceller dans vos études",
        features: [
          "Tout du plan Gratuit",
          "Upload de fichiers illimité",
          "Tariq IA illimité (pas de limite)",
          "Pas de cooldown",
          "Téléchargement PDF illimité",
          "Statistiques avancées",
          "Graphiques de progression détaillés",
          "Support prioritaire"
        ],
        cta: "Passer au Premium"
      },
      benefits: {
        title: "Pourquoi choisir Corrige Tes Cours ?",
        fast: { title: "Résultats rapides", description: "Gagnez du temps et améliorez vos notes dès la première semaine" },
        guarantee: { title: "Satisfait ou remboursé", description: "Garantie 14 jours sur le plan Premium, sans engagement" },
        support: { title: "Assistance 24/7", description: "Tariq IA disponible à tout moment pour répondre à vos questions" },
        progress: { title: "Progression garantie", description: "90% des étudiants améliorent leurs résultats en 30 jours" }
      },
      faq: {
        title: "Questions fréquentes",
        q1: { question: "Puis-je changer de plan à tout moment ?", answer: "Oui, vous pouvez passer du plan Gratuit au plan Premium à tout moment. Le changement est immédiat et vous payez au prorata." },
        q2: { question: "Comment puis-je payer ?", answer: "Nous acceptons les paiements par carte bancaire via notre partenaire sécurisé Stripe." },
        q3: { question: "Y a-t-il une garantie ?", answer: "Oui, le plan Premium inclut une garantie satisfait ou remboursé de 14 jours, sans poser de questions." },
        q4: { question: "Le plan Gratuit est-il vraiment gratuit ?", answer: "Oui, totalement ! Vous pouvez utiliser Corrige Tes Cours gratuitement pour toujours avec jusqu'à 3 cours, 1 résumé et 1 quiz par mois, et Tariq IA (5 messages/session)." }
      }
    },
    
    // About Page
    aboutPage: {
      badge: "Notre histoire",
      heroTitle: "À propos de Corrige Tes Cours",
      heroSubtitle: "Nous croyons que chaque étudiant mérite les meilleurs outils pour réussir ses études",
      stats: {
        students: "Étudiants actifs",
        satisfaction: "Taux de satisfaction",
        summaries: "Résumés générés",
        rating: "Note moyenne"
      },
      story: {
        title: "Notre histoire",
        p1: "Corrige Tes Cours est né d'un constat simple : les étudiants passent trop de temps à réviser sans vraiment progresser. Face aux longues heures de lecture et aux notes difficiles à retenir, nous avons voulu créer une solution.",
        p2: "Notre plateforme utilise l'intelligence artificielle pour transformer vos cours en résumés clairs, générer des quiz personnalisés, et vous accompagner avec Tariq IA, votre tuteur personnel disponible 24/7.",
        p3: "Aujourd'hui, des milliers d'étudiants partout dans le monde améliorent leurs résultats grâce à Corrige Tes Cours. Et ce n'est que le début !"
      },
      values: {
        mission: { title: "Notre mission", description: "Rendre l'apprentissage plus efficace et accessible à tous les étudiants du monde entier grâce à l'intelligence artificielle." },
        passion: { title: "Notre passion", description: "Aider les étudiants à réussir en leur fournissant des outils simples qui facilitent la compréhension et la mémorisation." },
        approach: { title: "Notre approche", description: "Des outils intelligents qui s'adaptent à votre rythme et votre style d'apprentissage pour des révisions ultra-efficaces." },
        community: { title: "Notre communauté", description: "Des milliers d'étudiants partout dans le monde nous font confiance pour améliorer leurs résultats académiques." }
      },
      commitment: {
        title: "Notre engagement envers vous",
        subtitle: "Nous travaillons chaque jour pour améliorer notre plateforme et vous offrir la meilleure expérience d'apprentissage possible. Votre réussite est notre priorité absolue.",
        innovation: { title: "Innovation continue", description: "Nous améliorons constamment nos algorithmes IA pour vous offrir les meilleurs résumés et quiz" },
        listening: { title: "Écoute active", description: "Vos retours façonnent notre plateforme. Nous sommes à votre écoute pour mieux vous servir" },
        excellence: { title: "Excellence académique", description: "Notre mission est de vous aider à exceller dans vos études et atteindre vos objectifs" }
      },
      cta: {
        title: "Rejoignez des milliers d'étudiants qui réussissent",
        subtitle: "Commencez dès aujourd'hui et transformez votre façon d'apprendre",
        button: "Créer un compte gratuit"
      }
    },
    
    // Login Page
    loginPage: {
      welcome: "Bienvenue ! Connectez-vous pour continuer",
      title: "Connexion",
      subtitle: "Accédez à votre espace d'apprentissage",
      email: "Email",
      emailPlaceholder: "votre@email.com",
      password: "Mot de passe",
      submit: "Se connecter",
      submitting: "Connexion...",
      orContinueWith: "Ou continuer avec",
      noAccount: "Pas encore de compte ?",
      createAccount: "Créer un compte",
      termsNotice: "En vous connectant, vous acceptez nos conditions d'utilisation",
      success: "Connexion réussie !",
      successWithCourse: "Votre cours a été ajouté à votre dashboard.",
      error: "Erreur de connexion"
    },
    
    // Signup Page
    signupPage: {
      welcome: "Créez votre compte et commencez à réussir",
      title: "Créer un compte",
      subtitle: "Rejoignez des milliers d'étudiants qui réussissent",
      firstName: "Prénom",
      firstNamePlaceholder: "Jean",
      lastName: "Nom",
      lastNamePlaceholder: "Dupont",
      email: "Email",
      emailPlaceholder: "votre@email.com",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      submit: "Créer mon compte",
      submitting: "Création du compte...",
      continueWithGoogle: "Continuer avec Google",
      orWithEmail: "Ou avec email",
      hasAccount: "Déjà un compte ?",
      login: "Se connecter",
      termsNotice: "En créant un compte, vous acceptez nos conditions d'utilisation",
      success: "Compte créé avec succès !",
      successWithCourse: "Votre cours a été ajouté à votre dashboard.",
      error: "Erreur d'inscription",
      passwordMismatch: "Les mots de passe ne correspondent pas",
      passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères"
    },
    
    // Legal Notice Page
    legalPage: {
      badge: "Informations légales",
      title: "Mentions légales",
      subtitle: "Informations légales relatives à Corrige Tes Cours",
      editor: {
        title: "Éditeur du site",
        company: "Nom de l'entreprise",
        address: "Siège social",
        email: "Email de contact"
      },
      hosting: {
        title: "Hébergement",
        description: "Le site web Corrige Tes Cours est hébergé par :"
      },
      intellectual: {
        title: "Propriété intellectuelle",
        p1: "L'ensemble du contenu de ce site (textes, images, logos, graphiques, interface utilisateur) est la propriété exclusive de Corrige Tes Cours et est protégé par les lois en vigueur sur la propriété intellectuelle internationalement.",
        p2: "Toute reproduction, distribution, modification ou utilisation non autorisée de ce contenu est strictement interdite et peut faire l'objet de poursuites judiciaires."
      },
      responsibility: {
        title: "Responsabilité",
        p1: "Corrige Tes Cours s'efforce de fournir des informations précises, fiables et à jour. Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité absolue des informations présentes sur ce site.",
        p2: "L'utilisateur reconnaît utiliser ces informations sous sa propre responsabilité. Corrige Tes Cours ne saurait être tenu responsable de tout dommage direct ou indirect résultant de l'utilisation du site ou de l'impossibilité de l'utiliser."
      },
      contact: {
        title: "Contact",
        description: "Pour toute question ou demande d'information concernant ces mentions légales, vous pouvez nous contacter à l'adresse :"
      }
    },
    
    // Privacy Page
    privacyPage: {
      badge: "Protection des données",
      title: "Politique de confidentialité",
      subtitle: "Comment nous protégeons et utilisons vos données personnelles",
      collection: {
        title: "Collecte des données",
        intro: "Nous collectons uniquement les données nécessaires au fonctionnement de notre service :",
        items: [
          "Nom et prénom (pour personnaliser votre expérience)",
          "Adresse email (pour la connexion et les communications)",
          "Contenus de cours que vous créez ou uploadez",
          "Résultats de quiz et statistiques de progression",
          "Historique de conversations avec Tariq IA",
          "Informations de paiement (traitées de manière sécurisée via Stripe)"
        ]
      },
      usage: {
        title: "Utilisation des données",
        intro: "Vos données personnelles sont utilisées exclusivement pour :",
        items: [
          "Créer et gérer votre compte utilisateur",
          "Fournir nos services (résumés IA, quiz, Tariq IA, suivi de progression)",
          "Traiter vos paiements de manière sécurisée",
          "Améliorer notre plateforme et nos algorithmes (de manière anonymisée)",
          "Vous contacter concernant votre compte, nos services ou mises à jour importantes"
        ]
      },
      protection: {
        title: "Protection des données",
        intro: "Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données :",
        items: [
          "Chiffrement SSL/TLS pour toutes les communications",
          "Hachage sécurisé des mots de passe (bcrypt)",
          "Accès sécurisé à votre compte avec authentification Google disponible",
          "Stockage sécurisé dans des bases de données protégées (PostgreSQL via Neon)",
          "Pas de partage de vos données personnelles avec des tiers à des fins commerciales",
          "Serveurs hébergés dans des infrastructures certifiées"
        ]
      },
      ai: {
        title: "Intelligence Artificielle",
        intro: "Nos services IA (résumés, quiz, Tariq IA) traitent votre contenu pour :",
        items: [
          "Générer des résumés pertinents de vos cours",
          "Créer des quiz personnalisés adaptés à votre contenu",
          "Répondre à vos questions via Tariq IA"
        ],
        important: "Important :",
        notice: "Vos cours et conversations restent privés. Nous n'utilisons pas votre contenu pour entraîner des modèles d'IA publics. Le traitement est effectué uniquement pour vous fournir nos services."
      },
      rights: {
        title: "Vos droits",
        intro: "Conformément aux réglementations sur la protection des données, vous disposez des droits suivants :",
        access: "Droit d'accès :",
        accessDesc: "Consulter vos données personnelles à tout moment",
        rectification: "Droit de rectification :",
        rectificationDesc: "Corriger vos données inexactes ou incomplètes",
        deletion: "Droit de suppression :",
        deletionDesc: "Supprimer votre compte et toutes vos données",
        portability: "Droit à la portabilité :",
        portabilityDesc: "Récupérer vos données dans un format exploitable",
        opposition: "Droit d'opposition :",
        oppositionDesc: "Vous opposer au traitement de vos données",
        contact: "Pour exercer ces droits, contactez-nous à :"
      },
      cookies: {
        title: "Cookies et technologies similaires",
        intro: "Notre site utilise des cookies essentiels pour :",
        items: [
          "Maintenir votre session de connexion active",
          "Mémoriser vos préférences (mode sombre/clair, langue)",
          "Assurer la sécurité de votre compte",
          "Améliorer les performances et l'expérience utilisateur"
        ],
        notice: "Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient ne pas fonctionner correctement."
      },
      retention: {
        title: "Conservation des données",
        description: "Nous conservons vos données personnelles aussi longtemps que votre compte est actif ou selon les besoins de fourniture de nos services. Si vous supprimez votre compte, toutes vos données personnelles seront définitivement effacées dans un délai de 30 jours."
      },
      changes: {
        title: "Modifications de la politique",
        description: "Nous pouvons mettre à jour cette politique de confidentialité occasionnellement. Nous vous informerons de tout changement important par email ou via une notification sur la plateforme. La version actuelle sera toujours disponible sur cette page."
      },
      contact: {
        title: "Contact",
        description: "Pour toute question concernant cette politique de confidentialité ou le traitement de vos données, contactez-nous à :"
      }
    },
    
    // Terms Page
    termsPage: {
      badge: "Conditions d'utilisation",
      title: "Conditions Générales d'Utilisation",
      subtitle: "Règles d'utilisation de Corrige Tes Cours",
      acceptance: {
        title: "1. Acceptation des conditions",
        description: "En accédant et en utilisant Corrige Tes Cours, vous acceptez d'être lié par ces conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service."
      },
      service: {
        title: "2. Description du service",
        intro: "Corrige Tes Cours est une plateforme d'apprentissage en ligne qui propose :",
        items: [
          "La prise de notes et l'organisation de cours",
          "L'upload de fichiers PDF et Word (2/mois gratuit, illimité en Premium)",
          "La génération automatique de résumés par IA",
          "La création de quiz personnalisés",
          "L'assistance de Tariq IA, votre tuteur personnel",
          "Le suivi de progression académique"
        ]
      },
      account: {
        title: "3. Compte utilisateur",
        intro: "Pour utiliser nos services, vous devez :",
        items: [
          "Créer un compte avec des informations exactes et à jour",
          "Maintenir la confidentialité de vos identifiants",
          "Être responsable de toutes les activités effectuées depuis votre compte",
          "Nous informer immédiatement de toute utilisation non autorisée"
        ]
      },
      acceptable: {
        title: "4. Utilisation acceptable",
        intro: "Vous vous engagez à ne pas :",
        items: [
          "Utiliser le service à des fins illégales ou non autorisées",
          "Partager votre compte avec d'autres personnes",
          "Tenter d'accéder aux comptes d'autres utilisateurs",
          "Perturber ou interférer avec le bon fonctionnement du service",
          "Copier, reproduire ou distribuer le contenu du service sans autorisation"
        ]
      },
      content: {
        title: "5. Propriété du contenu",
        intro: "Vous conservez tous les droits sur le contenu que vous créez (cours, notes). En utilisant notre service, vous nous accordez une licence pour :",
        items: [
          "Stocker et traiter votre contenu de manière sécurisée",
          "Générer des résumés et quiz à partir de votre contenu",
          "Améliorer nos services (de manière anonymisée)"
        ]
      },
      payment: {
        title: "6. Paiements et abonnements",
        intro: "Pour les plans payants :",
        items: [
          "Le paiement se fait en dollars américains (USD)",
          "Le paiement se fait par carte bancaire via Stripe",
          "Vous pouvez annuler votre abonnement à tout moment",
          "Garantie satisfait ou remboursé de 14 jours sur le plan Premium"
        ]
      },
      liability: {
        title: "7. Limitation de responsabilité",
        description: "Corrige Tes Cours est fourni \"tel quel\". Nous ne garantissons pas que le service sera toujours disponible, sécurisé ou exempt d'erreurs. Nous déclinons toute responsabilité pour les dommages directs ou indirects résultant de l'utilisation de notre service."
      },
      modifications: {
        title: "8. Modifications des CGU",
        description: "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur cette page. Votre utilisation continue du service après ces modifications constitue votre acceptation des nouvelles conditions."
      },
      contact: {
        title: "9. Contact",
        description: "Pour toute question concernant ces conditions, contactez-nous à :"
      }
    },
    
    // Trustpilot Section
    trustpilot: {
      seeReviews: "Voir nos avis Trustpilot"
    },
    
    // Try Now Section
    tryNowSection: {
      badge: "Essai Gratuit Sans Inscription",
      title: "Testez l'IA maintenant",
      subtitle: "Uploadez un cours et obtenez un résumé intelligent en quelques secondes. Aucun compte requis pour essayer !",
      uploadTitle: "Uploadez votre premier cours",
      uploading: "Upload en cours...",
      supportedFormats: "Formats supportés : PDF, Word (.docx) • Max 10 MB",
      chooseFile: "Choisir un fichier",
      benefits: "Résumé généré en moins de 30 secondes • 1 essai gratuit sans inscription",
      errors: {
        unsupportedType: "Type de fichier non supporté",
        unsupportedTypeDesc: "Veuillez uploader un fichier PDF ou Word (.docx)",
        fileTooLarge: "Fichier trop volumineux",
        fileTooLargeDesc: "La taille maximale est de 10 MB",
        alreadyTried: "Vous avez déjà testé !",
        alreadyTriedDesc: "Redirection vers votre résumé...",
        uploadFailed: "Upload échoué",
        genericError: "Impossible d'uploader le fichier"
      },
      success: {
        uploaded: "Fichier uploadé !",
        generating: "Génération de votre résumé en cours..."
      }
    },
    
    // Courses Page
    coursesPage: {
      title: "Mes Cours",
      subtitle: "Gérez et organisez vos notes de cours",
      addCourse: "Ajouter un cours",
      uploadFile: "Uploader un fichier",
      noCourses: "Aucun cours pour le moment",
      noCoursesDesc: "Créez votre premier cours ou uploadez un fichier PDF/Word pour commencer.",
      createCourse: "Créer un cours",
      uploadDocument: "Uploader un document",
      courseTitle: "Titre du cours",
      courseTitlePlaceholder: "Ex: Introduction à la biologie",
      subject: "Matière",
      subjectPlaceholder: "Ex: Biologie",
      content: "Contenu",
      contentPlaceholder: "Collez ou écrivez le contenu de votre cours ici...",
      create: "Créer",
      cancel: "Annuler",
      edit: "Modifier",
      delete: "Supprimer",
      view: "Voir",
      generateSummary: "Générer un résumé",
      generatingSummary: "Génération en cours...",
      summaryGenerated: "Résumé généré",
      summaryGeneratedDesc: "Le résumé IA a été généré avec succès.",
      viewSummary: "Voir le résumé",
      summary: "Résumé",
      downloadPdf: "Télécharger PDF",
      courseCreated: "Cours créé",
      courseCreatedDesc: "Votre cours a été créé avec succès.",
      courseUpdated: "Cours modifié",
      courseUpdatedDesc: "Votre cours a été modifié avec succès.",
      courseDeleted: "Cours supprimé",
      courseDeletedDesc: "Votre cours a été supprimé.",
      deleteConfirm: "Êtes-vous sûr ?",
      deleteConfirmDesc: "Cette action supprimera définitivement ce cours et tous les quiz associés.",
      uploadTitle: "Uploader un document",
      uploadDesc: "Formats supportés : PDF, Word (.docx) • Max 10 MB",
      selectFile: "Sélectionner un fichier",
      uploading: "Upload en cours...",
      fileUploaded: "Fichier uploadé",
      fileUploadedDesc: "Le contenu a été extrait et ajouté à votre cours.",
      uploadError: "Erreur d'upload",
      uploadErrorDesc: "Impossible d'uploader le fichier.",
      titleRequired: "Le titre est requis",
      contentRequired: "Le contenu doit contenir au moins 10 caractères",
      error: "Erreur",
      cannotCreate: "Impossible de créer le cours.",
      cannotUpdate: "Impossible de modifier le cours.",
      cannotDelete: "Impossible de supprimer le cours.",
      cannotGenerateSummary: "Impossible de générer le résumé.",
      freeLimit: "Limite gratuite atteinte",
      freeLimitDesc: "Passez au plan Premium pour uploader plus de fichiers.",
      upgradeToPremium: "Passer au Premium",
    },
    
    // Flashcards
    flashcards: {
      title: "Flashcards",
      subtitle: "Revise avec des cartes de mémorisation générées par IA",
      generate: "Générer des flashcards",
      generating: "Génération en cours...",
      generated: "Flashcards générées",
      generatedDesc: "Tes flashcards sont prêtes !",
      noFlashcards: "Pas encore de flashcards",
      noFlashcardsDesc: "Génère des flashcards pour ce cours pour commencer à réviser.",
      front: "Question",
      back: "Réponse",
      flipCard: "Retourner la carte",
      iKnow: "Je sais",
      toReview: "À revoir",
      progress: "Progression",
      mastered: "Maîtrisées",
      remaining: "À revoir",
      of: "sur",
      reviewMode: "Mode révision",
      allCards: "Toutes les cartes",
      onlyToReview: "Seulement à revoir",
      completed: "Bravo ! Tu as revu toutes les cartes !",
      reset: "Recommencer",
      delete: "Supprimer",
      deleteConfirm: "Supprimer ces flashcards ?",
      deleteConfirmDesc: "Cette action est irréversible.",
      error: "Erreur",
      cannotGenerate: "Impossible de générer les flashcards.",
      freeLimit: "Limite gratuite atteinte",
      freeLimitDesc: "Passe au Premium pour générer des flashcards illimitées.",
      card: "Carte",
    },

    // Study Guide
    studyGuide: {
      title: "Guide d'étude",
      subtitle: "Un guide structuré pour réviser efficacement",
      generate: "Générer un guide d'étude",
      generating: "Génération en cours...",
      generated: "Guide généré",
      generatedDesc: "Ton guide d'étude est prêt !",
      noGuide: "Pas encore de guide d'étude",
      noGuideDesc: "Génère un guide d'étude pour organiser ta révision.",
      objectives: "Objectifs d'apprentissage",
      keyConcepts: "Concepts clés",
      pitfalls: "Pièges à éviter",
      exercises: "Exercices pratiques",
      premiumOnly: "Fonctionnalité Premium",
      premiumOnlyDesc: "Les guides d'étude sont réservés aux utilisateurs Premium.",
      upgradeToPremium: "Passer au Premium",
      delete: "Supprimer",
      error: "Erreur",
      cannotGenerate: "Impossible de générer le guide d'étude.",
    },

    // Course Detail
    courseDetail: {
      tabs: {
        content: "Contenu",
        summary: "Résumé",
        quiz: "Quiz",
        flashcards: "Flashcards",
        studyGuide: "Guide",
      },
      backToCourses: "Retour aux cours",
      noContent: "Aucun contenu disponible.",
    },
    
    // Quizzes Page
    quizzesPage: {
      title: "Quiz Intelligents",
      subtitle: "Testez vos connaissances avec des quiz générés par IA",
      generateQuiz: "Générer un nouveau quiz",
      generateQuizDesc: "Sélectionnez un cours et le type de quiz que vous souhaitez générer",
      generating: "Génération en cours...",
      selectCourse: "Cours",
      selectCoursePlaceholder: "Choisir un cours",
      quizType: "Type de quiz",
      mcq: "QCM uniquement",
      openEnded: "Questions ouvertes",
      mixed: "Mixte (QCM + Ouvertes)",
      generate: "Générer le quiz",
      noCourses: "Aucun cours disponible",
      noCoursesDesc: "Créez d'abord un cours pour pouvoir générer des quiz.",
      createCourse: "Créer un cours",
      quizGenerated: "Quiz généré",
      quizGeneratedDesc: "Votre quiz intelligent est prêt !",
      error: "Erreur",
      cannotGenerate: "Impossible de générer le quiz.",
      question: "Question",
      of: "sur",
      questions: "questions",
      previous: "Précédent",
      next: "Suivant",
      submit: "Soumettre",
      submitting: "Évaluation...",
      yourAnswer: "Votre réponse",
      answerPlaceholder: "Entrez votre réponse ici...",
      results: "Résultats du quiz",
      score: "Votre score",
      correct: "Correct",
      incorrect: "Incorrect",
      yourAnswerLabel: "Votre réponse",
      correctAnswerLabel: "Réponse correcte",
      feedback: "Explication",
      answerDetails: "Détails des réponses",
      close: "Fermer",
      takeQuiz: "Passer le quiz",
      recentQuizzes: "Quiz précédents",
      noQuizzes: "Aucun quiz passé",
      noQuizzesDesc: "Générez votre premier quiz pour commencer.",
      cannotEvaluate: "Impossible d'évaluer le quiz.",
      unansweredQuestions: "Questions non répondues",
      unansweredQuestionsDesc: "Il reste {count} question(s) sans réponse.",
      deleteQuiz: "Supprimer",
      deleteQuizConfirm: "Supprimer ce quiz ?",
      deleteQuizConfirmDesc: "Cette action est irréversible. Le quiz sera définitivement supprimé.",
      quizDeleted: "Quiz supprimé",
      quizDeletedDesc: "Le quiz a été supprimé avec succès.",
      cannotDelete: "Impossible de supprimer le quiz.",
    },
    
    // Chat Page (Tariq IA)
    chatPage: {
      title: "Tariq IA",
      subtitle: "Ton assistant IA pour réussir tes études",
      placeholder: "Envoie un message à Tariq...",
      send: "Envoyer",
      clearChat: "Effacer",
      newChat: "Nouvelle conversation",
      chatCleared: "Conversation effacée",
      chatClearedDesc: "L'historique de conversation a été supprimé.",
      error: "Erreur",
      cannotSend: "Impossible d'envoyer le message. Réessaye.",
      limitReached: "Limite atteinte",
      limitReachedDesc: "Tu as utilisé tes 5 messages gratuits. Reviens dans {time} ou passe au plan Premium pour continuer !",
      disclaimer: "Tariq peut faire des erreurs. Vérifie les informations importantes.",
      greeting: "Bonjour ! Je suis Tariq",
      avatarYou: "Tu",
      avatarLabel: "Toi",
      thinking: "En réflexion...",
      newQuotaIn: "Nouveau quota dans",
      suggestionCards: {
        concept: { title: "Explication de concept", subtitle: "Théorème de Pythagore", message: "Explique-moi le théorème de Pythagore" },
        study: { title: "Méthode de révision", subtitle: "Réviser efficacement", message: "Comment réviser efficacement pour un examen ?" },
        memory: { title: "Mémorisation", subtitle: "Astuces de mémorisation", message: "Donne-moi des astuces pour mémoriser mes cours" },
        stress: { title: "Gestion du stress", subtitle: "Stress des examens", message: "Comment gérer mon stress avant les examens ?" },
      },
      suggestions: {
        title: "Suggestions",
        explainConcept: "Explique-moi ce concept",
        helpUnderstand: "Aide-moi à comprendre",
        quizMe: "Fais-moi un quiz rapide",
        summarize: "Résume ce chapitre",
      },
      premiumBadge: "Premium",
      freeBadge: "Gratuit",
      messagesLeft: "restant",
      unlimited: "illimité",
    },
    
    // Performance Page
    performancePage: {
      title: "Performances",
      subtitle: "Visualisez vos progrès et restez motivé",
      totalQuizzes: "Quiz passés",
      averageScore: "Moyenne",
      bestScore: "Meilleur score",
      totalCourses: "Cours actifs",
      quizzesCompleted: "quiz complétés",
      average: "de moyenne",
      bestResult: "meilleur résultat",
      activeCourses: "cours actifs",
      scoreDistribution: "Répartition des scores",
      excellent: "Excellent (80-100%)",
      good: "Bon (60-79%)",
      needsImprovement: "À améliorer (<60%)",
      recentProgress: "Évolution récente",
      performanceByCourse: "Performance par cours",
      noData: "Pas encore de données",
      noDataDesc: "Passez quelques quiz pour voir vos statistiques.",
      takeQuiz: "Passer un quiz",
      quizzes: "quiz",
    },
    
    // Subscription Page
    subscriptionPage: {
      title: "Abonnement Premium",
      subtitle: "Débloquez tout le potentiel de Corrige Tes Cours",
      currentPlan: "Plan actuel",
      free: "Gratuit",
      premium: "Premium",
      expiresOn: "Expire le",
      active: "Actif",
      features: {
        title: "Fonctionnalités Premium",
        unlimitedUploads: "Uploads de fichiers illimités",
        unlimitedChat: "Tariq IA sans limite",
        advancedStats: "Statistiques avancées",
        prioritySupport: "Support prioritaire",
        noAds: "Sans publicité",
      },
      price: "",
      perMonth: "",
      subscribe: "S'abonner maintenant",
      subscribing: "Traitement...",
      paymentMethods: "Paiements sécurisés via",
      mtnMomo: "",
      orangeMoney: "",
      creditCard: "Carte bancaire",
      paymentSuccess: "Paiement réussi !",
      paymentSuccessDesc: "Ton abonnement Premium est maintenant actif",
      paymentFailed: "Paiement échoué",
      paymentFailedDesc: "Le paiement n'a pas été complété. Réessaye.",
      paymentPending: "Paiement en attente",
      paymentPendingDesc: "Ton paiement est en cours de traitement. Nous te confirmerons dès validation.",
      alreadyPremium: "Tu es déjà Premium !",
      alreadyPremiumDesc: "Profite de toutes les fonctionnalités sans limite.",
      guarantee: "Garantie satisfait ou remboursé de 14 jours",
      cancelAnytime: "Annule à tout moment",
      unlimited: "Illimité",
      upgradeToPremium: "Passer au Premium",
      unlockAllFeatures: "Débloque toutes les fonctionnalités",
    },
    
    // Success messages
    success: {
      saved: "Enregistré avec succès",
      deleted: "Supprimé avec succès",
      created: "Créé avec succès",
      updated: "Mis à jour avec succès",
    },
  },
  
  en: {
    // Common
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    search: "Search",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    close: "Close",
    yes: "Yes",
    no: "No",
    or: "or",
    and: "and",
    
    // User-friendly error messages
    errors: {
      generic: "Oops! Something went wrong. Try again in a moment.",
      network: "Connection problem. Check your internet connection.",
      notFound: "This resource no longer exists or has been moved.",
      forbidden: "You don't have access to this resource.",
      unauthorized: "Please log in to access this feature.",
      validation: "Some information is incorrect. Please check and try again.",
      fileTooLarge: "This file is too large. Try a smaller file.",
      invalidFileType: "This file type is not supported.",
      uploadFailed: "File upload failed. Please try again.",
      uploadLimitReached: "You've reached your upload limit this month. Upgrade to Premium to continue!",
      aiUnavailable: "Our AI is momentarily busy. Try again in a few seconds.",
      quizGenerationFailed: "Quiz generation encountered a problem. Please try again.",
      summaryGenerationFailed: "Summary generation encountered a problem. Please try again.",
      chatLimitReached: "You've used all your free messages. Come back later or upgrade to Premium!",
      paymentFailed: "Payment was not completed. Check your details and try again.",
      sessionExpired: "Your session has expired. Please log in again to continue.",
      tryAgain: "Try again",
      contactSupport: "If the problem persists, contact our support.",
    },
    
    // Navigation
    nav: {
      home: "Home",
      courses: "My Courses",
      chat: "Tariq AI",
      stats: "Statistics",
      profile: "Profile",
      subscription: "Subscription",
      account: "My Account",
      logout: "Logout",
      features: "Features",
      pricing: "Pricing",
      about: "About",
      login: "Login",
      signup: "Sign Up",
    },
    
    // Landing Page
    landing: {
      heroTitle: "Study smarter, not harder",
      heroSubtitle: "AI that transforms your courses into clear summaries and personalized quizzes. For all students.",
      cta: "Get started for free",
      tryDemo: "Try without signing up",
      trustedBy: "Trusted by students from",
      features: {
        title: "Everything you need to succeed",
        subtitle: "Powerful tools to optimize your learning",
        summary: {
          title: "Smart summaries",
          description: "AI analyzes your courses and generates clear, structured summaries",
        },
        quiz: {
          title: "Personalized quizzes",
          description: "Test your knowledge with automatically generated quizzes",
        },
        chat: {
          title: "Tariq AI",
          description: "Ask questions to our AI assistant available 24/7",
        },
        upload: {
          title: "File uploads",
          description: "Import your PDFs and Word documents easily",
        },
      },
      howItWorks: {
        title: "How does it work?",
        step1: {
          title: "Add your courses",
          description: "Type your notes or upload your PDF/Word files",
        },
        step2: {
          title: "AI works for you",
          description: "Our AI generates personalized summaries and quizzes",
        },
        step3: {
          title: "Study efficiently",
          description: "Use summaries and quizzes to master your courses",
        },
      },
      pricing: {
        title: "Features for every student",
        free: {
          title: "Free",
          price: "",
          features: [
            "Unlimited course entries",
            "Unlimited AI summaries",
            "Unlimited personalized quizzes",
            "2 file uploads/month",
            "5 Tariq AI messages/session",
          ],
        },
        premium: {
          title: "Premium",
          price: "",
          period: "",
          features: [
            "Everything in Free plan",
            "Unlimited file uploads",
            "Unlimited Tariq AI",
            "No cooldown",
            "Priority support",
          ],
          cta: "Upgrade to Premium",
        },
      },
      cta2: {
        title: "Ready to revolutionize your study sessions?",
        subtitle: "Join thousands of students who succeed with Corrige Tes Cours",
        button: "Get started now",
      },
    },
    
    // Auth
    auth: {
      login: {
        title: "Login",
        subtitle: "Welcome back!",
        email: "Email",
        password: "Password",
        submit: "Sign in",
        noAccount: "Don't have an account?",
        signupLink: "Sign up",
        orContinueWith: "Or continue with",
        google: "Continue with Google",
        forgotPassword: "Forgot password?",
      },
      signup: {
        title: "Sign Up",
        subtitle: "Create your free account",
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm password",
        submit: "Sign up",
        hasAccount: "Already have an account?",
        loginLink: "Log in",
        orContinueWith: "Or continue with",
        google: "Sign up with Google",
      },
      errors: {
        invalidEmail: "Invalid email",
        passwordTooShort: "Password must be at least 6 characters",
        passwordMismatch: "Passwords don't match",
        loginFailed: "Incorrect email or password",
        signupFailed: "Error during sign up",
      },
    },
    
    // Dashboard
    dashboard: {
      welcome: "Welcome",
      welcomeBack: "Welcome back",
      welcomeSubtitle: "Ready to boost your success today?",
      stats: {
        courses: "Courses",
        summaries: "Summaries",
        quizzes: "Quizzes",
        averageScore: "Average score",
      },
      myCourses: "My Courses",
      myQuizzes: "My Quizzes",
      averageScore: "Average",
      coursesRegistered: "courses registered",
      quizzesCompleted: "quizzes completed",
      scoreAverage: "average",
      recentCourses: "Recent courses",
      recentQuizzes: "Recent quizzes",
      noCourses: "No courses yet",
      noQuizzes: "No quizzes yet",
      addFirstCourse: "Add your first course",
      takeFirstQuiz: "Take your first quiz",
      viewAll: "View all",
      score: "Score",
      noData: "No data yet",
      flashcardsToReview: "Flashcards to review",
      noFlashcardsToReview: "No flashcards to review",
      startReview: "Start review",
      lastModified: "Last modified",
    },
    
    // Getting Started Section
    gettingStarted: {
      title: "Getting started",
      subtitle: "Discover the main features of Corrige Tes Cours",
      createCourse: "Create a course",
      createCourseDesc: "Start by creating your first course to enjoy AI summaries and personalized quizzes.",
      generateQuiz: "Generate a quiz",
      generateQuizDesc: "Once your course is created, automatically generate a quiz adapted to your level.",
      trackProgress: "Track your progress",
      trackProgressDesc: "Visualize your progress and stay motivated with detailed statistics.",
    },
    
    // Courses
    courses: {
      title: "My Courses",
      subtitle: "Manage and organize your courses",
      addCourse: "Add course",
      uploadFile: "Upload file",
      noCourses: "No courses yet",
      noCoursesSubtitle: "Start by adding your first course",
      searchPlaceholder: "Search courses...",
      form: {
        title: "Course title",
        titlePlaceholder: "Ex: Introduction to Microeconomics",
        subject: "Subject",
        subjectPlaceholder: "Ex: Economics",
        content: "Course content",
        contentPlaceholder: "Paste your course notes here...",
        save: "Save course",
        saving: "Saving...",
      },
      upload: {
        title: "Upload a file",
        dragDrop: "Drag and drop your file here",
        or: "or",
        browse: "Browse",
        formats: "PDF, DOC, DOCX (max 10MB)",
        uploading: "Uploading...",
        processing: "Processing file...",
        limitReached: "You've reached your upload limit for this month",
        limitInfo: "uploads remaining this month",
        premiumUnlimited: "Unlimited uploads with Premium",
      },
      actions: {
        viewSummary: "View summary",
        generateSummary: "Generate summary",
        createQuiz: "Create quiz",
        edit: "Edit",
        delete: "Delete",
      },
      deleteConfirm: {
        title: "Delete this course?",
        message: "This action cannot be undone. The course and all its summaries/quizzes will be deleted.",
        cancel: "Cancel",
        confirm: "Delete",
      },
    },
    
    // Summaries
    summary: {
      title: "Summary",
      generating: "Generating summary...",
      generatingSubtitle: "AI is analyzing your course to create a clear and structured summary",
      downloadPdf: "Download as PDF",
      regenerate: "Regenerate",
      noSummary: "No summary for this course",
      generateNow: "Generate now",
    },
    
    // Quizzes
    quizzes: {
      title: "My Quizzes",
      subtitle: "Test your knowledge",
      noQuizzes: "No quizzes yet",
      noQuizzesSubtitle: "Create a quiz from one of your courses",
      createQuiz: "Create quiz",
      selectCourse: "Select a course",
      selectCourseSubtitle: "Choose the course you want to be quizzed on",
      quizType: {
        title: "Quiz type",
        mcq: "Multiple Choice",
        mcqDesc: "Multiple choice questions with 4 options",
        open: "Open-ended questions",
        openDesc: "Questions requiring a written answer",
      },
      questionCount: "Number of questions",
      generate: "Generate quiz",
      generating: "Generating...",
      startQuiz: "Start quiz",
      question: "Question",
      of: "of",
      yourAnswer: "Your answer",
      answerPlaceholder: "Write your answer here...",
      submit: "Submit",
      next: "Next question",
      finish: "Finish quiz",
      results: {
        title: "Results",
        score: "Your score",
        correct: "Correct answers",
        incorrect: "Incorrect answers",
        retry: "Retry quiz",
        backToQuizzes: "Back to quizzes",
      },
      feedback: {
        correct: "Correct!",
        incorrect: "Incorrect",
        correctAnswer: "The correct answer was",
        explanation: "Explanation",
      },
    },
    
    // Chat (Tariq AI)
    chat: {
      title: "Tariq AI",
      subtitle: "Your AI assistant for success",
      placeholder: "Ask Tariq a question...",
      send: "Send",
      typing: "Tariq is typing...",
      welcome: {
        title: "Hi! I'm Tariq, your AI assistant",
        subtitle: "Ask me any question about your courses. I'm here to help you succeed!",
      },
      suggestions: [
        "Explain the concept of...",
        "What are the differences between... and...?",
        "How do I solve this type of problem?",
        "Can you give me an example of...?",
      ],
      limit: {
        reached: "You've reached your message limit",
        remaining: "messages remaining",
        cooldown: "Next session in",
        premium: "Upgrade to Premium for unlimited access",
      },
    },
    
    // Performance/Stats
    performance: {
      title: "Statistics",
      subtitle: "Track your progress",
      overview: "Overview",
      quizHistory: "Quiz history",
      noData: "No data yet",
      startLearning: "Start learning to see your statistics",
      avgScore: "Average score",
      totalQuizzes: "Quizzes completed",
      totalCourses: "Courses studied",
      streak: "Day streak",
      improvement: "Improvement",
      lastWeek: "This week",
      lastMonth: "This month",
    },
    
    // Account
    account: {
      title: "My Account",
      subtitle: "Manage your profile and preferences",
      profile: {
        title: "Personal information",
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        phonePlaceholder: "+237 6XX XXX XXX",
        save: "Save changes",
        saving: "Saving...",
        saved: "Changes saved",
      },
      preferences: {
        title: "Preferences",
        language: "Language",
        languageDesc: "Choose your preferred language for the interface and generated content",
        french: "Français",
        english: "English",
        theme: "Theme",
        themeDesc: "Choose between light and dark mode",
        light: "Light",
        dark: "Dark",
        system: "System",
      },
      subscription: {
        title: "Subscription",
        currentPlan: "Current plan",
        free: "Free",
        premium: "Premium",
        expiresOn: "Expires on",
        manage: "Manage subscription",
      },
      danger: {
        title: "Danger zone",
        deleteAccount: "Delete my account",
        deleteWarning: "This action cannot be undone. All your data will be deleted.",
      },
    },
    
    // Subscription
    subscription: {
      title: "My Subscription",
      subtitle: "Manage your subscription and access Premium features",
      currentPlan: "Current plan",
      free: "Free",
      premium: "Premium",
      premiumFeatures: "Premium Features",
      unlockAll: "Unlock the full potential of Corrige Tes Cours",
      expiresOn: "Expiration date",
      price: "",
      currency: "",
      perMonth: "",
      subscribe: "Upgrade to Premium",
      subscribing: "Initializing...",
      unlimited: "Unlimited",
      upgradeToPremium: "Upgrade to Premium",
      unlockAllFeatures: "Unlock all features",
      paymentMethods: "Payment methods",
      paymentMethodsDesc: "Secure card payment",
      mtn: "",
      orange: "",
      card: "Credit card",
      cameroon: "",
      visaMastercard: "Visa, Mastercard",
      securedBy: "Your payments are secured by",
      success: "Payment successful!",
      successDesc: "Your Premium subscription is now active",
      failed: "Payment failed",
      pending: "Payment pending",
      pendingDesc: "Your payment is being processed. We'll confirm as soon as it's validated.",
      features: {
        everything: "Everything in Free plan",
        unlimitedUploads: "Unlimited file uploads",
        unlimitedChat: "Unlimited Tariq AI (no limits)",
        noCooldown: "No cooldown",
        advancedStats: "Advanced statistics",
        prioritySupport: "Priority support",
      },
      freeFeatures: {
        courses: "Up to 3 courses",
        summaries: "1 AI summary per month",
        pdfDownload: "PDF download for summaries",
        quizzes: "1 quiz per month",
        uploads: "Upload: 2 files/month (10MB max)",
        chat: "Tariq AI: 5 messages/session (3h cooldown)",
      },
    },
    
    // Footer
    footer: {
      tagline: "AI that helps you ace your exams",
      description: "Your intelligent learning platform for academic success",
      followUs: "Follow us",
      navigation: "Navigation",
      legal: "Legal notice",
      privacy: "Privacy policy",
      terms: "Terms of service",
      contact: "Contact",
      legalSection: "Legal",
      copyright: "All rights reserved",
    },
    
    // Features Page
    featuresPage: {
      badge: "Complete features",
      heroTitle: "Everything you need to excel",
      heroSubtitle: "Discover how Corrige Tes Cours transforms the way you learn and study with powerful yet simple tools",
      ctaTitle: "Ready to transform how you study?",
      ctaSubtitle: "Join thousands of students improving their results with Corrige Tes Cours",
      ctaButton: "Create a free account",
      features: {
        notes: {
          title: "Smart note-taking",
          description: "Create and organize your courses in one place with a simple and effective categorization system.",
          details: ["Intuitive text editor", "Organization by subject", "Instant search", "Secure storage"]
        },
        summaries: {
          title: "AI Summaries",
          description: "Automatically generate structured summaries with key points from your courses.",
          details: ["Clear and precise summaries", "Essential points identified", "Structured format", "PDF download"]
        },
        upload: {
          title: "File uploads",
          description: "Import your courses as PDF or Word and let AI extract the content automatically.",
          details: ["PDF and Word support", "Automatic extraction", "Up to 10MB per file", "2 files/month (free)"]
        },
        quiz: {
          title: "Personalized quizzes",
          description: "Quizzes tailored to your courses: MCQ, open-ended questions or mixed format based on your needs.",
          details: ["Interactive MCQs", "Open-ended questions", "Mixed format", "Automatic correction"]
        },
        tariq: {
          title: "Tariq AI - Your personal tutor",
          description: "Ask your questions and get clear explanations from your intelligent AI assistant.",
          details: ["Instant answers", "Detailed explanations", "5 messages/session (free)", "Unlimited in Premium"]
        },
        evaluation: {
          title: "Automatic evaluation",
          description: "Receive detailed feedback on your answers to progress quickly.",
          details: ["Smart correction", "Personalized feedback", "Improvement suggestions", "Detailed score"]
        },
        tracking: {
          title: "Performance tracking",
          description: "Visualize your progress with intuitive statistics and graphs.",
          details: ["Complete dashboard", "Progress charts", "Analysis by subject", "Areas to improve"]
        },
        advancedStats: {
          title: "Advanced statistics",
          description: "Access in-depth analysis of your performance (Premium).",
          details: ["Learning trends", "Time comparisons", "Detailed reports", "Personalized insights"]
        },
        revision: {
          title: "Optimized revision",
          description: "Focus your revision on what really matters with personalized suggestions.",
          details: ["Targeted revision", "Smart prioritization", "Adapted planning", "Useful reminders"]
        }
      }
    },
    
    // Pricing Page
    pricingPage: {
      badge: "Simple and transparent plans",
      heroTitle: "Choose the plan that fits you",
      heroSubtitle: "Start for free and upgrade to Premium when you're ready. No commitment, cancel anytime.",
      mostPopular: "Most popular",
      free: {
        name: "Free",
        period: "forever",
        description: "To get started and discover the platform",
        features: [
          "Unlimited course entries",
          "File uploads: 2/month (max 10MB)",
          "Unlimited AI summaries",
          "PDF download for summaries",
          "Unlimited personalized quizzes",
          "Tariq AI: 5 messages/session",
          "3h cooldown between sessions",
          "Basic statistics"
        ],
        cta: "Get started for free"
      },
      premium: {
        name: "Premium",
        period: "per month",
        description: "Everything you need to excel in your studies",
        features: [
          "Everything in Free plan",
          "Unlimited file uploads",
          "Unlimited Tariq AI (no limits)",
          "No cooldown",
          "Unlimited PDF downloads",
          "Advanced statistics",
          "Detailed progress charts",
          "Priority support"
        ],
        cta: "Upgrade to Premium"
      },
      benefits: {
        title: "Why choose Corrige Tes Cours?",
        fast: { title: "Fast results", description: "Save time and improve your grades from the first week" },
        guarantee: { title: "Money-back guarantee", description: "14-day guarantee on Premium plan, no commitment" },
        support: { title: "24/7 Support", description: "Tariq AI available anytime to answer your questions" },
        progress: { title: "Guaranteed progress", description: "90% of students improve their results in 30 days" }
      },
      faq: {
        title: "Frequently asked questions",
        q1: { question: "Can I change plans at any time?", answer: "Yes, you can upgrade from Free to Premium at any time. The change is immediate and you pay pro-rata." },
        q2: { question: "How can I pay?", answer: "We accept payments via credit card through our secure partner Stripe." },
        q3: { question: "Is there a guarantee?", answer: "Yes, the Premium plan includes a 14-day money-back guarantee, no questions asked." },
        q4: { question: "Is the Free plan really free?", answer: "Yes, absolutely! You can use Corrige Tes Cours for free forever with up to 3 courses, 1 summary and 1 quiz per month, and Tariq AI (5 messages/session)." }
      }
    },
    
    // About Page
    aboutPage: {
      badge: "Our story",
      heroTitle: "About Corrige Tes Cours",
      heroSubtitle: "We believe every student deserves the best tools to succeed in their studies",
      stats: {
        students: "Active students",
        satisfaction: "Satisfaction rate",
        summaries: "Summaries generated",
        rating: "Average rating"
      },
      story: {
        title: "Our story",
        p1: "Corrige Tes Cours was born from a simple observation: students spend too much time studying without really progressing. Faced with long hours of reading and notes that are hard to remember, we wanted to create a solution.",
        p2: "Our platform uses artificial intelligence to transform your courses into clear summaries, generate personalized quizzes, and support you with Tariq AI, your personal tutor available 24/7.",
        p3: "Today, thousands of students around the world are improving their results with Corrige Tes Cours. And this is just the beginning!"
      },
      values: {
        mission: { title: "Our mission", description: "Making learning more effective and accessible to students worldwide through artificial intelligence." },
        passion: { title: "Our passion", description: "Helping students succeed by providing simple tools that facilitate understanding and memorization." },
        approach: { title: "Our approach", description: "Smart tools that adapt to your pace and learning style for ultra-effective revision." },
        community: { title: "Our community", description: "Thousands of students around the world trust us to improve their academic results." }
      },
      commitment: {
        title: "Our commitment to you",
        subtitle: "We work every day to improve our platform and offer you the best learning experience possible. Your success is our absolute priority.",
        innovation: { title: "Continuous innovation", description: "We constantly improve our AI algorithms to offer you the best summaries and quizzes" },
        listening: { title: "Active listening", description: "Your feedback shapes our platform. We are here to serve you better" },
        excellence: { title: "Academic excellence", description: "Our mission is to help you excel in your studies and achieve your goals" }
      },
      cta: {
        title: "Join thousands of successful students",
        subtitle: "Start today and transform the way you learn",
        button: "Create a free account"
      }
    },
    
    // Login Page
    loginPage: {
      welcome: "Welcome! Sign in to continue",
      title: "Login",
      subtitle: "Access your learning space",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Password",
      submit: "Sign in",
      submitting: "Signing in...",
      orContinueWith: "Or continue with",
      noAccount: "Don't have an account?",
      createAccount: "Create an account",
      termsNotice: "By signing in, you accept our terms of service",
      success: "Login successful!",
      successWithCourse: "Your course has been added to your dashboard.",
      error: "Login error"
    },
    
    // Signup Page
    signupPage: {
      welcome: "Create your account and start succeeding",
      title: "Create an account",
      subtitle: "Join thousands of successful students",
      firstName: "First name",
      firstNamePlaceholder: "John",
      lastName: "Last name",
      lastNamePlaceholder: "Doe",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Password",
      confirmPassword: "Confirm password",
      submit: "Create my account",
      submitting: "Creating account...",
      continueWithGoogle: "Continue with Google",
      orWithEmail: "Or with email",
      hasAccount: "Already have an account?",
      login: "Sign in",
      termsNotice: "By creating an account, you accept our terms of service",
      success: "Account created successfully!",
      successWithCourse: "Your course has been added to your dashboard.",
      error: "Sign up error",
      passwordMismatch: "Passwords don't match",
      passwordTooShort: "Password must be at least 8 characters"
    },
    
    // Legal Notice Page
    legalPage: {
      badge: "Legal information",
      title: "Legal Notice",
      subtitle: "Legal information regarding Corrige Tes Cours",
      editor: {
        title: "Website Publisher",
        company: "Company name",
        address: "Headquarters",
        email: "Contact email"
      },
      hosting: {
        title: "Hosting",
        description: "The Corrige Tes Cours website is hosted by:"
      },
      intellectual: {
        title: "Intellectual Property",
        p1: "All content on this site (texts, images, logos, graphics, user interface) is the exclusive property of Corrige Tes Cours and is protected by intellectual property laws internationally.",
        p2: "Any unauthorized reproduction, distribution, modification or use of this content is strictly prohibited and may result in legal proceedings."
      },
      responsibility: {
        title: "Liability",
        p1: "Corrige Tes Cours strives to provide accurate, reliable and up-to-date information. However, we cannot guarantee the absolute accuracy, completeness or timeliness of the information on this site.",
        p2: "The user acknowledges using this information at their own risk. Corrige Tes Cours cannot be held liable for any direct or indirect damage resulting from the use of the site or the inability to use it."
      },
      contact: {
        title: "Contact",
        description: "For any questions or requests for information regarding these legal notices, you can contact us at:"
      }
    },
    
    // Privacy Page
    privacyPage: {
      badge: "Data protection",
      title: "Privacy Policy",
      subtitle: "How we protect and use your personal data",
      collection: {
        title: "Data Collection",
        intro: "We only collect data necessary for our service to function:",
        items: [
          "First and last name (to personalize your experience)",
          "Email address (for login and communications)",
          "Course content you create or upload",
          "Quiz results and progress statistics",
          "Conversation history with Tariq AI",
          "Payment information (processed securely via Stripe)"
        ]
      },
      usage: {
        title: "Data Usage",
        intro: "Your personal data is used exclusively for:",
        items: [
          "Creating and managing your user account",
          "Providing our services (AI summaries, quizzes, Tariq AI, progress tracking)",
          "Processing your payments securely",
          "Improving our platform and algorithms (anonymously)",
          "Contacting you regarding your account, our services or important updates"
        ]
      },
      protection: {
        title: "Data Protection",
        intro: "We implement strict security measures to protect your data:",
        items: [
          "SSL/TLS encryption for all communications",
          "Secure password hashing (bcrypt)",
          "Secure account access with Google authentication available",
          "Secure storage in protected databases (PostgreSQL via Neon)",
          "No sharing of your personal data with third parties for commercial purposes",
          "Servers hosted in certified infrastructure"
        ]
      },
      ai: {
        title: "Artificial Intelligence",
        intro: "Our AI services (summaries, quizzes, Tariq AI) process your content to:",
        items: [
          "Generate relevant summaries of your courses",
          "Create personalized quizzes adapted to your content",
          "Answer your questions via Tariq AI"
        ],
        important: "Important:",
        notice: "Your courses and conversations remain private. We do not use your content to train public AI models. Processing is done solely to provide you with our services."
      },
      rights: {
        title: "Your Rights",
        intro: "In accordance with data protection regulations, you have the following rights:",
        access: "Right of access:",
        accessDesc: "View your personal data at any time",
        rectification: "Right of rectification:",
        rectificationDesc: "Correct your inaccurate or incomplete data",
        deletion: "Right of deletion:",
        deletionDesc: "Delete your account and all your data",
        portability: "Right to portability:",
        portabilityDesc: "Retrieve your data in a usable format",
        opposition: "Right to object:",
        oppositionDesc: "Object to the processing of your data",
        contact: "To exercise these rights, contact us at:"
      },
      cookies: {
        title: "Cookies and Similar Technologies",
        intro: "Our site uses essential cookies to:",
        items: [
          "Keep your login session active",
          "Remember your preferences (dark/light mode, language)",
          "Ensure the security of your account",
          "Improve performance and user experience"
        ],
        notice: "You can configure your browser to refuse cookies, but some site features may not work properly."
      },
      retention: {
        title: "Data Retention",
        description: "We retain your personal data as long as your account is active or as needed to provide our services. If you delete your account, all your personal data will be permanently deleted within 30 days."
      },
      changes: {
        title: "Policy Changes",
        description: "We may update this privacy policy occasionally. We will notify you of any significant changes by email or via a notification on the platform. The current version will always be available on this page."
      },
      contact: {
        title: "Contact",
        description: "For any questions regarding this privacy policy or the processing of your data, contact us at:"
      }
    },
    
    // Terms Page
    termsPage: {
      badge: "Terms of use",
      title: "Terms of Service",
      subtitle: "Rules for using Corrige Tes Cours",
      acceptance: {
        title: "1. Acceptance of Terms",
        description: "By accessing and using Corrige Tes Cours, you agree to be bound by these terms of service. If you do not accept these terms, please do not use our service."
      },
      service: {
        title: "2. Service Description",
        intro: "Corrige Tes Cours is an online learning platform that offers:",
        items: [
          "Note-taking and course organization",
          "PDF and Word file uploads (2/month free, unlimited in Premium)",
          "Automatic AI-generated summaries",
          "Personalized quiz creation",
          "Tariq AI assistance, your personal tutor",
          "Academic progress tracking"
        ]
      },
      account: {
        title: "3. User Account",
        intro: "To use our services, you must:",
        items: [
          "Create an account with accurate and up-to-date information",
          "Maintain the confidentiality of your credentials",
          "Be responsible for all activities performed from your account",
          "Immediately notify us of any unauthorized use"
        ]
      },
      acceptable: {
        title: "4. Acceptable Use",
        intro: "You agree not to:",
        items: [
          "Use the service for illegal or unauthorized purposes",
          "Share your account with others",
          "Attempt to access other users' accounts",
          "Disrupt or interfere with the proper functioning of the service",
          "Copy, reproduce or distribute the service content without authorization"
        ]
      },
      content: {
        title: "5. Content Ownership",
        intro: "You retain all rights to the content you create (courses, notes). By using our service, you grant us a license to:",
        items: [
          "Store and process your content securely",
          "Generate summaries and quizzes from your content",
          "Improve our services (anonymously)"
        ]
      },
      payment: {
        title: "6. Payments and Subscriptions",
        intro: "For paid plans:",
        items: [
          "Payment is in US dollars (USD)",
          "Payment is via credit card through Stripe",
          "You can cancel your subscription at any time",
          "14-day money-back guarantee on Premium plan"
        ]
      },
      liability: {
        title: "7. Limitation of Liability",
        description: "Corrige Tes Cours is provided \"as is\". We do not guarantee that the service will always be available, secure or error-free. We disclaim any liability for direct or indirect damages resulting from the use of our service."
      },
      modifications: {
        title: "8. Terms Modifications",
        description: "We reserve the right to modify these terms at any time. Changes take effect upon publication on this page. Your continued use of the service after these changes constitutes your acceptance of the new terms."
      },
      contact: {
        title: "9. Contact",
        description: "For any questions regarding these terms, contact us at:"
      }
    },
    
    // Trustpilot Section
    trustpilot: {
      seeReviews: "See our Trustpilot reviews"
    },
    
    // Try Now Section
    tryNowSection: {
      badge: "Free Trial Without Signup",
      title: "Try the AI now",
      subtitle: "Upload a course and get an intelligent summary in seconds. No account required to try!",
      uploadTitle: "Upload your first course",
      uploading: "Uploading...",
      supportedFormats: "Supported formats: PDF, Word (.docx) • Max 10 MB",
      chooseFile: "Choose a file",
      benefits: "Summary generated in less than 30 seconds • 1 free trial without signup",
      errors: {
        unsupportedType: "Unsupported file type",
        unsupportedTypeDesc: "Please upload a PDF or Word (.docx) file",
        fileTooLarge: "File too large",
        fileTooLargeDesc: "Maximum size is 10 MB",
        alreadyTried: "You've already tried!",
        alreadyTriedDesc: "Redirecting to your summary...",
        uploadFailed: "Upload failed",
        genericError: "Unable to upload file"
      },
      success: {
        uploaded: "File uploaded!",
        generating: "Generating your summary..."
      }
    },
    
    // Courses Page
    coursesPage: {
      title: "My Courses",
      subtitle: "Manage and organize your course notes",
      addCourse: "Add a course",
      uploadFile: "Upload a file",
      noCourses: "No courses yet",
      noCoursesDesc: "Create your first course or upload a PDF/Word file to get started.",
      createCourse: "Create a course",
      uploadDocument: "Upload a document",
      courseTitle: "Course title",
      courseTitlePlaceholder: "Ex: Introduction to Biology",
      subject: "Subject",
      subjectPlaceholder: "Ex: Biology",
      content: "Content",
      contentPlaceholder: "Paste or write your course content here...",
      create: "Create",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      generateSummary: "Generate a summary",
      generatingSummary: "Generating...",
      summaryGenerated: "Summary generated",
      summaryGeneratedDesc: "The AI summary has been successfully generated.",
      viewSummary: "View summary",
      summary: "Summary",
      downloadPdf: "Download PDF",
      courseCreated: "Course created",
      courseCreatedDesc: "Your course has been created successfully.",
      courseUpdated: "Course updated",
      courseUpdatedDesc: "Your course has been updated successfully.",
      courseDeleted: "Course deleted",
      courseDeletedDesc: "Your course has been deleted.",
      deleteConfirm: "Are you sure?",
      deleteConfirmDesc: "This action will permanently delete this course and all associated quizzes.",
      uploadTitle: "Upload a document",
      uploadDesc: "Supported formats: PDF, Word (.docx) • Max 10 MB",
      selectFile: "Select a file",
      uploading: "Uploading...",
      fileUploaded: "File uploaded",
      fileUploadedDesc: "The content has been extracted and added to your course.",
      uploadError: "Upload error",
      uploadErrorDesc: "Unable to upload the file.",
      titleRequired: "Title is required",
      contentRequired: "Content must be at least 10 characters",
      error: "Error",
      cannotCreate: "Unable to create the course.",
      cannotUpdate: "Unable to update the course.",
      cannotDelete: "Unable to delete the course.",
      cannotGenerateSummary: "Unable to generate the summary.",
      freeLimit: "Free limit reached",
      freeLimitDesc: "Upgrade to Premium to upload more files.",
      upgradeToPremium: "Upgrade to Premium",
    },
    
    // Flashcards
    flashcards: {
      title: "Flashcards",
      subtitle: "Review with AI-generated memorization cards",
      generate: "Generate flashcards",
      generating: "Generating...",
      generated: "Flashcards generated",
      generatedDesc: "Your flashcards are ready!",
      noFlashcards: "No flashcards yet",
      noFlashcardsDesc: "Generate flashcards for this course to start reviewing.",
      front: "Question",
      back: "Answer",
      flipCard: "Flip card",
      iKnow: "I know",
      toReview: "To review",
      progress: "Progress",
      mastered: "Mastered",
      remaining: "To review",
      of: "of",
      reviewMode: "Review mode",
      allCards: "All cards",
      onlyToReview: "Only to review",
      completed: "Great job! You reviewed all cards!",
      reset: "Start over",
      delete: "Delete",
      deleteConfirm: "Delete these flashcards?",
      deleteConfirmDesc: "This action is irreversible.",
      error: "Error",
      cannotGenerate: "Could not generate flashcards.",
      freeLimit: "Free limit reached",
      freeLimitDesc: "Upgrade to Premium for unlimited flashcards.",
      card: "Card",
    },

    // Study Guide
    studyGuide: {
      title: "Study Guide",
      subtitle: "A structured guide to study effectively",
      generate: "Generate study guide",
      generating: "Generating...",
      generated: "Guide generated",
      generatedDesc: "Your study guide is ready!",
      noGuide: "No study guide yet",
      noGuideDesc: "Generate a study guide to organize your revision.",
      objectives: "Learning Objectives",
      keyConcepts: "Key Concepts",
      pitfalls: "Common Pitfalls",
      exercises: "Practice Exercises",
      premiumOnly: "Premium Feature",
      premiumOnlyDesc: "Study guides are reserved for Premium users.",
      upgradeToPremium: "Upgrade to Premium",
      delete: "Delete",
      error: "Error",
      cannotGenerate: "Could not generate study guide.",
    },

    // Course Detail
    courseDetail: {
      tabs: {
        content: "Content",
        summary: "Summary",
        quiz: "Quiz",
        flashcards: "Flashcards",
        studyGuide: "Guide",
      },
      backToCourses: "Back to courses",
      noContent: "No content available.",
    },
    
    // Quizzes Page
    quizzesPage: {
      title: "Smart Quizzes",
      subtitle: "Test your knowledge with AI-generated quizzes",
      generateQuiz: "Generate a new quiz",
      generateQuizDesc: "Select a course and the type of quiz you want to generate",
      generating: "Generating...",
      selectCourse: "Course",
      selectCoursePlaceholder: "Choose a course",
      quizType: "Quiz type",
      mcq: "MCQ only",
      openEnded: "Open-ended questions",
      mixed: "Mixed (MCQ + Open-ended)",
      generate: "Generate quiz",
      noCourses: "No courses available",
      noCoursesDesc: "Create a course first to generate quizzes.",
      createCourse: "Create a course",
      quizGenerated: "Quiz generated",
      quizGeneratedDesc: "Your intelligent quiz is ready!",
      error: "Error",
      cannotGenerate: "Unable to generate the quiz.",
      question: "Question",
      of: "of",
      questions: "questions",
      previous: "Previous",
      next: "Next",
      submit: "Submit",
      submitting: "Evaluating...",
      yourAnswer: "Your answer",
      answerPlaceholder: "Enter your answer here...",
      results: "Quiz results",
      score: "Your score",
      correct: "Correct",
      incorrect: "Incorrect",
      yourAnswerLabel: "Your answer",
      correctAnswerLabel: "Correct answer",
      feedback: "Explanation",
      answerDetails: "Answer details",
      close: "Close",
      takeQuiz: "Take quiz",
      recentQuizzes: "Previous quizzes",
      noQuizzes: "No quizzes taken",
      noQuizzesDesc: "Generate your first quiz to get started.",
      cannotEvaluate: "Unable to evaluate the quiz.",
      unansweredQuestions: "Unanswered questions",
      unansweredQuestionsDesc: "There are {count} unanswered question(s).",
      deleteQuiz: "Delete",
      deleteQuizConfirm: "Delete this quiz?",
      deleteQuizConfirmDesc: "This action cannot be undone. The quiz will be permanently deleted.",
      quizDeleted: "Quiz deleted",
      quizDeletedDesc: "The quiz has been successfully deleted.",
      cannotDelete: "Unable to delete the quiz.",
    },
    
    // Chat Page (Tariq IA)
    chatPage: {
      title: "Tariq AI",
      subtitle: "Your AI assistant for academic success",
      placeholder: "Send a message to Tariq...",
      send: "Send",
      clearChat: "Clear",
      newChat: "New conversation",
      chatCleared: "Conversation cleared",
      chatClearedDesc: "The conversation history has been deleted.",
      error: "Error",
      cannotSend: "Unable to send the message. Try again.",
      limitReached: "Limit reached",
      limitReachedDesc: "You've used your 5 free messages. Come back in {time} or upgrade to Premium to continue!",
      disclaimer: "Tariq can make mistakes. Verify important information.",
      greeting: "Hello! I'm Tariq",
      avatarYou: "You",
      avatarLabel: "You",
      thinking: "Thinking...",
      newQuotaIn: "New quota in",
      suggestionCards: {
        concept: { title: "Concept explanation", subtitle: "Pythagorean theorem", message: "Explain the Pythagorean theorem to me" },
        study: { title: "Study method", subtitle: "Study effectively", message: "How to study effectively for an exam?" },
        memory: { title: "Memorization", subtitle: "Memory tips", message: "Give me tips to memorize my courses" },
        stress: { title: "Stress management", subtitle: "Exam stress", message: "How to manage my stress before exams?" },
      },
      suggestions: {
        title: "Suggestions",
        explainConcept: "Explain this concept",
        helpUnderstand: "Help me understand",
        quizMe: "Give me a quick quiz",
        summarize: "Summarize this chapter",
      },
      premiumBadge: "Premium",
      freeBadge: "Free",
      messagesLeft: "left",
      unlimited: "unlimited",
    },
    
    // Performance Page
    performancePage: {
      title: "Performance",
      subtitle: "Track your progress and stay motivated",
      totalQuizzes: "Quizzes taken",
      averageScore: "Average",
      bestScore: "Best score",
      totalCourses: "Active courses",
      quizzesCompleted: "quizzes completed",
      average: "average",
      bestResult: "best result",
      activeCourses: "active courses",
      scoreDistribution: "Score distribution",
      excellent: "Excellent (80-100%)",
      good: "Good (60-79%)",
      needsImprovement: "Needs improvement (<60%)",
      recentProgress: "Recent progress",
      performanceByCourse: "Performance by course",
      noData: "No data yet",
      noDataDesc: "Take some quizzes to see your statistics.",
      takeQuiz: "Take a quiz",
      quizzes: "quizzes",
    },
    
    // Subscription Page
    subscriptionPage: {
      title: "Premium Subscription",
      subtitle: "Unlock the full potential of Corrige Tes Cours",
      currentPlan: "Current plan",
      free: "Free",
      premium: "Premium",
      expiresOn: "Expires on",
      active: "Active",
      features: {
        title: "Premium Features",
        unlimitedUploads: "Unlimited file uploads",
        unlimitedChat: "Unlimited Tariq AI",
        advancedStats: "Advanced statistics",
        prioritySupport: "Priority support",
        noAds: "Ad-free",
      },
      price: "",
      perMonth: "",
      subscribe: "Subscribe now",
      subscribing: "Processing...",
      paymentMethods: "Secure payments via",
      mtnMomo: "",
      orangeMoney: "",
      creditCard: "Credit card",
      paymentSuccess: "Payment successful!",
      paymentSuccessDesc: "Your Premium subscription is now active",
      paymentFailed: "Payment failed",
      paymentFailedDesc: "The payment was not completed. Try again.",
      paymentPending: "Payment pending",
      paymentPendingDesc: "Your payment is being processed. We'll confirm once validated.",
      alreadyPremium: "You're already Premium!",
      alreadyPremiumDesc: "Enjoy all features without limits.",
      guarantee: "14-day money-back guarantee",
      cancelAnytime: "Cancel anytime",
      unlimited: "Unlimited",
      upgradeToPremium: "Upgrade to Premium",
      unlockAllFeatures: "Unlock all features",
    },
    
    // Success messages
    success: {
      saved: "Saved successfully",
      deleted: "Deleted successfully",
      created: "Created successfully",
      updated: "Updated successfully",
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;
