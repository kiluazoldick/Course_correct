export default function Quizzes() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold" data-testid="text-quizzes-title">Mes Quiz</h2>
        <p className="text-muted-foreground mt-2">Testez vos connaissances avec des quiz intelligents</p>
      </div>

      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground">Aucun quiz disponible</p>
          <p className="text-sm text-muted-foreground mt-2">
            Créez d'abord un cours pour générer des quiz
          </p>
        </div>
      </div>
    </div>
  );
}
