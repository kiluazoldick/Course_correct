import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { type Quiz, type Course } from '@shared/schema';
import { Brain, CheckCircle2, XCircle, PlayCircle, Trophy, BookOpen, Sparkles } from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import ReactMarkdown from 'react-markdown';
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
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [quizType, setQuizType] = useState<'mcq' | 'open' | 'mixed'>('mixed');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { data: quizzes = [] } = useQuery<Quiz[]>({
    queryKey: ['/api/quizzes'],
  });

  const generateQuizMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCourse) throw new Error('Veuillez sélectionner un cours');
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
        title: 'Quiz généré',
        description: 'Votre quiz intelligent est prêt !',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error?.message || 'Impossible de générer le quiz.',
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
        title: 'Erreur',
        description: error?.message || 'Impossible d\'évaluer le quiz.',
        variant: 'destructive',
      });
    },
  });

  const handleGenerateQuiz = () => {
    setIsGenerating(true);
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
        title: 'Questions non répondues',
        description: `Il reste ${unansweredCount} question(s) sans réponse.`,
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-quizzes-title">Quiz Intelligents</h1>
          <p className="text-muted-foreground mt-1">Testez vos connaissances avec des quiz générés par IA</p>
        </div>
      </div>

      {/* Quiz Generator Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" data-testid="card-title-generate-quiz">
            <Sparkles className="w-5 h-5 text-primary" />
            Générer un nouveau quiz
          </CardTitle>
          <CardDescription data-testid="card-description-generate-quiz">
            Sélectionnez un cours et le type de quiz que vous souhaitez générer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label data-testid="label-course">Cours</Label>
              <Select value={selectedCourse || ''} onValueChange={setSelectedCourse}>
                <SelectTrigger data-testid="select-course">
                  <SelectValue placeholder="Choisir un cours" />
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
            <div className="space-y-2">
              <Label data-testid="label-quiz-type">Type de quiz</Label>
              <Select value={quizType} onValueChange={(value: any) => setQuizType(value)}>
                <SelectTrigger data-testid="select-quiz-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq" data-testid="select-item-quiz-type-mcq">QCM uniquement</SelectItem>
                  <SelectItem value="open" data-testid="select-item-quiz-type-open">Questions ouvertes</SelectItem>
                  <SelectItem value="mixed" data-testid="select-item-quiz-type-mixed">Mixte (QCM + Ouvertes)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerateQuiz}
            disabled={!selectedCourse || generateQuizMutation.isPending}
            className="w-full md:w-auto"
            data-testid="button-generate-quiz"
          >
            <Brain className="w-4 h-4 mr-2" />
            {generateQuizMutation.isPending ? 'Génération en cours...' : 'Générer le quiz'}
          </Button>
        </CardFooter>
      </Card>

      {/* Previous Quizzes */}
      {quizzes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4" data-testid="text-previous-quizzes">Quiz précédents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover-elevate" data-testid={`card-quiz-${quiz.id}`}>
                <CardHeader>
                  <CardTitle className="text-base" data-testid={`card-title-quiz-${quiz.id}`}>{quiz.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2" data-testid={`card-description-quiz-${quiz.id}`}>
                    <BookOpen className="w-4 h-4" />
                    {(quiz.questions as QuizQuestion[]).length} questions
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentQuiz(quiz);
                      setIsQuizOpen(true);
                      setCurrentQuestionIndex(0);
                      setAnswers(new Array((quiz.questions as QuizQuestion[]).length).fill(''));
                    }}
                    className="w-full"
                    data-testid={`button-take-quiz-${quiz.id}`}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Passer le quiz
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Dialog */}
      <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" data-testid="dialog-title-quiz">
              <Brain className="w-5 h-5 text-primary" />
              {currentQuiz?.title}
            </DialogTitle>
            <DialogDescription data-testid="dialog-description-quiz">
              Question {currentQuestionIndex + 1} sur {currentQuiz ? (currentQuiz.questions as QuizQuestion[]).length : 0}
            </DialogDescription>
          </DialogHeader>

          {currentQuestion && (
            <div className="space-y-4">
              <div className="prose prose-sm dark:prose-invert">
                <p className="font-medium text-base" data-testid={`text-question-${currentQuestionIndex}`}>
                  {currentQuestion.question}
                </p>
              </div>

              {currentQuestion.type === 'mcq' && currentQuestion.options ? (
                <RadioGroup value={answers[currentQuestionIndex]} onValueChange={handleAnswerChange}>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2" data-testid={`radio-option-${index}`}>
                      <RadioGroupItem value={option} id={`option-${index}`} data-testid={`radio-item-option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1" data-testid={`label-option-${index}`}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <Textarea
                  value={answers[currentQuestionIndex] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Entrez votre réponse ici..."
                  rows={5}
                  data-testid={`textarea-answer-${currentQuestionIndex}`}
                />
              )}
            </div>
          )}

          <DialogFooter className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                data-testid="button-previous-question"
              >
                Précédent
              </Button>
              {currentQuiz && currentQuestionIndex < (currentQuiz.questions as QuizQuestion[]).length - 1 ? (
                <Button onClick={handleNextQuestion} data-testid="button-next-question">
                  Suivant
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={evaluateQuizMutation.isPending}
                  data-testid="button-submit-quiz"
                >
                  {evaluateQuizMutation.isPending ? 'Évaluation...' : 'Soumettre'}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" data-testid="dialog-title-results">
              <Trophy className="w-5 h-5 text-primary" />
              Résultats du quiz
            </DialogTitle>
          </DialogHeader>

          {quizResult && (
            <div className="space-y-6">
              <div className="text-center p-6 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2" data-testid="text-score-label">Votre score</p>
                <p className={`text-5xl font-bold ${getScoreColor(quizResult.finalScore)}`} data-testid="text-final-score">
                  {quizResult.finalScore}%
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg" data-testid="text-answer-details">Détails des réponses</h3>
                {quizResult.evaluations.map((evaluation: any, index: number) => {
                  const question = currentQuiz ? (currentQuiz.questions as QuizQuestion[])[evaluation.questionIndex] : null;
                  if (!question) return null;

                  return (
                    <Card key={index} data-testid={`card-evaluation-${index}`}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2" data-testid={`card-title-evaluation-${index}`}>
                          {evaluation.isCorrect !== undefined ? (
                            evaluation.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" data-testid={`icon-correct-${index}`} />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" data-testid={`icon-incorrect-${index}`} />
                            )
                          ) : (
                            <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                              evaluation.score >= 80 ? 'bg-green-600' : evaluation.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                            } text-white text-xs font-bold`} data-testid={`badge-score-${index}`}>
                              {evaluation.score}
                            </div>
                          )}
                          Question {index + 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="font-medium" data-testid={`text-evaluation-question-${index}`}>{question.question}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground" data-testid={`text-user-answer-label-${index}`}>Votre réponse :</p>
                          <p className="text-sm" data-testid={`text-user-answer-${index}`}>{evaluation.userAnswer}</p>
                        </div>
                        {evaluation.correctAnswer && (
                          <div>
                            <p className="text-sm text-muted-foreground" data-testid={`text-correct-answer-label-${index}`}>Réponse correcte :</p>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400" data-testid={`text-correct-answer-${index}`}>
                              {evaluation.correctAnswer}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground" data-testid={`text-explanation-label-${index}`}>Explication :</p>
                          <div className="text-sm prose prose-sm dark:prose-invert" data-testid={`text-explanation-${index}`}>
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

          <DialogFooter>
            <Button onClick={() => setIsResultOpen(false)} data-testid="button-close-results">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
