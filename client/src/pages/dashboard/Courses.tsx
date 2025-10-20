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
      title: insertCourseSchema.shape.title.min(1, "Le titre est requis"),
      content: insertCourseSchema.shape.content.min(10, "Le contenu doit contenir au moins 10 caractères"),
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
      title: insertCourseSchema.shape.title.min(1, "Le titre est requis"),
      content: insertCourseSchema.shape.content.min(10, "Le contenu doit contenir au moins 10 caractères"),
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
        title: 'Cours créé',
        description: 'Votre cours a été créé avec succès.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le cours.',
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
        title: 'Cours modifié',
        description: 'Vos modifications ont été enregistrées.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le cours.',
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
        title: 'Cours supprimé',
        description: 'Le cours a été supprimé avec succès.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le cours.',
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
        title: 'Résumé généré',
        description: 'Votre résumé intelligent est prêt !',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error?.message || 'Impossible de générer le résumé.',
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
        title: 'Fichier importé',
        description: 'Ton cours a été créé à partir du fichier.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error?.message || 'Impossible d\'importer le fichier.',
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
        doc.text('Généré par Corrige Tes Cours', margin, footerY);
        doc.text(`Page ${pageNum}`, pageWidth - margin, footerY, { align: 'right' });
        
        doc.setDrawColor(200);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
      };

      let pageNumber = 1;

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      const titleLines = doc.splitTextToSize(`Résumé: ${selectedCourse.title}`, maxWidth);
      titleLines.forEach((line: string) => {
        doc.text(line, margin, yPosition);
        yPosition += 8;
      });
      yPosition += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100);
      const date = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      doc.text(`Généré le ${date}`, margin, yPosition);
      yPosition += 3;

      doc.setDrawColor(100);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0);
      
      const lines = currentSummary.split('\n');
      
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
          
          if (!text.startsWith('•')) {
            text = text.replace(/^-\s*/, '• ');
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

      const fileName = `resume-${selectedCourse.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      doc.save(fileName);

      toast({
        title: 'PDF téléchargé',
        description: 'Le résumé a été téléchargé avec succès.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le PDF.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Mes Cours</h2>
            <p className="text-muted-foreground mt-2">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-courses-title">Mes Cours</h2>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">Gérez vos cours et générez des résumés intelligents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="md:size-default" onClick={() => setIsUploadOpen(true)} data-testid="button-upload-course">
            <Upload className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Importer</span>
          </Button>
          <Button size="sm" className="md:size-default" onClick={() => setIsCreateOpen(true)} data-testid="button-create-course">
            <Plus className="w-4 h-4 md:mr-2" />
            <span className="md:inline">Nouveau</span>
          </Button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <div className="text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Aucun cours pour le moment</p>
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(true)}
              data-testid="button-create-first-course"
            >
              Créer mon premier cours
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
                    {new Date(course.createdAt).toLocaleDateString('fr-FR', {
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
                    ? 'Génération...'
                    : 'Générer un résumé IA'}
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
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(course)}
                    data-testid={`button-edit-course-${course.id}`}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
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
            <DialogTitle>Créer un nouveau cours</DialogTitle>
            <DialogDescription>
              Ajoutez le contenu de votre cours pour générer des résumés et des quiz intelligents.
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du cours</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Introduction à l'algèbre linéaire"
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
                    <FormLabel>Matière (optionnel)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Mathématiques"
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
                    <FormLabel>Contenu du cours</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Collez ou tapez le contenu de votre cours ici..."
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
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  data-testid="button-submit-create"
                >
                  {createMutation.isPending ? 'Création...' : 'Créer le cours'}
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
            <DialogTitle>Modifier le cours</DialogTitle>
            <DialogDescription>
              Modifiez le contenu de votre cours.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du cours</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Introduction à l'algèbre linéaire"
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
                    <FormLabel>Matière (optionnel)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Mathématiques"
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
                    <FormLabel>Contenu du cours</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Collez ou tapez le contenu de votre cours ici..."
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
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  data-testid="button-submit-edit"
                >
                  {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
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
            <AlertDialogTitle>Supprimer ce cours ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le cours "{selectedCourse?.title}" ainsi que tous ses résumés et quiz associés seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Supprimer
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
                Matière : {selectedCourse.subject}
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
              Fermer
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
                Modifier
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
              Importer un fichier
            </DialogTitle>
            <DialogDescription>
              Importe un fichier PDF ou Word pour créer automatiquement un cours (max 10 MB)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="file-upload">
                Fichier (PDF ou Word .docx)
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
                  Fichier : {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="subject-upload">
                Matière (optionnel)
              </label>
              <Input
                id="subject-upload"
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                placeholder="Ex: Mathématiques, Physique..."
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
              Annuler
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
              {uploadFileMutation.isPending ? 'Import en cours...' : 'Importer'}
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
              Résumé : {selectedCourse?.title}
            </DialogTitle>
            <DialogDescription>
              Résumé intelligent généré par Corrige Tes Cours
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
              Fermer
            </Button>
            <Button
              onClick={downloadSummaryAsPdf}
              data-testid="button-download-summary"
            >
              <FileText className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
