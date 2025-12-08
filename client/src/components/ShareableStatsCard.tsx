import { forwardRef } from 'react';
import { Target, TrendingUp, Award, BookOpen, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface ShareableStatsCardProps {
  totalQuizzes: number;
  totalCourses: number;
  averageScore: number;
  bestScore: number;
  userName?: string;
}

export const ShareableStatsCard = forwardRef<HTMLDivElement, ShareableStatsCardProps>(
  ({ totalQuizzes, totalCourses, averageScore, bestScore, userName }, ref) => {
    const { t, language } = useLanguage();
    
    const getScoreGradient = (score: number) => {
      if (score >= 80) return 'from-emerald-500 to-green-600';
      if (score >= 60) return 'from-amber-500 to-orange-600';
      return 'from-red-500 to-rose-600';
    };

    const getScoreIcon = (score: number) => {
      if (score >= 80) return 'excellent';
      if (score >= 60) return 'good';
      return 'learning';
    };

    return (
      <div
        ref={ref}
        className="w-[400px] h-[500px] relative overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-emerald-500/20 blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-xs font-medium tracking-wide uppercase">
                {language === 'fr' ? 'Mes statistiques' : 'My Statistics'}
              </p>
              {userName && (
                <p className="text-white font-semibold text-sm">{userName}</p>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{totalQuizzes}</p>
                <p className="text-white/60 text-xs mt-1">
                  {language === 'fr' ? 'Quiz passés' : 'Quizzes taken'}
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{totalCourses}</p>
                <p className="text-white/60 text-xs mt-1">
                  {language === 'fr' ? 'Cours actifs' : 'Active courses'}
                </p>
              </div>
            </div>

            <div className={`bg-gradient-to-r ${getScoreGradient(averageScore)} rounded-2xl p-5 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-2">
                <Award className="w-24 h-24 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-white/80" />
                <p className="text-white/80 text-sm font-medium">
                  {language === 'fr' ? 'Score moyen' : 'Average score'}
                </p>
              </div>
              <p className="text-5xl font-bold text-white">{averageScore}%</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">
                    {language === 'fr' ? 'Meilleur score' : 'Best score'}
                  </p>
                  <p className="text-white font-semibold">
                    {language === 'fr' ? 'Record personnel' : 'Personal record'}
                  </p>
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-400">{bestScore}%</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white/40 text-sm font-medium">corrigetescours.com</span>
          </div>
        </div>
      </div>
    );
  }
);

ShareableStatsCard.displayName = 'ShareableStatsCard';
