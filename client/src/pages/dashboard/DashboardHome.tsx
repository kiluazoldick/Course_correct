import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookOpen, Brain, TrendingUp } from 'lucide-react';
import { type Course, type Quiz, type QuizResult } from '@shared/schema';

export default function DashboardHome() {
  const { user } = useAuth();

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { data: quizzes = [] } = useQuery<Quiz[]>({
    queryKey: ['/api/quizzes'],
  });

  const { data: quizResults = [] } = useQuery<QuizResult[]>({
    queryKey: ['/api/quiz-results'],
  });

  const totalCourses = courses.length;
  const totalQuizzes = quizResults.length;
  const averageScore = totalQuizzes > 0
    ? Math.round(quizResults.reduce((sum, result) => sum + result.score, 0) / totalQuizzes)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold" data-testid="text-welcome-title">
          Bienvenue{user?.firstName ? `, ${user.firstName}` : ''} !
        </h2>
        <p className="text-muted-foreground mt-2" data-testid="text-welcome-subtitle">
          Prêt à booster ta réussite aujourd'hui ?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card data-testid="card-stat-courses">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-courses-count">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">cours enregistrés</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-quizzes">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Quiz</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-quizzes-count">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">quiz complétés</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-performance">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalQuizzes > 0 ? getScoreColor(averageScore) : ''}`} data-testid="text-avg-score">
              {totalQuizzes > 0 ? `${averageScore}%` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">score moyen</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle data-testid="text-getting-started-title">Pour commencer</CardTitle>
          <CardDescription>Découvre les fonctionnalités principales de Corrige Tes Cours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Créer un cours</h3>
              <p className="text-sm text-muted-foreground">
                Commence par créer ton premier cours pour profiter des résumés IA et des quiz personnalisés.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Générer un quiz</h3>
              <p className="text-sm text-muted-foreground">
                Une fois ton cours créé, génère automatiquement un quiz adapté à ton niveau.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Suivre tes progrès</h3>
              <p className="text-sm text-muted-foreground">
                Visualise ton évolution et reste motivé grâce aux statistiques détaillées.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
