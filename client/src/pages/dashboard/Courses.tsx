import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Courses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" data-testid="text-courses-title">Mes Cours</h2>
          <p className="text-muted-foreground mt-2">Gérez vos cours et générez des résumés intelligents</p>
        </div>
        <Button data-testid="button-create-course">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau cours
        </Button>
      </div>

      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Aucun cours pour le moment</p>
          <Button variant="outline" data-testid="button-create-first-course">
            Créer mon premier cours
          </Button>
        </div>
      </div>
    </div>
  );
}
