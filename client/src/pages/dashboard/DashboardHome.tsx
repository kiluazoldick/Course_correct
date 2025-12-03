import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookOpen, Brain, TrendingUp } from 'lucide-react';
import { type Course, type Quiz, type QuizResult } from '@shared/schema';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function DashboardHome() {
  const { user } = useAuth();
  const { t } = useLanguage();

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
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-welcome-title">
          {t.dashboard.welcome}{user?.firstName ? `, ${user.firstName}` : ''} !
        </h2>
        <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base" data-testid="text-welcome-subtitle">
          {t.dashboard.welcomeSubtitle}
        </p>
      </div>

      <div className="grid gap-3 md:gap-6 md:grid-cols-3">
        <Card data-testid="card-stat-courses">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.myCourses}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-courses-count">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">{t.dashboard.coursesRegistered}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-quizzes">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.myQuizzes}</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-quizzes-count">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">{t.dashboard.quizzesCompleted}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-performance">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.averageScore}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalQuizzes > 0 ? getScoreColor(averageScore) : ''}`} data-testid="text-avg-score">
              {totalQuizzes > 0 ? `${averageScore}%` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">{t.dashboard.scoreAverage}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle data-testid="text-getting-started-title">{t.gettingStarted.title}</CardTitle>
          <CardDescription>{t.gettingStarted.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{t.gettingStarted.createCourse}</h3>
              <p className="text-sm text-muted-foreground">
                {t.gettingStarted.createCourseDesc}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{t.gettingStarted.generateQuiz}</h3>
              <p className="text-sm text-muted-foreground">
                {t.gettingStarted.generateQuizDesc}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{t.gettingStarted.trackProgress}</h3>
              <p className="text-sm text-muted-foreground">
                {t.gettingStarted.trackProgressDesc}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
