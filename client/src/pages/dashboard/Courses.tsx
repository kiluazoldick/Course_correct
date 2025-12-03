import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertCourseSchema, type Course, type InsertCourse } from '@shared/schema';
import { Plus, BookOpen, Trash2, Edit, Calendar, Sparkles, FileText, Eye, Upload } from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import jsPDF from 'jspdf';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Courses() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSubject, setUploadSubject] = useState('');

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const createForm = useForm<InsertCourse>({
    resolver: zodResolver(insertCourseSchema.extend({
      title: insertCourseSchema.shape.title.min(1, t.coursesPage.titleRequired),
      content: insertCourseSchema.shape.content.min(10, t.coursesPage.contentRequired),
    })),
    defaultValues: {
      title: '',
      content: '',
      subject: '',
      userId: '',
    },
  });

  const editForm = useForm<InsertCourse>({
    resolver: zodResolver(insertCourseSchema.extend({
      title: insertCourseSchema.shape.title.min(1, t.coursesPage.titleRequired),
      content: insertCourseSchema.shape.content.min(10, t.coursesPage.contentRequired),
    })),
    defaultValues: {
      title: '',
      content: '',
      subject: '',
      userId: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCourse) => {
      return await apiRequest('POST', '/api/courses', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setIsCreateOpen(false);
      createForm.reset();
      toast({
        title: t.coursesPage.courseCreated,
        description: t.coursesPage.courseCreatedDesc,
      });
    },
    onError: () => {
      toast({
        title: t.coursesPage.error,
        description: t.coursesPage.cannotCreate,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertCourse> }) => {
      return await apiRequest('PATCH', `/api/courses/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setIsEditOpen(false);
      setSelectedCourse(null);
      editForm.reset();
      toast({
        title: t.coursesPage.courseUpdated,
        description: t.coursesPage.courseUpdatedDesc,
      });
    },
    onError: () => {
      toast({
        title: t.coursesPage.error,
        description: t.coursesPage.cannotUpdate,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setIsDeleteOpen(false);
      setSelectedCourse(null);
      toast({
        title: t.coursesPage.courseDeleted,
        description: t.coursesPage.courseDeletedDesc,
      });
    },
    onError: () => {
      toast({
        title: t.coursesPage.error,
        description: t.coursesPage.cannotDelete,
        variant: 'destructive',
      });
    },
  });

  const generateSummaryMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiRequest('POST', `/api/courses/${courseId}/generate-summary`);
      return await response.json();
    },
    onSuccess: (data) => {
      setCurrentSummary(data.content);
      setIsSummaryOpen(true);
      queryClient.invalidateQueries({ queryKey: ['/api/summaries'] });
      toast({
        title: t.coursesPage.summaryGenerated,
        description: t.coursesPage.summaryGeneratedDesc,
      });
    },
    onError: (error: any) => {
      toast({
        title: t.coursesPage.error,
        description: error?.message || t.coursesPage.cannotGenerateSummary,
        variant: 'destructive',
      });
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, subject }: { file: File; subject: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subject', subject);
      
      const response = await fetch('/api/courses/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setIsUploadOpen(false);
      setUploadFile(null);
      setUploadSubject('');
      toast({
        title: t.coursesPage.fileUploaded,
        description: t.coursesPage.fileUploadedDesc,
      });
    },
    onError: (error: any) => {
      toast({
        title: t.coursesPage.uploadError,
        description: error?.message || t.coursesPage.uploadErrorDesc,
        variant: 'destructive',
      });
    },
  });

  const handleCreate = (data: InsertCourse) => {
    createMutation.mutate(data);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    editForm.reset({
      title: course.title,
      content: course.content,
      subject: course.subject || '',
      userId: course.userId,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = (data: InsertCourse) => {
    if (selectedCourse) {
      updateMutation.mutate({ id: selectedCourse.id, data });
    }
  };

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCourse) {
      deleteMutation.mutate(selectedCourse.id);
    }
  };

  const handleGenerateSummary = (course: Course) => {
    setSelectedCourse(course);
    generateSummaryMutation.mutate(course.id);
  };

  const normalizePdfText = (text: string): string => {
    return text
      .replace(/→/g, '->')
      .replace(/←/g, '<-')
      .replace(/↑/g, '^')
      .replace(/↓/g, 'v')
      .replace(/•/g, '-')
      .replace(/–/g, '-')
      .replace(/—/g, '-')
      .replace(/'/g, "'")
      .replace(/'/g, "'")
      .replace(/"/g, '"')
      .replace(/"/g, '"')
      .replace(/…/g, '...')
      .replace(/≈/g, '~=')
      .replace(/≠/g, '!=')
      .replace(/≤/g, '<=')
      .replace(/≥/g, '>=')
      .replace(/×/g, 'x')
      .replace(/÷/g, '/')
      .replace(/±/g, '+/-')
      .replace(/°/g, ' deg')
      .replace(/µ/g, 'u')
      .replace(/²/g, '2')
      .replace(/³/g, '3')
      .replace(/¹/g, '1')
      .replace(/¼/g, '1/4')
      .replace(/½/g, '1/2')
      .replace(/¾/g, '3/4')
      .replace(/€/g, 'EUR')
      .replace(/£/g, 'GBP')
      .replace(/¥/g, 'JPY')
      .replace(/™/g, '(TM)')
      .replace(/©/g, '(C)')
      .replace(/®/g, '(R)');
  };

  const downloadSummaryAsPdf = () => {
    if (!currentSummary || !selectedCourse) return;

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      const footerHeight = 15;
      let yPosition = margin;

      const addFooter = (pageNum: number) => {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120);
        
        const footerY = pageHeight - 10;
        doc.text(normalizePdfText('Genere par Corrige Tes Cours'), margin, footerY);
        doc.text(`Page ${pageNum}`, pageWidth - margin, footerY, { align: 'right' });
        
        doc.setDrawColor(200);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
      };

      let pageNumber = 1;

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      const summaryLabel = language === 'fr' ? 'Resume' : 'Summary';
      const normalizedTitle = normalizePdfText(`${summaryLabel}: ${selectedCourse.title}`);
      const titleLines = doc.splitTextToSize(normalizedTitle, maxWidth);
      titleLines.forEach((line: string) => {
        doc.text(line, margin, yPosition);
        yPosition += 8;
      });
      yPosition += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100);
      const date = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const generatedLabel = language === 'fr' ? 'Genere le' : 'Generated on';
      doc.text(normalizePdfText(`${generatedLabel} ${date}`), margin, yPosition);
      yPosition += 3;

      doc.setDrawColor(100);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0);
      
      const normalizedSummary = normalizePdfText(currentSummary);
      const lines = normalizedSummary.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let text = line.trim();

        if (!text) {
          yPosition += 4;
          continue;
        }

        const isUpperCase = text === text.toUpperCase() && text.length > 3;
        const isListItem = text.startsWith('-') || text.startsWith('•') || text.match(/^\d+\./);
        
        if (isUpperCase && text.endsWith(':')) {
          if (yPosition > pageHeight - footerHeight - 20) {
            addFooter(pageNumber);
            doc.addPage();
            pageNumber++;
            yPosition = margin;
          }
          
          yPosition += 5;
          doc.setFontSize(13);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(50);
          const titleText = doc.splitTextToSize(text, maxWidth);
          titleText.forEach((t: string) => {
            doc.text(t, margin, yPosition);
            yPosition += 7;
          });
          yPosition += 2;
          
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0);
        } else if (isListItem) {
          if (yPosition > pageHeight - footerHeight - 10) {
            addFooter(pageNumber);
            doc.addPage();
            pageNumber++;
            yPosition = margin;
          }
          
          if (!text.startsWith('-')) {
            text = text.replace(/^-\s*/, '- ');
          }
          
          const listLines = doc.splitTextToSize(text, maxWidth - 5);
          listLines.forEach((listLine: string, idx: number) => {
            if (yPosition > pageHeight - footerHeight - 10) {
              addFooter(pageNumber);
              doc.addPage();
              pageNumber++;
              yPosition = margin;
            }
            doc.text(listLine, margin + (idx > 0 ? 5 : 0), yPosition);
            yPosition += 5.5;
          });
        } else {
          if (yPosition > pageHeight - footerHeight - 10) {
            addFooter(pageNumber);
            doc.addPage();
            pageNumber++;
            yPosition = margin;
          }
          
          const textLines = doc.splitTextToSize(text, maxWidth);
          textLines.forEach((textLine: string) => {
            if (yPosition > pageHeight - footerHeight - 10) {
              addFooter(pageNumber);
              doc.addPage();
              pageNumber++;
              yPosition = margin;
            }
            doc.text(textLine, margin, yPosition);
            yPosition += 5.5;
          });
          yPosition += 1;
        }
      }

      addFooter(pageNumber);

      const fileNamePrefix = language === 'fr' ? 'resume' : 'summary';
      const fileName = `${fileNamePrefix}-${selectedCourse.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      doc.save(fileName);

      toast({
        title: language === 'fr' ? 'PDF téléchargé' : 'PDF downloaded',
        description: language === 'fr' ? 'Le résumé a été téléchargé avec succès.' : 'The summary has been downloaded successfully.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: t.coursesPage.error,
        description: language === 'fr' ? 'Impossible de générer le PDF.' : 'Unable to generate PDF.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">{t.coursesPage.title}</h2>
            <p className="text-muted-foreground mt-2">{language === 'fr' ? 'Chargement...' : 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-courses-title">{t.coursesPage.title}</h2>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">{t.coursesPage.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="md:size-default" onClick={() => setIsUploadOpen(true)} data-testid="button-upload-course">
            <Upload className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">{t.coursesPage.uploadFile}</span>
          </Button>
          <Button size="sm" className="md:size-default" onClick={() => setIsCreateOpen(true)} data-testid="button-create-course">
            <Plus className="w-4 h-4 md:mr-2" />
            <span className="md:inline">{language === 'fr' ? 'Nouveau' : 'New'}</span>
          </Button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <div className="text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">{t.coursesPage.noCourses}</p>
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(true)}
              data-testid="button-create-first-course"
            >
              {t.coursesPage.createCourse}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="hover-elevate" data-testid={`card-course-${course.id}`}>
              <CardHeader>
                <CardTitle className="line-clamp-1" data-testid={`text-course-title-${course.id}`}>
                  {course.title}
                </CardTitle>
                {course.subject && (
                  <CardDescription className="line-clamp-1">{course.subject}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-course-content-${course.id}`}>
                  {course.content}
                </p>
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(course.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleGenerateSummary(course)}
                  disabled={generateSummaryMutation.isPending}
                  data-testid={`button-generate-summary-${course.id}`}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generateSummaryMutation.isPending && selectedCourse?.id === course.id
                    ? t.coursesPage.generatingSummary
                    : t.coursesPage.generateSummary}
                </Button>
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsViewOpen(true);
                    }}
                    data-testid={`button-view-course-${course.id}`}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t.coursesPage.view}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(course)}
                    data-testid={`button-edit-course-${course.id}`}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t.coursesPage.edit}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(course)}
                    data-testid={`button-delete-course-${course.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Course Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.coursesPage.createCourse}</DialogTitle>
            <DialogDescription>
              {language === 'fr' 
                ? 'Ajoutez le contenu de votre cours pour générer des résumés et des quiz intelligents.'
                : 'Add your course content to generate intelligent summaries and quizzes.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.coursesPage.courseTitle}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.coursesPage.courseTitlePlaceholder}
                        {...field}
                        data-testid="input-course-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.coursesPage.subject} ({language === 'fr' ? 'optionnel' : 'optional'})</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.coursesPage.subjectPlaceholder}
                        {...field}
                        value={field.value || ''}
                        data-testid="input-course-subject"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.coursesPage.content}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.coursesPage.contentPlaceholder}
                        className="min-h-[200px]"
                        {...field}
                        data-testid="input-course-content"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  data-testid="button-cancel-create"
                >
                  {t.coursesPage.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  data-testid="button-submit-create"
                >
                  {createMutation.isPending 
                    ? (language === 'fr' ? 'Création...' : 'Creating...') 
                    : t.coursesPage.create}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{language === 'fr' ? 'Modifier le cours' : 'Edit course'}</DialogTitle>
            <DialogDescription>
              {language === 'fr' ? 'Modifiez le contenu de votre cours.' : 'Modify your course content.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.coursesPage.courseTitle}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.coursesPage.courseTitlePlaceholder}
                        {...field}
                        data-testid="input-edit-course-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.coursesPage.subject} ({language === 'fr' ? 'optionnel' : 'optional'})</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.coursesPage.subjectPlaceholder}
                        {...field}
                        value={field.value || ''}
                        data-testid="input-edit-course-subject"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.coursesPage.content}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.coursesPage.contentPlaceholder}
                        className="min-h-[200px]"
                        {...field}
                        data-testid="input-edit-course-content"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false);
                    setSelectedCourse(null);
                  }}
                  data-testid="button-cancel-edit"
                >
                  {t.coursesPage.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  data-testid="button-submit-edit"
                >
                  {updateMutation.isPending 
                    ? (language === 'fr' ? 'Enregistrement...' : 'Saving...') 
                    : (language === 'fr' ? 'Enregistrer' : 'Save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.coursesPage.deleteConfirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.coursesPage.deleteConfirmDesc.replace('{title}', selectedCourse?.title || '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">{t.coursesPage.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {t.coursesPage.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Course Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {selectedCourse?.title}
            </DialogTitle>
            {selectedCourse?.subject && (
              <DialogDescription>
                {t.coursesPage.subject} : {selectedCourse.subject}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="prose prose-sm max-w-none dark:prose-invert" data-testid="text-course-view-content">
            <div className="whitespace-pre-wrap bg-muted/30 p-4 rounded-md">
              {selectedCourse?.content}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewOpen(false)}
              data-testid="button-close-view"
            >
              {language === 'fr' ? 'Fermer' : 'Close'}
            </Button>
            {selectedCourse && (
              <Button
                onClick={() => {
                  setIsViewOpen(false);
                  handleEdit(selectedCourse);
                }}
                data-testid="button-edit-from-view"
              >
                <Edit className="w-4 h-4 mr-2" />
                {t.coursesPage.edit}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload File Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              {t.coursesPage.uploadTitle}
            </DialogTitle>
            <DialogDescription>
              {t.coursesPage.uploadDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="file-upload">
                {language === 'fr' ? 'Fichier (PDF ou Word .docx)' : 'File (PDF or Word .docx)'}
              </label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                data-testid="input-file-upload"
              />
              {uploadFile && (
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Fichier' : 'File'}: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="subject-upload">
                {t.coursesPage.subject} ({language === 'fr' ? 'optionnel' : 'optional'})
              </label>
              <Input
                id="subject-upload"
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                placeholder={t.coursesPage.subjectPlaceholder}
                data-testid="input-subject-upload"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadOpen(false);
                setUploadFile(null);
                setUploadSubject('');
              }}
              data-testid="button-cancel-upload"
            >
              {t.coursesPage.cancel}
            </Button>
            <Button
              onClick={() => {
                if (uploadFile) {
                  uploadFileMutation.mutate({ file: uploadFile, subject: uploadSubject });
                }
              }}
              disabled={!uploadFile || uploadFileMutation.isPending}
              data-testid="button-confirm-upload"
            >
              {uploadFileMutation.isPending 
                ? t.coursesPage.uploading 
                : (language === 'fr' ? 'Importer' : 'Import')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Display Dialog */}
      <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {t.coursesPage.summary} : {selectedCourse?.title}
            </DialogTitle>
            <DialogDescription>
              {language === 'fr' 
                ? 'Résumé intelligent généré par Corrige Tes Cours' 
                : 'Intelligent summary generated by Corrige Tes Cours'}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 rounded-lg p-6 max-w-none" data-testid="text-summary-content">
            {currentSummary && (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {currentSummary}
              </pre>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSummaryOpen(false)}
              data-testid="button-close-summary"
            >
              {language === 'fr' ? 'Fermer' : 'Close'}
            </Button>
            <Button
              onClick={downloadSummaryAsPdf}
              data-testid="button-download-summary"
            >
              <FileText className="w-4 h-4 mr-2" />
              {t.coursesPage.downloadPdf}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
