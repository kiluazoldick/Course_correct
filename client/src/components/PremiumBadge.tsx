import { Crown, Sparkles, Zap, Infinity } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'glow';
  showText?: boolean;
  className?: string;
}

export function PremiumBadge({ 
  size = 'md', 
  variant = 'default',
  showText = true,
  className = '' 
}: PremiumBadgeProps) {
  const { t } = useLanguage();
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const baseClasses = 'inline-flex items-center gap-1.5 font-semibold rounded-full transition-all';
  
  const variantClasses = {
    default: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg hover:from-amber-400 hover:to-orange-400',
    minimal: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    glow: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 animate-pulse'
  };

  return (
    <span 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      data-testid="badge-premium"
    >
      <Crown className={iconSizes[size]} />
      {showText && <span>Premium</span>}
    </span>
  );
}

export function UnlimitedBadge({ className = '' }: { className?: string }) {
  const { t } = useLanguage();
  
  return (
    <span 
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 ${className}`}
      data-testid="badge-unlimited"
    >
      <Infinity className="w-3 h-3" />
      <span className="hidden sm:inline">{t.subscriptionPage.unlimited}</span>
    </span>
  );
}

export function PremiumFeatureIndicator({ 
  children, 
  label 
}: { 
  children: React.ReactNode;
  label?: string;
}) {
  const { t } = useLanguage();
  
  return (
    <div className="relative group">
      {children}
      <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
          <Sparkles className="w-2.5 h-2.5" />
          {label || 'Premium'}
        </span>
      </div>
    </div>
  );
}

export function PremiumCard({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-lg border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/5 ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function UpgradeCTA({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  
  if (compact) {
    return (
      <a 
        href="/dashboard/subscription"
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all"
        data-testid="link-upgrade-cta"
      >
        <Zap className="w-3 h-3" />
        {t.subscriptionPage.upgradeToPremium}
      </a>
    );
  }
  
  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Crown className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{t.subscriptionPage.upgradeToPremium}</p>
          <p className="text-sm text-muted-foreground">{t.subscriptionPage.unlockAllFeatures}</p>
        </div>
        <a 
          href="/dashboard/subscription"
          className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all"
          data-testid="link-upgrade-cta"
        >
          <Zap className="w-4 h-4" />
          {t.subscriptionPage.subscribe}
        </a>
      </div>
    </div>
  );
}
