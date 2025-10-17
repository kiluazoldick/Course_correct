import { Link, useLocation } from 'wouter';
import { Home, BookOpen, MessageSquare, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Accueil',
      testId: 'nav-home'
    },
    {
      path: '/courses',
      icon: BookOpen,
      label: 'Cours',
      testId: 'nav-courses'
    },
    {
      path: '/chat',
      icon: MessageSquare,
      label: 'Chat',
      testId: 'nav-chat'
    },
    {
      path: '/performance',
      icon: BarChart3,
      label: 'Stats',
      testId: 'nav-performance'
    },
    {
      path: '/account',
      icon: User,
      label: 'Profil',
      testId: 'nav-account'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location === '/';
    }
    return location.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              href={item.path}
              data-testid={item.testId}
            >
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                <span className={cn(
                  "text-xs",
                  active ? "font-semibold" : "font-normal"
                )}>
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
