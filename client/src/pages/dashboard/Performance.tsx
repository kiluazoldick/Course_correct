import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type QuizResult, type Quiz, type Course } from '@shared/schema';
import { TrendingUp, Award, Target, BookOpen } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Performance() {
  const { data: quizResults = [] } = useQuery<QuizResult[]>({
    queryKey: ['/api/quiz-results'],
  });

  const { data: quizzes = [] } = useQuery<Quiz[]>({
    queryKey: ['/api/quizzes'],
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Calculate statistics
  const totalQuizzes = quizResults.length;
  const averageScore = totalQuizzes > 0
    ? Math.round(quizResults.reduce((sum, result) => sum + result.score, 0) / totalQuizzes)
    : 0;
  const highestScore = totalQuizzes > 0
    ? Math.max(...quizResults.map(r => r.score))
    : 0;
  const totalCourses = courses.length;

  // Prepare chart data
  const scoreDistribution = [
    { name: 'Excellent (80-100%)', value: quizResults.filter(r => r.score >= 80).length, color: '#10b981' },
    { name: 'Bon (60-79%)', value: quizResults.filter(r => r.score >= 60 && r.score < 80).length, color: '#f59e0b' },
    { name: 'À améliorer (<60%)', value: quizResults.filter(r => r.score < 60).length, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const recentScores = quizResults
    .slice(-10)
    .map((result, index) => {
      const quiz = quizzes.find(q => q.id === result.quizId);
      return {
        name: `Quiz ${index + 1}`,
        score: result.score,
        title: quiz?.title || 'Quiz',
      };
    });

  const coursePerformance = courses.map(course => {
    const courseResults = quizResults.filter(r => r.courseId === course.id);
    const avgScore = courseResults.length > 0
      ? Math.round(courseResults.reduce((sum, r) => sum + r.score, 0) / courseResults.length)
      : 0;
    return {
      name: course.title.length > 20 ? course.title.substring(0, 20) + '...' : course.title,
      score: avgScore,
      quizCount: courseResults.length,
    };
  }).filter(c => c.quizCount > 0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-performance-title">Performances</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Visualisez vos progrès et restez motivé</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" data-testid="card-title-quizzes-completed">Quiz complétés</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-quizzes">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground" data-testid="text-active-courses-count">
              {totalCourses} cours actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" data-testid="card-title-average-score">Score moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`} data-testid="text-average-score">
              {averageScore}%
            </div>
            <p className="text-xs text-muted-foreground" data-testid="text-average-score-description">
              Sur tous les quiz
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" data-testid="card-title-highest-score">Meilleur score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(highestScore)}`} data-testid="text-highest-score">
              {highestScore}%
            </div>
            <p className="text-xs text-muted-foreground" data-testid="text-highest-score-description">
              Record personnel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" data-testid="card-title-courses-studied">Cours étudiés</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-courses">{totalCourses}</div>
            <p className="text-xs text-muted-foreground" data-testid="text-total-courses-description">
              Matières actives
            </p>
          </CardContent>
        </Card>
      </div>

      {totalQuizzes === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground" data-testid="text-no-performance-data">Aucune donnée de performance</p>
              <p className="text-sm text-muted-foreground mt-2" data-testid="text-no-performance-instructions">
                Complétez des quiz pour voir vos statistiques
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution */}
            {scoreDistribution.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle data-testid="card-title-score-distribution">Distribution des scores</CardTitle>
                  <CardDescription data-testid="card-description-score-distribution">Répartition de vos performances</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300} data-testid="chart-score-distribution">
                    <PieChart>
                      <Pie
                        data={scoreDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Recent Scores Trend */}
            {recentScores.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle data-testid="card-title-recent-evolution">Évolution récente</CardTitle>
                  <CardDescription data-testid="card-description-recent-evolution">Vos derniers scores de quiz</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300} data-testid="chart-recent-scores">
                    <LineChart data={recentScores}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg" data-testid="tooltip-recent-score">
                                <p className="font-medium" data-testid="tooltip-quiz-title">{payload[0].payload.title}</p>
                                <p className="text-sm text-muted-foreground" data-testid="tooltip-quiz-score">
                                  Score: {payload[0].value}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Performance by Course */}
          {coursePerformance.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle data-testid="card-title-performance-by-course">Performance par cours</CardTitle>
                <CardDescription data-testid="card-description-performance-by-course">Scores moyens pour chaque matière</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400} data-testid="chart-course-performance">
                  <BarChart data={coursePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg" data-testid="tooltip-course-performance">
                              <p className="font-medium" data-testid="tooltip-course-name">{payload[0].payload.name}</p>
                              <p className="text-sm text-muted-foreground" data-testid="tooltip-course-avg-score">
                                Score moyen: {payload[0].value}%
                              </p>
                              <p className="text-sm text-muted-foreground" data-testid="tooltip-course-quiz-count">
                                Quiz: {payload[0].payload.quizCount}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Recent Quiz Results */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="card-title-quiz-history">Historique des quiz</CardTitle>
              <CardDescription data-testid="card-description-quiz-history">Vos derniers résultats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quizResults.slice(-5).reverse().map((result) => {
                  const quiz = quizzes.find(q => q.id === result.quizId);
                  const course = courses.find(c => c.id === result.courseId);
                  return (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      data-testid={`quiz-result-${result.id}`}
                    >
                      <div>
                        <p className="font-medium" data-testid={`text-quiz-title-${result.id}`}>{quiz?.title || 'Quiz'}</p>
                        <p className="text-sm text-muted-foreground" data-testid={`text-quiz-info-${result.id}`}>
                          {course?.title || 'Cours'} • {result.totalQuestions} questions
                        </p>
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(result.score)}`} data-testid={`text-quiz-score-${result.id}`}>
                        {result.score}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
