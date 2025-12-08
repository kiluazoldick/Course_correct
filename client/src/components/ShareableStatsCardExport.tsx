import { forwardRef } from 'react';

interface ShareableStatsCardExportProps {
  totalQuizzes: number;
  totalCourses: number;
  averageScore: number;
  bestScore: number;
  userName?: string;
  language: 'fr' | 'en';
}

export const ShareableStatsCardExport = forwardRef<HTMLDivElement, ShareableStatsCardExportProps>(
  ({ totalQuizzes, totalCourses, averageScore, bestScore, userName, language }, ref) => {
    
    const getScoreColor = (score: number) => {
      if (score >= 80) return { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', text: '#ffffff' };
      if (score >= 60) return { bg: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', text: '#ffffff' };
      return { bg: 'linear-gradient(135deg, #ef4444 0%, #e11d48 100%)', text: '#ffffff' };
    };

    const scoreStyle = getScoreColor(averageScore);

    return (
      <div
        ref={ref}
        style={{
          width: '400px',
          height: '520px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          borderRadius: '24px',
          padding: '24px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.15)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '60px',
          right: '20px',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.15)',
          filter: 'blur(40px)',
        }} />

        <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
                {language === 'fr' ? 'MES STATISTIQUES' : 'MY STATISTICS'}
              </p>
              {userName && (
                <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '14px', margin: '2px 0 0 0' }}>{userName}</p>
              )}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', margin: 0 }}>{totalQuizzes}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' }}>
                  {language === 'fr' ? 'Quiz passés' : 'Quizzes taken'}
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                  </svg>
                </div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', margin: 0 }}>{totalCourses}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' }}>
                  {language === 'fr' ? 'Cours actifs' : 'Active courses'}
                </p>
              </div>
            </div>

            <div style={{
              background: scoreStyle.bg,
              borderRadius: '16px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.15 }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="white" stroke="none">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"/>
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: 500, margin: 0 }}>
                  {language === 'fr' ? 'Score moyen' : 'Average score'}
                </p>
              </div>
              <p style={{ fontSize: '48px', fontWeight: 700, color: '#ffffff', margin: 0 }}>{averageScore}%</p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(251, 191, 36, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6"/>
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', margin: 0 }}>
                    {language === 'fr' ? 'Meilleur score' : 'Best score'}
                  </p>
                  <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '14px', margin: '2px 0 0 0' }}>
                    {language === 'fr' ? 'Record personnel' : 'Personal record'}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#fbbf24', margin: 0 }}>{bestScore}%</p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: '8px',
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500 }}>corrigetescours.com</span>
          </div>
        </div>
      </div>
    );
  }
);

ShareableStatsCardExport.displayName = 'ShareableStatsCardExport';
