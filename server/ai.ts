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
          
Ton objectif est de synthétiser le contenu du cours en un résumé concis qui :
- Identifie les concepts clés et les points essentiels
- Organise l'information de manière logique avec des titres et sous-titres
- Utilise des listes à puces pour faciliter la révision
- Explique les termes techniques de manière accessible
- Met en évidence les définitions importantes
- Conserve les formules, théorèmes ou exemples cruciaux

Format de sortie : Markdown avec une structure claire (# pour titres, ## pour sous-titres, - pour listes).`
        },
        {
          role: 'user',
          content: `Crée un résumé structuré et complet du cours suivant :

Titre du cours : ${courseTitle}

Contenu :
${courseContent}`
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

  return summary;
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

Format de sortie : JSON avec cette structure exacte :
{
  "questions": [
    {
      "type": "mcq" | "open",
      "question": "La question ici",
      "options": ["A", "B", "C", "D"], // seulement pour MCQ
      "correctAnswer": "B", // pour MCQ, l'option correcte (A, B, C, ou D)
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
          content: `Tu es un correcteur bienveillant qui évalue les réponses d'étudiants.

Évalue la réponse de l'étudiant selon ces critères :
- Pertinence par rapport à la question
- Présence des points clés attendus
- Clarté et précision de l'explication

Donne un score de 0 à 100 et un feedback constructif.

Format de sortie : JSON avec cette structure exacte :
{
  "score": 85,
  "feedback": "Ton explication détaillée ici avec les points forts et axes d'amélioration"
}`
        },
        {
          role: 'user',
          content: `Question : ${question}

Points clés attendus : ${expectedPoints}

Réponse de l'étudiant : ${userAnswer}

Évalue cette réponse.`
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
