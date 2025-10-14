export default function Performance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold" data-testid="text-performance-title">Performances</h2>
        <p className="text-muted-foreground mt-2">Visualisez vos progrès et restez motivé</p>
      </div>

      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground">Aucune donnée de performance</p>
          <p className="text-sm text-muted-foreground mt-2">
            Complétez des quiz pour voir vos statistiques
          </p>
        </div>
      </div>
    </div>
  );
}
