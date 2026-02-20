import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { type Course, type Summary } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Brain,
  Layers,
  BookMarked,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Loader2,
  Lock,
  Trash2,
  Target,
  Lightbulb,
  AlertTriangle,
  ClipboardList,
} from 'lucide-react';

type FlashcardSet = {
  id: string;
  courseId: string;
  userId: string;
  cards: Array<{ front: string; back: string }>;
  totalCards: number;
  masteredCards: number;
  createdAt: string;
};

type FlashcardProgress = {
  id: string;
  flashcardSetId: string;
  userId: string;
  cardIndex: number;
  status: string;
  lastReviewedAt: string | null;
};

type StudyGuide = {
  id: string;
  courseId: string;
  userId: string;
  content: {
    objectives: string[];
    keyConcepts: Array<{ term: string; definition: string; importance: string }>;
    commonPitfalls: Array<{ pitfall: string; solution: string }>;
    practiceExercises: Array<{ question: string; hint: string }>;
    studyTips: string[];
  };
  createdAt: string;
};

export default function CourseDetail() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('content');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewOnly, setReviewOnly] = useState(false);

  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ['/api/courses', courseId],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${courseId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch course');
      return res.json();
    },
    enabled: !!courseId,
  });

  const { data: summaries = [] } = useQuery<Summary[]>({
    queryKey: ['/api/summaries', courseId],
    queryFn: async () => {
      const res = await fetch(`/api/summaries?courseId=${courseId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch summaries');
      return res.json();
    },
    enabled: !!courseId,
  });

  const { data: flashcardSets = [] } = useQuery<FlashcardSet[]>({
    queryKey: ['/api/flashcard-sets/course', courseId],
    queryFn: async () => {
      const res = await fetch(`/api/flashcard-sets/course/${courseId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    enabled: !!courseId,
  });

  const currentSet = flashcardSets[0];

  const { data: flashcardProgress = [] } = useQuery<FlashcardProgress[]>({
    queryKey: ['/api/flashcard-sets', currentSet?.id, 'progress'],
    queryFn: async () => {
      const res = await fetch(`/api/flashcard-sets/${currentSet!.id}/progress`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    enabled: !!currentSet?.id,
  });

  const { data: studyGuides = [] } = useQuery<StudyGuide[]>({
    queryKey: ['/api/study-guides/course', courseId],
    queryFn: async () => {
      const res = await fetch(`/api/study-guides/course/${courseId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    enabled: !!courseId,
  });

  const currentGuide = studyGuides[0];

  const generateSummaryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/courses/${courseId}/generate-summary`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/summaries', courseId] });
      toast({ title: t.coursesPage.summaryGenerated, description: t.coursesPage.summaryGeneratedDesc });
    },
    onError: (error: any) => {
      toast({ title: t.coursesPage.error, description: error?.message || t.coursesPage.cannotGenerateSummary, variant: 'destructive' });
    },
  });

  const generateFlashcardsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/courses/${courseId}/generate-flashcards`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flashcard-sets/course', courseId] });
      setCurrentCardIndex(0);
      setIsFlipped(false);
      toast({ title: t.flashcards.generated, description: t.flashcards.generatedDesc });
    },
    onError: (error: any) => {
      toast({ title: t.flashcards.error, description: error?.message || t.flashcards.cannotGenerate, variant: 'destructive' });
    },
  });

  const generateStudyGuideMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/courses/${courseId}/generate-study-guide`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/study-guides/course', courseId] });
      toast({ title: t.studyGuide.generated, description: t.studyGuide.generatedDesc });
    },
    onError: (error: any) => {
      toast({ title: t.studyGuide.error, description: error?.message || t.studyGuide.cannotGenerate, variant: 'destructive' });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ cardIndex, status }: { cardIndex: number; status: string }) => {
      const response = await apiRequest('PATCH', `/api/flashcard-sets/${currentSet!.id}/progress`, { cardIndex, status });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flashcard-sets', currentSet?.id, 'progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flashcard-sets/course', courseId] });
    },
  });

  const deleteFlashcardsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/flashcard-sets/${currentSet!.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flashcard-sets/course', courseId] });
      setCurrentCardIndex(0);
      setIsFlipped(false);
    },
  });

  const deleteStudyGuideMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/study-guides/${currentGuide!.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/study-guides/course', courseId] });
    },
  });

  const getCardStatus = (index: number): string => {
    const progress = flashcardProgress.find(p => p.cardIndex === index);
    return progress?.status || 'to_review';
  };

  const handleCardAction = (status: string) => {
    if (!currentSet) return;
    updateProgressMutation.mutate({ cardIndex: currentCardIndex, status });
    setIsFlipped(false);
    const cards = getFilteredCards();
    const nextIndex = cards.findIndex((_, i) => {
      const actualIndex = reviewOnly
        ? currentSet.cards.findIndex((c, ci) => ci > currentCardIndex && getCardStatus(ci) !== 'mastered')
        : currentCardIndex + 1;
      return i === actualIndex;
    });
    if (currentCardIndex < (reviewOnly ? cards.length - 1 : currentSet.cards.length - 1)) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const getFilteredCards = () => {
    if (!currentSet) return [];
    if (reviewOnly) {
      return currentSet.cards.filter((_, i) => getCardStatus(i) !== 'mastered');
    }
    return currentSet.cards;
  };

  const masteredCount = currentSet ? flashcardProgress.filter(p => p.status === 'mastered').length : 0;
  const totalCards = currentSet?.cards?.length || 0;

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <BookOpen className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">{language === 'fr' ? 'Cours introuvable' : 'Course not found'}</p>
        <Button variant="outline" onClick={() => setLocation('/courses')} data-testid="button-back-courses">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.courseDetail.backToCourses}
        </Button>
      </div>
    );
  }

  const latestSummary = summaries.length > 0 ? summaries[summaries.length - 1] : null;
  const filteredCards = getFilteredCards();
  const allReviewed = currentSet && filteredCards.length === 0 && reviewOnly;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/courses')}
          data-testid="button-back-to-courses"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t.courseDetail.backToCourses}
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-bold truncate" data-testid="text-course-detail-title">
            {course.title}
          </h2>
          {course.subject && (
            <p className="text-sm text-muted-foreground">{course.subject}</p>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-5 h-auto" data-testid="tabs-course-detail">
          <TabsTrigger value="content" className="text-xs md:text-sm py-2" data-testid="tab-content">
            <BookOpen className="w-3.5 h-3.5 md:mr-1.5" />
            <span className="hidden md:inline">{t.courseDetail.tabs.content}</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="text-xs md:text-sm py-2" data-testid="tab-summary">
            <FileText className="w-3.5 h-3.5 md:mr-1.5" />
            <span className="hidden md:inline">{t.courseDetail.tabs.summary}</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="text-xs md:text-sm py-2" data-testid="tab-quiz">
            <Brain className="w-3.5 h-3.5 md:mr-1.5" />
            <span className="hidden md:inline">{t.courseDetail.tabs.quiz}</span>
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="text-xs md:text-sm py-2" data-testid="tab-flashcards">
            <Layers className="w-3.5 h-3.5 md:mr-1.5" />
            <span className="hidden md:inline">{t.courseDetail.tabs.flashcards}</span>
          </TabsTrigger>
          <TabsTrigger value="studyguide" className="text-xs md:text-sm py-2" data-testid="tab-studyguide">
            <BookMarked className="w-3.5 h-3.5 md:mr-1.5" />
            <span className="hidden md:inline">{t.courseDetail.tabs.studyGuide}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="whitespace-pre-wrap text-sm leading-relaxed" data-testid="text-course-content-detail">
                {course.content || t.courseDetail.noContent}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          {latestSummary ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-lg">{t.courseDetail.tabs.summary}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed" data-testid="text-summary-detail">
                  {latestSummary.content}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <FileText className="w-12 h-12 text-muted-foreground" />
                  <p className="text-muted-foreground text-center">
                    {language === 'fr' ? 'Aucun resume disponible' : 'No summary available'}
                  </p>
                  <Button
                    onClick={() => generateSummaryMutation.mutate()}
                    disabled={generateSummaryMutation.isPending}
                    data-testid="button-generate-summary-detail"
                  >
                    {generateSummaryMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.coursesPage.generatingSummary}</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" />{t.coursesPage.generateSummary}</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quiz" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Brain className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground text-center">
                  {language === 'fr'
                    ? 'Rendez-vous sur la page Quiz pour generer un quiz a partir de ce cours.'
                    : 'Go to the Quiz page to generate a quiz from this course.'}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setLocation('/quizzes')}
                  data-testid="button-go-to-quizzes"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {language === 'fr' ? 'Aller aux Quiz' : 'Go to Quizzes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards" className="mt-4">
          {currentSet && currentSet.cards.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" data-testid="badge-flashcard-progress">
                    {masteredCount}/{totalCards} {t.flashcards.mastered}
                  </Badge>
                  <Button
                    variant={reviewOnly ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setReviewOnly(!reviewOnly);
                      setCurrentCardIndex(0);
                      setIsFlipped(false);
                    }}
                    data-testid="button-toggle-review-mode"
                  >
                    {reviewOnly ? t.flashcards.allCards : t.flashcards.onlyToReview}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentCardIndex(0);
                      setIsFlipped(false);
                    }}
                    data-testid="button-reset-flashcards"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    {t.flashcards.reset}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFlashcardsMutation.mutate()}
                    data-testid="button-delete-flashcards"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${totalCards > 0 ? (masteredCount / totalCards) * 100 : 0}%` }}
                  data-testid="progress-bar-flashcards"
                />
              </div>

              {allReviewed ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <Check className="w-16 h-16 text-green-500" />
                      <p className="text-lg font-medium text-center">{t.flashcards.completed}</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setReviewOnly(false);
                          setCurrentCardIndex(0);
                          setIsFlipped(false);
                        }}
                        data-testid="button-review-all-again"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {t.flashcards.reset}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="text-center text-sm text-muted-foreground mb-2" data-testid="text-card-counter">
                    {t.flashcards.card} {currentCardIndex + 1} {t.flashcards.of} {reviewOnly ? filteredCards.length : totalCards}
                  </div>

                  <div
                    className="relative w-full max-w-lg mx-auto perspective-1000 cursor-pointer"
                    style={{ minHeight: '250px' }}
                    onClick={() => setIsFlipped(!isFlipped)}
                    data-testid="flashcard-container"
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        transition: 'transform 0.5s',
                        minHeight: '250px',
                      }}
                    >
                      <Card
                        className="absolute inset-0 flex items-center justify-center p-6"
                        style={{ backfaceVisibility: 'hidden' }}
                        data-testid="flashcard-front"
                      >
                        <div className="text-center">
                          <Badge variant="outline" className="mb-4">{t.flashcards.front}</Badge>
                          <p className="text-lg font-medium">
                            {(reviewOnly ? filteredCards : currentSet.cards)[currentCardIndex]?.front}
                          </p>
                        </div>
                      </Card>
                      <Card
                        className="absolute inset-0 flex items-center justify-center p-6"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                        data-testid="flashcard-back"
                      >
                        <div className="text-center">
                          <Badge variant="outline" className="mb-4">{t.flashcards.back}</Badge>
                          <p className="text-base">
                            {(reviewOnly ? filteredCards : currentSet.cards)[currentCardIndex]?.back}
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 mt-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={currentCardIndex === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
                        setIsFlipped(false);
                      }}
                      data-testid="button-prev-card"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="outline"
                      className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardAction('to_review');
                      }}
                      data-testid="button-to-review"
                    >
                      <X className="w-4 h-4 mr-1" />
                      {t.flashcards.toReview}
                    </Button>

                    <Button
                      variant="outline"
                      className="border-green-300 dark:border-green-700 text-green-600 dark:text-green-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardAction('mastered');
                      }}
                      data-testid="button-mastered"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      {t.flashcards.iKnow}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={currentCardIndex >= (reviewOnly ? filteredCards.length - 1 : totalCards - 1)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentCardIndex(Math.min(
                          (reviewOnly ? filteredCards.length : totalCards) - 1,
                          currentCardIndex + 1
                        ));
                        setIsFlipped(false);
                      }}
                      data-testid="button-next-card"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Layers className="w-12 h-12 text-muted-foreground" />
                  <p className="text-muted-foreground text-center">{t.flashcards.noFlashcardsDesc}</p>
                  <Button
                    onClick={() => generateFlashcardsMutation.mutate()}
                    disabled={generateFlashcardsMutation.isPending}
                    data-testid="button-generate-flashcards"
                  >
                    {generateFlashcardsMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.flashcards.generating}</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" />{t.flashcards.generate}</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="studyguide" className="mt-4">
          {currentGuide && currentGuide.content ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t.studyGuide.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteStudyGuideMutation.mutate()}
                  data-testid="button-delete-study-guide"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <Accordion type="multiple" defaultValue={['objectives', 'concepts', 'pitfalls', 'exercises']} className="w-full">
                {currentGuide.content.objectives && currentGuide.content.objectives.length > 0 && (
                  <AccordionItem value="objectives">
                    <AccordionTrigger className="text-base" data-testid="accordion-objectives">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        {t.studyGuide.objectives}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-2">
                        {currentGuide.content.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {currentGuide.content.keyConcepts && currentGuide.content.keyConcepts.length > 0 && (
                  <AccordionItem value="concepts">
                    <AccordionTrigger className="text-base" data-testid="accordion-concepts">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        {t.studyGuide.keyConcepts}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {currentGuide.content.keyConcepts.map((concept, i) => (
                          <Card key={i}>
                            <CardContent className="pt-4 pb-3">
                              <p className="font-medium text-sm">{concept.term}</p>
                              <p className="text-sm text-muted-foreground mt-1">{concept.definition}</p>
                              {concept.importance && (
                                <Badge variant="secondary" className="mt-2 text-xs">{concept.importance}</Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {currentGuide.content.commonPitfalls && currentGuide.content.commonPitfalls.length > 0 && (
                  <AccordionItem value="pitfalls">
                    <AccordionTrigger className="text-base" data-testid="accordion-pitfalls">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        {t.studyGuide.pitfalls}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {currentGuide.content.commonPitfalls.map((pitfall, i) => (
                          <div key={i} className="space-y-1 pl-2 border-l-2 border-orange-300 dark:border-orange-700">
                            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{pitfall.pitfall}</p>
                            <p className="text-sm text-muted-foreground">{pitfall.solution}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {currentGuide.content.practiceExercises && currentGuide.content.practiceExercises.length > 0 && (
                  <AccordionItem value="exercises">
                    <AccordionTrigger className="text-base" data-testid="accordion-exercises">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-purple-500" />
                        {t.studyGuide.exercises}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {currentGuide.content.practiceExercises.map((exercise, i) => (
                          <Card key={i}>
                            <CardContent className="pt-4 pb-3">
                              <p className="text-sm font-medium">{exercise.question}</p>
                              {exercise.hint && (
                                <p className="text-xs text-muted-foreground mt-2 italic">
                                  {language === 'fr' ? 'Indice' : 'Hint'}: {exercise.hint}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {currentGuide.content.studyTips && currentGuide.content.studyTips.length > 0 && (
                  <AccordionItem value="tips">
                    <AccordionTrigger className="text-base" data-testid="accordion-tips">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        {language === 'fr' ? 'Conseils de revision' : 'Study Tips'}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-2">
                        {currentGuide.content.studyTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Sparkles className="w-3 h-3 text-primary mt-1 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <BookMarked className="w-12 h-12 text-muted-foreground" />
                  <p className="text-muted-foreground text-center">{t.studyGuide.noGuideDesc}</p>
                  <Button
                    onClick={() => generateStudyGuideMutation.mutate()}
                    disabled={generateStudyGuideMutation.isPending}
                    data-testid="button-generate-study-guide"
                  >
                    {generateStudyGuideMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.studyGuide.generating}</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" />{t.studyGuide.generate}</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}