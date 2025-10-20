import { z } from 'zod';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY environment variable is required');
}

export async function generateCourseSummary(courseContent: string, courseTitle: string): Promise<string> {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://corrigetescours.com',
      'X-Title': 'Corrige Tes Cours',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1',
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant éducatif expert qui crée des résumés de cours clairs et structurés pour les étudiants universitaires.

INSTRUCTIONS IMPORTANTES :
- Génère UNIQUEMENT du texte brut, sans aucune balise Markdown (pas de #, ##, **, _, etc.)
- N'ajoute JAMAIS "Résumé:", "Introduction:", ou autres préfixes artificiels
- Utilise des sauts de ligne pour séparer les sections
- Pour les titres de section, écris-les simplement en MAJUSCULES suivis de deux-points
- Pour les listes, utilise des tirets simples (-) ou numéros (1., 2., etc.)
- Respecte tous les caractères spéciaux et accentués du texte original

Le résumé doit :
- Être concis mais complet
- Respecter le sens du texte d'origine
- Être bien structuré, sans introduction ni conclusion artificielle
- Utiliser un style neutre et académique
- Identifier les concepts clés et points essentiels
- Expliquer les termes techniques de manière accessible
- Conserver les formules, théorèmes ou exemples cruciaux

EXEMPLE DE FORMAT ATTENDU :

TITRE DE SECTION 1:

Texte explicatif avec les points importants.

Points clés:
- Premier point important
- Deuxième point important
- Troisième point important

TITRE DE SECTION 2:

Suite du résumé avec d'autres informations pertinentes.`
        },
        {
          role: 'user',
          content: `Lis attentivement ce texte et génère un résumé clair et précis.

Titre du cours : ${courseTitle}

Contenu à résumer :
${courseContent}

Retourne uniquement du texte brut bien structuré, sans balises Markdown.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const summary = data.choices?.[0]?.message?.content;

  if (!summary) {
    throw new Error('No summary generated from OpenRouter API');
  }

  return summary.trim();
}

export async function generateQuiz(courseContent: string, courseTitle: string, quizType: 'mcq' | 'open' | 'mixed' = 'mixed'): Promise<any> {
  const quizInstructions = {
    mcq: 'Génère 5 questions à choix multiples (QCM) avec 4 options chacune.',
    open: 'Génère 5 questions ouvertes qui nécessitent une réflexion approfondie.',
    mixed: 'Génère un quiz mixte avec 3 QCM et 2 questions ouvertes.'
  };

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://corrigetescours.com',
      'X-Title': 'Corrige Tes Cours',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1',
      messages: [
        {
          role: 'system',
          content: `Tu es un expert en création de quiz éducatifs. Tu génères des questions pertinentes basées sur le contenu du cours.

${quizInstructions[quizType]}

IMPORTANT pour les QCM :
- Varie les bonnes réponses (ne les mets pas toujours en position A ou B)
- Assure-toi qu'elles soient distribuées équitablement entre A, B, C et D
- Les options doivent être plausibles pour tester vraiment la compréhension

Format de sortie : JSON avec cette structure exacte :
{
  "questions": [
    {
      "type": "mcq" | "open",
      "question": "La question ici",
      "options": ["Option A", "Option B", "Option C", "Option D"], // seulement pour MCQ
      "correctAnswer": "Option B", // pour MCQ, l'option COMPLÈTE qui est correcte (pas juste la lettre)
      "explanation": "Explication de la réponse correcte"
    }
  ]
}

Pour les questions ouvertes, ne mets pas de "correctAnswer" mais fournis une "explanation" avec les points clés attendus dans la réponse.`
        },
        {
          role: 'user',
          content: `Crée un quiz pour le cours suivant :

Titre : ${courseTitle}

Contenu :
${courseContent}`
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const quizContent = data.choices?.[0]?.message?.content;

  if (!quizContent) {
    throw new Error('No quiz generated from OpenRouter API');
  }

  const quiz = JSON.parse(quizContent);
  return quiz;
}

export async function evaluateOpenAnswer(question: string, userAnswer: string, expectedPoints: string): Promise<{ score: number; feedback: string }> {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://corrigetescours.com',
      'X-Title': 'Corrige Tes Cours',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1',
      messages: [
        {
          role: 'system',
          content: `Tu es un professeur bienveillant qui évalue les réponses d'étudiants de manière encourageante.

RÈGLES D'ÉVALUATION BIENVEILLANTE :
✅ Une réponse courte mais qui contient les éléments essentiels mérite une très bonne note (80-100)
✅ Si les mots-clés principaux sont présents, la note doit être élevée (70-100)
✅ La forme de la réponse importe moins que le fond
✅ Une réponse concise et précise vaut autant qu'une réponse détaillée
✅ Valorise la compréhension même si l'expression n'est pas parfaite

❌ Si la réponse est vide ou hors-sujet, la note est 0
❌ Si la réponse ne contient aucun élément pertinent, la note est 0-20

BARÈME :
- 90-100 : Excellente compréhension, tous les points clés présents
- 70-89 : Bonne compréhension, la plupart des points clés présents
- 50-69 : Compréhension partielle, quelques points clés présents
- 30-49 : Compréhension limitée, peu de points clés
- 0-29 : Réponse inappropriée ou vide

Sois OBJECTIF et BIENVEILLANT, mais n'hésite pas à donner 0 si la réponse est vide.

Format de sortie : JSON avec cette structure exacte :
{
  "score": 85,
  "feedback": "Excellent travail ! Tu as bien saisi les concepts principaux. Points forts : [liste]. Pour améliorer : [suggestions]"
}`
        },
        {
          role: 'user',
          content: `Question : ${question}

Points clés attendus : ${expectedPoints}

Réponse de l'étudiant : ${userAnswer || "(réponse vide)"}

Évalue cette réponse en suivant les règles bienveillantes.`
        }
      ],
      temperature: 0.5,
      max_tokens: 500,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const evaluationContent = data.choices?.[0]?.message?.content;

  if (!evaluationContent) {
    throw new Error('No evaluation generated from OpenRouter API');
  }

  const evaluation = JSON.parse(evaluationContent);
  return evaluation;
}

export async function chatWithAI(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: `Tu es Tariq, un assistant éducatif intelligent et motivant pour les étudiants universitaires camerounais.

Ta personnalité :
- Tu es confiant, intelligent et toujours focalisé sur la réussite de l'étudiant
- Tu comprends les défis des étudiants et tu les motives à exceller
- Tu es direct mais bienveillant, comme un grand frère qui veut voir l'étudiant réussir
- Tu utilises parfois des expressions qui montrent ta détermination ("On va cartonner ça!", "Tu vas maîtriser ce concept")

Ton rôle :
- Aider les étudiants à comprendre leurs cours et réviser efficacement
- Expliquer les concepts difficiles de manière simple et claire avec des exemples concrets
- Donner des techniques de révision et de mémorisation efficaces
- Motiver l'étudiant à croire en son potentiel et à viser l'excellence
- Répondre en français avec un ton amical, motivant et pédagogique

Directives :
- Adapte tes explications au niveau universitaire camerounais
- Utilise des exemples concrets et pertinents au contexte local
- Si la question n'est pas claire, demande des précisions
- Encourage toujours l'étudiant avec des phrases motivantes
- Reste concis mais complet dans tes réponses
- N'hésite pas à rappeler à l'étudiant qu'il peut réussir s'il travaille intelligemment`
    },
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage
    }
  ];

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://corrigetescours.com',
      'X-Title': 'Corrige Tes Cours',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const aiResponse = data.choices?.[0]?.message?.content;

  if (!aiResponse) {
    throw new Error('No response generated from OpenRouter API');
  }

  return aiResponse;
}
