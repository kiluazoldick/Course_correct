import { LayoutDashboard, BookOpen, Brain, MessageCircle, TrendingUp, Crown, User, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useLocation, Link } from 'wouter';
import { queryClient } from '@/lib/queryClient';

const menuItems = [
  {
    title: 'Tableau de bord',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Mes cours',
    url: '/courses',
    icon: BookOpen,
  },
  {
    title: 'Mes quiz',
    url: '/quizzes',
    icon: Brain,
  },
  {
    title: 'Tariq IA',
    url: '/chat',
    icon: MessageCircle,
  },
  {
    title: 'Performances',
    url: '/performance',
    icon: TrendingUp,
  },
  {
    title: 'Premium',
    url: '/subscription',
    icon: Crown,
  },
  {
    title: 'Mon compte',
    url: '/account',
    icon: User,
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      queryClient.setQueryData(['/api/auth/user'], null);
      window.location.href = `${window.location.origin}/login`;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-active={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} data-testid="button-logout">
              <LogOut />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
