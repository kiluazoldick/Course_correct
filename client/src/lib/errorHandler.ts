import { translations } from './i18n/translations';

type ErrorTranslations = typeof translations.fr.errors;

export function getErrorMessage(
  error: any,
  lang: 'fr' | 'en' = 'fr'
): string {
  const t = translations[lang].errors as ErrorTranslations;

  if (!error) {
    return t.generic;
  }

  const message = error?.message || error?.error || '';
  const status = error?.status || error?.statusCode;

  if (!navigator.onLine) {
    return t.network;
  }

  if (status === 401 || message.includes('authentifié') || message.includes('unauthorized') || message.includes('Unauthorized')) {
    return t.unauthorized;
  }

  if (status === 403 || message.includes('Forbidden') || message.includes('forbidden') || message.includes('accès')) {
    return t.forbidden;
  }

  if (status === 404 || message.includes('not found') || message.includes('introuvable') || message.includes('Not Found')) {
    return t.notFound;
  }

  if (status === 413 || message.includes('trop volumineux') || message.includes('too large') || message.includes('size')) {
    return t.fileTooLarge;
  }

  if (status === 429 || message.includes('limite') || message.includes('limit')) {
    if (message.includes('upload') || message.includes('envoi') || message.includes('fichier')) {
      return t.uploadLimitReached;
    }
    if (message.includes('message') || message.includes('chat')) {
      return t.chatLimitReached;
    }
    return t.uploadLimitReached;
  }

  if (message.includes('upload') || message.includes('envoi') || message.includes('fichier')) {
    if (message.includes('type') || message.includes('format')) {
      return t.invalidFileType;
    }
    return t.uploadFailed;
  }

  if (message.includes('quiz') || message.includes('Quiz')) {
    return t.quizGenerationFailed;
  }

  if (message.includes('summary') || message.includes('résumé') || message.includes('Résumé')) {
    return t.summaryGenerationFailed;
  }

  if (message.includes('payment') || message.includes('paiement') || message.includes('Paiement')) {
    return t.paymentFailed;
  }

  if (message.includes('session') || message.includes('Session') || message.includes('expired')) {
    return t.sessionExpired;
  }

  if (message.includes('validation') || message.includes('Invalid') || message.includes('invalid') || message.includes('Zod')) {
    return t.validation;
  }

  if (message.includes('AI') || message.includes('IA') || message.includes('OpenRouter') || message.includes('model')) {
    return t.aiUnavailable;
  }

  if (status >= 500 || message.includes('Failed') || message.includes('Échec') || message.includes('error')) {
    return t.generic;
  }

  return t.generic;
}

export function handleApiError(
  error: any,
  lang: 'fr' | 'en' = 'fr'
): { title: string; description: string } {
  const t = translations[lang];
  const description = getErrorMessage(error, lang);
  
  return {
    title: lang === 'fr' ? 'Erreur' : 'Error',
    description,
  };
}
