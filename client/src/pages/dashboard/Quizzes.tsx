import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { type Quiz, type Course } from '@shared/schema';
import { Brain, CheckCircle2, XCircle, PlayCircle, Trophy, BookOpen, Sparkles, Trash2, Loader2, Star } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { queryClient, apiRequest } from '@/lib/queryClient';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getErrorMessage } from '@/lib/errorHandler';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuizQuestion {
  type: 'mcq' | 'open';
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
}

export default function Quizzes() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [quizType, setQuizType] = useState<'mcq' | 'open' | 'mixed'>('mixed');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { data: quizzes = [] } = useQuery<Quiz[]>({
    queryKey: ['/api/quizzes'],
  });

  const generateQuizMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCourse) throw new Error(t.quizzesPage.selectCourse);
      const response = await apiRequest('POST', `/api/courses/${selectedCourse}/generate-quiz`, { type: quizType });
      return await response.json();
    },
    onSuccess: (data) => {
      setCurrentQuiz(data);
      setIsQuizOpen(true);
      setCurrentQuestionIndex(0);
      setAnswers(new Array((data.questions as QuizQuestion[]).length).fill(''));
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes'] });
      toast({
        title: t.quizzesPage.quizGenerated,
        description: t.quizzesPage.quizGeneratedDesc,
      });
    },
    onError: (error: any) => {
      toast({
        title: t.quizzesPage.error,
        description: getErrorMessage(error, language),
        variant: 'destructive',
      });
    },
  });

  const evaluateQuizMutation = useMutation({
    mutationFn: async ({ quizId, answers }: { quizId: string; answers: string[] }) => {
      const response = await apiRequest('POST', `/api/quizzes/${quizId}/evaluate`, { answers });
      return await response.json();
    },
    onSuccess: (data) => {
      setQuizResult(data);
      setIsQuizOpen(false);
      setIsResultOpen(true);
      queryClient.invalidateQueries({ queryKey: ['/api/quiz-results'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
    },
    onError: (error: any) => {
      toast({
        title: t.quizzesPage.error,
        description: getErrorMessage(error, language),
        variant: 'destructive',
      });
    },
  });

  const deleteQuizMutation = useMutation({
    mutationFn: async (quizId: string) => {
      const response = await apiRequest('DELETE', `/api/quizzes/${quizId}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quiz-results'] });
      toast({
        title: t.quizzesPage.quizDeleted,
        description: t.quizzesPage.quizDeletedDesc,
      });
      setIsDeleteDialogOpen(false);
      setQuizToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: t.quizzesPage.error,
        description: getErrorMessage(error, language),
        variant: 'destructive',
      });
    },
  });

  const handleDeleteQuiz = (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteQuiz = () => {
    if (quizToDelete) {
      deleteQuizMutation.mutate(quizToDelete.id);
    }
  };

  const handleGenerateQuiz = () => {
    generateQuizMutation.mutate();
  };

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < (currentQuiz.questions as QuizQuestion[]).length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;
    
    const unansweredCount = answers.filter(a => !a || a.trim() === '').length;
    if (unansweredCount > 0) {
      toast({
        title: t.quizzesPage.unansweredQuestions,
        description: t.quizzesPage.unansweredQuestionsDesc.replace('{count}', String(unansweredCount)),
        variant: 'destructive',
      });
      return;
    }

    evaluateQuizMutation.mutate({
      quizId: currentQuiz.id,
      answers,
    });
  };

  const currentQuestion = currentQuiz ? (currentQuiz.questions as QuizQuestion[])[currentQuestionIndex] : null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Compact on mobile */}
      <div>
        <h1 className="text-xl md:text-3xl font-bold" data-testid="text-quizzes-title">{t.quizzesPage.title}</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-0.5 md:mt-1">{t.quizzesPage.subtitle}</p>
      </div>

      {/* Quiz Generator Section - Compact on mobile */}
      <Card>
        <CardHeader className="p-4 md:p-6 pb-2 md:pb-4">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg" data-testid="card-title-generate-quiz">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
            {t.quizzesPage.generateQuiz}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm" data-testid="card-description-generate-quiz">
            {t.quizzesPage.generateQuizDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-2 md:pt-4 space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-sm" data-testid="label-course">{t.quizzesPage.selectCourse}</Label>
              <Select value={selectedCourse || ''} onValueChange={setSelectedCourse}>
                <SelectTrigger className="h-9 md:h-10 text-sm" data-testid="select-course">
                  <SelectValue placeholder={t.quizzesPage.selectCoursePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id} data-testid={`select-item-course-${course.id}`}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-sm" data-testid="label-quiz-type">{t.quizzesPage.quizType}</Label>
              <Select value={quizType} onValueChange={(value: any) => setQuizType(value)}>
                <SelectTrigger className="h-9 md:h-10 text-sm" data-testid="select-quiz-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq" data-testid="select-item-quiz-type-mcq">{t.quizzesPage.mcq}</SelectItem>
                  <SelectItem value="open" data-testid="select-item-quiz-type-open">{t.quizzesPage.openEnded}</SelectItem>
                  <SelectItem value="mixed" data-testid="select-item-quiz-type-mixed">{t.quizzesPage.mixed}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 md:p-6 pt-0">
          <Button
            onClick={handleGenerateQuiz}
            disabled={!selectedCourse || generateQuizMutation.isPending}
            className="w-full md:w-auto h-9 md:h-10 text-sm"
            data-testid="button-generate-quiz"
          >
            <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 flex-shrink-0" />
            {generateQuizMutation.isPending ? t.quizzesPage.generating : t.quizzesPage.generate}
          </Button>
        </CardFooter>
      </Card>

      {/* Previous Quizzes - Compact cards on mobile */}
      {quizzes.length > 0 && (
        <div>
          <h2 className="text-base md:text-xl font-semibold mb-3 md:mb-4" data-testid="text-previous-quizzes">{t.quizzesPage.recentQuizzes}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover-elevate" data-testid={`card-quiz-${quiz.id}`}>
                <CardHeader className="p-3 md:p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm md:text-base truncate" data-testid={`card-title-quiz-${quiz.id}`}>{quiz.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1.5 mt-0.5 md:mt-1 text-xs md:text-sm" data-testid={`card-description-quiz-${quiz.id}`}>
                        <BookOpen className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        {(quiz.questions as QuizQuestion[]).length} {t.quizzesPage.questions}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteQuiz(quiz)}
                      className="text-muted-foreground hover:text-destructive h-7 w-7 md:h-8 md:w-8 flex-shrink-0"
                      data-testid={`button-delete-quiz-${quiz.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardFooter className="p-3 md:p-4 pt-1 md:pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentQuiz(quiz);
                      setIsQuizOpen(true);
                      setCurrentQuestionIndex(0);
                      setAnswers(new Array((quiz.questions as QuizQuestion[]).length).fill(''));
                    }}
                    className="w-full h-8 md:h-9 text-xs md:text-sm"
                    data-testid={`button-take-quiz-${quiz.id}`}
                  >
                    <PlayCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 flex-shrink-0" />
                    {t.quizzesPage.takeQuiz}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Dialog - Mobile optimized */}
      <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader className="space-y-1 md:space-y-2">
            <DialogTitle className="flex items-center gap-2 text-base md:text-lg" data-testid="dialog-title-quiz">
              <Brain className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
              <span className="truncate">{currentQuiz?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm" data-testid="dialog-description-quiz">
              {t.quizzesPage.question} {currentQuestionIndex + 1} {t.quizzesPage.of} {currentQuiz ? (currentQuiz.questions as QuizQuestion[]).length : 0}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Bar - Compact on mobile */}
          {currentQuiz && (
            <div className="space-y-1.5 md:space-y-2">
              <Progress 
                value={((currentQuestionIndex + 1) / (currentQuiz.questions as QuizQuestion[]).length) * 100} 
                className="h-1.5 md:h-2"
              />
              <div className="flex gap-0.5 md:gap-1 justify-center flex-wrap">
                {(currentQuiz.questions as QuizQuestion[]).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                      idx === currentQuestionIndex 
                        ? 'bg-primary ring-1 md:ring-2 ring-primary/30 scale-110' 
                        : answers[idx] 
                          ? 'bg-green-500' 
                          : 'bg-muted'
                    }`}
                    data-testid={`progress-dot-${idx}`}
                  />
                ))}
              </div>
            </div>
          )}

          {currentQuestion && (
            <div className="space-y-3 md:space-y-4">
              <div className="prose prose-sm dark:prose-invert">
                <p className="font-medium text-sm md:text-base" data-testid={`text-question-${currentQuestionIndex}`}>
                  {currentQuestion.question}
                </p>
              </div>

              {currentQuestion.type === 'mcq' && currentQuestion.options ? (
                <RadioGroup value={answers[currentQuestionIndex]} onValueChange={handleAnswerChange}>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors" data-testid={`radio-option-${index}`}>
                      <RadioGroupItem value={option} id={`option-${index}`} className="flex-shrink-0" data-testid={`radio-item-option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 text-sm md:text-base" data-testid={`label-option-${index}`}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <Textarea
                  value={answers[currentQuestionIndex] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder={t.quizzesPage.answerPlaceholder}
                  rows={4}
                  className="text-sm md:text-base"
                  data-testid={`textarea-answer-${currentQuestionIndex}`}
                />
              )}
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between gap-2 pt-2">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex-1 sm:flex-none h-9 text-sm"
                data-testid="button-previous-question"
              >
                {t.quizzesPage.previous}
              </Button>
              {currentQuiz && currentQuestionIndex < (currentQuiz.questions as QuizQuestion[]).length - 1 ? (
                <Button onClick={handleNextQuestion} className="flex-1 sm:flex-none h-9 text-sm" data-testid="button-next-question">
                  {t.quizzesPage.next}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={evaluateQuizMutation.isPending}
                  className="flex-1 sm:flex-none h-9 text-sm"
                  data-testid="button-submit-quiz"
                >
                  {evaluateQuizMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      {t.quizzesPage.submitting}
                    </>
                  ) : t.quizzesPage.submit}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Dialog - Mobile optimized */}
      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base md:text-lg" data-testid="dialog-title-results">
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
              {t.quizzesPage.results}
            </DialogTitle>
          </DialogHeader>

          {quizResult && (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center p-4 md:p-6 bg-muted rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2" data-testid="text-score-label">{t.quizzesPage.score}</p>
                <p className={`text-3xl md:text-5xl font-bold ${getScoreColor(quizResult.finalScore)}`} data-testid="text-final-score">
                  {quizResult.finalScore}%
                </p>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h3 className="font-semibold text-sm md:text-lg" data-testid="text-answer-details">
                  {t.quizzesPage.answerDetails}
                </h3>
                {quizResult.evaluations.map((evaluation: any, index: number) => {
                  const question = currentQuiz ? (currentQuiz.questions as QuizQuestion[])[evaluation.questionIndex] : null;
                  if (!question) return null;

                  return (
                    <Card key={index} data-testid={`card-evaluation-${index}`}>
                      <CardHeader className="p-3 md:p-4 pb-2">
                        <CardTitle className="text-sm md:text-base flex items-center gap-2" data-testid={`card-title-evaluation-${index}`}>
                          {evaluation.isCorrect !== undefined ? (
                            evaluation.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" data-testid={`icon-correct-${index}`} />
                            ) : (
                              <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" data-testid={`icon-incorrect-${index}`} />
                            )
                          ) : (
                            <div className={`w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full flex-shrink-0 ${
                              evaluation.score >= 80 ? 'bg-green-600' : evaluation.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                            } text-white text-[10px] md:text-xs font-bold`} data-testid={`badge-score-${index}`}>
                              {evaluation.score}
                            </div>
                          )}
                          {t.quizzesPage.question} {index + 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 md:p-4 pt-0 space-y-2 md:space-y-3">
                        <div>
                          <p className="font-medium text-sm md:text-base" data-testid={`text-evaluation-question-${index}`}>{question.question}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground" data-testid={`text-user-answer-label-${index}`}>{t.quizzesPage.yourAnswerLabel} :</p>
                          <p className="text-xs md:text-sm" data-testid={`text-user-answer-${index}`}>{evaluation.userAnswer}</p>
                        </div>
                        {evaluation.correctAnswer && (
                          <div>
                            <p className="text-xs md:text-sm text-muted-foreground" data-testid={`text-correct-answer-label-${index}`}>{t.quizzesPage.correctAnswerLabel} :</p>
                            <p className="text-xs md:text-sm font-medium text-green-600 dark:text-green-400" data-testid={`text-correct-answer-${index}`}>
                              {evaluation.correctAnswer}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground" data-testid={`text-explanation-label-${index}`}>{t.quizzesPage.feedback} :</p>
                          <div className="text-xs md:text-sm prose prose-sm dark:prose-invert" data-testid={`text-explanation-${index}`}>
                            <ReactMarkdown>
                              {evaluation.feedback || evaluation.explanation}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button onClick={() => setIsResultOpen(false)} className="w-full sm:w-auto h-9 text-sm" data-testid="button-close-results">
              {t.quizzesPage.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - Mobile optimized */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md p-4 md:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base md:text-lg" data-testid="dialog-title-delete-quiz">
              {t.quizzesPage.deleteQuizConfirm}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm" data-testid="dialog-description-delete-quiz">
              {t.quizzesPage.deleteQuizConfirmDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0 h-9 text-sm" data-testid="button-cancel-delete-quiz">
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteQuiz}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 text-sm"
              disabled={deleteQuizMutation.isPending}
              data-testid="button-confirm-delete-quiz"
            >
              {deleteQuizMutation.isPending ? t.loading : t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
