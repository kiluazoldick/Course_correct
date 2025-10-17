import { Switch, Route } from 'wouter';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BottomNav } from '@/components/BottomNav';
import DashboardHome from './dashboard/DashboardHome';
import Courses from './dashboard/Courses';
import Quizzes from './dashboard/Quizzes';
import Chat from './dashboard/Chat';
import Performance from './dashboard/Performance';
import Subscription from './dashboard/Subscription';
import Account from './dashboard/Account';

function DashboardContent() {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar visible uniquement sur desktop */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      <div className="flex flex-col flex-1 w-full">
        {/* Header mobile simplifié (sans sidebar toggle) */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 border-b bg-background">
          <h1 className="text-lg font-semibold" data-testid="text-app-title">
            Corrige Tes Cours
          </h1>
          <ThemeToggle />
        </header>

        {/* Header desktop avec sidebar toggle */}
        <header className="hidden md:flex items-center justify-between p-4 border-b">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
          <h1 className="text-lg font-semibold" data-testid="text-app-title">
            Corrige Tes Cours
          </h1>
          <ThemeToggle />
        </header>

        {/* Main content optimisé mobile/desktop */}
        <main className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-6">
          <Switch>
            <Route path="/" component={DashboardHome} />
            <Route path="/courses" component={Courses} />
            <Route path="/quizzes" component={Quizzes} />
            <Route path="/chat" component={Chat} />
            <Route path="/performance" component={Performance} />
            <Route path="/subscription" component={Subscription} />
            <Route path="/account" component={Account} />
          </Switch>
        </main>

        {/* Bottom Nav visible uniquement sur mobile */}
        <BottomNav />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <DashboardContent />
    </SidebarProvider>
  );
}
