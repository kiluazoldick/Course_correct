import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import type { Language } from "@/lib/i18n/translations";

const LandingPage = lazy(() => import("@/pages/Home"));
const Features = lazy(() => import("@/pages/Features"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const About = lazy(() => import("@/pages/About"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const LegalNotice = lazy(() => import("@/pages/LegalNotice"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const TryDemo = lazy(() => import("@/pages/TryDemo"));
const SharedStats = lazy(() => import("@/pages/SharedStats"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-muted-foreground">Chargement...</div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes (always accessible) */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/features" component={Features} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/about" component={About} />
      <Route path="/legal" component={LegalNotice} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/try/:uploadId" component={TryDemo} />
      <Route path="/share/:token" component={SharedStats} />
      
      {/* Conditional routes based on auth */}
      {isLoading ? (
        <Route path="/">
          {() => (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-muted-foreground">Chargement...</div>
            </div>
          )}
        </Route>
      ) : !isAuthenticated ? (
        <Route path="/" component={LandingPage} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/courses" component={Dashboard} />
          <Route path="/quizzes" component={Dashboard} />
          <Route path="/chat" component={Dashboard} />
          <Route path="/performance" component={Dashboard} />
          <Route path="/subscription" component={Dashboard} />
          <Route path="/account" component={Dashboard} />
          {/* Dashboard prefixed routes for payment redirects */}
          <Route path="/dashboard/subscription" component={Dashboard} />
          <Route path="/dashboard/courses" component={Dashboard} />
          <Route path="/dashboard/quizzes" component={Dashboard} />
          <Route path="/dashboard/chat" component={Dashboard} />
          <Route path="/dashboard/performance" component={Dashboard} />
          <Route path="/dashboard/account" component={Dashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppWithLanguage() {
  const { user } = useAuth();
  const userLanguage = (user?.language as Language) || undefined;
  
  return (
    <LanguageProvider initialLanguage={userLanguage}>
      <Toaster />
      <Suspense fallback={<PageLoader />}>
        <Router />
      </Suspense>
    </LanguageProvider>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <AppWithLanguage />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
