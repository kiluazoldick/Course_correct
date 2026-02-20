import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, TrendingUp, Layers, ChevronRight, Plus, Upload } from 'lucide-react';
import { type Course, type Quiz, type QuizResult } from '@shared/schema';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useLocation } from 'wouter';

type FlashcardSet = {
  id: string;
  courseId: string;
  userId: string;
  cards: Array<{ front: string; back: string }>;
  totalCards: number;
  masteredCards: number;
  createdAt: string;
};

export default function DashboardHome() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { data: quizResults = [] } = useQuery<QuizResult[]>({
    queryKey: ['/api/quiz-results'],
  });

  const { data: flashcardSets = [] } = useQuery<FlashcardSet[]>({
    queryKey: ['/api/flashcard-sets'],
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

  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const flashcardsToReview = flashcardSets.filter(set => set.masteredCards < set.totalCards);
  const totalFlashcardsToReview = flashcardsToReview.reduce(
    (sum, set) => sum + (set.totalCards - set.masteredCards), 0
  );

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

      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
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

        <Card data-testid="card-stat-flashcards">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.flashcardsToReview}</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-flashcards-to-review">
              {totalFlashcardsToReview}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'fr' ? 'cartes a reviser' : 'cards to review'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">{t.dashboard.recentCourses}</CardTitle>
            </div>
            {courses.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setLocation('/courses')} data-testid="button-view-all-courses">
                {t.dashboard.viewAll}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {recentCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t.dashboard.noCourses}</p>
                <Button variant="outline" size="sm" onClick={() => setLocation('/courses')} data-testid="button-add-first-course">
                  <Plus className="w-4 h-4 mr-1" />
                  {t.dashboard.addFirstCourse}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-md hover-elevate cursor-pointer"
                    onClick={() => setLocation(`/courses/${course.id}`)}
                    data-testid={`dashboard-course-${course.id}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{course.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.subject && `${course.subject} · `}
                        {new Date(course.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">{t.dashboard.flashcardsToReview}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {flashcardsToReview.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Layers className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t.dashboard.noFlashcardsToReview}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {flashcardsToReview.slice(0, 3).map((set) => {
                  const remaining = set.totalCards - set.masteredCards;
                  const progress = set.totalCards > 0 ? (set.masteredCards / set.totalCards) * 100 : 0;
                  return (
                    <div
                      key={set.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-md hover-elevate cursor-pointer"
                      onClick={() => setLocation(`/courses/${set.courseId}`)}
                      data-testid={`dashboard-flashcard-${set.id}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {remaining} {language === 'fr' ? 'a revoir' : 'to review'}
                          </Badge>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" data-testid={`button-review-${set.id}`}>
                        {t.dashboard.startReview}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {totalCourses === 0 && (
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-getting-started-title">{t.gettingStarted.title}</CardTitle>
            <CardDescription>{t.gettingStarted.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t.gettingStarted.createCourse}</h3>
                <p className="text-sm text-muted-foreground">{t.gettingStarted.createCourseDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t.gettingStarted.generateQuiz}</h3>
                <p className="text-sm text-muted-foreground">{t.gettingStarted.generateQuizDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t.gettingStarted.trackProgress}</h3>
                <p className="text-sm text-muted-foreground">{t.gettingStarted.trackProgressDesc}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
