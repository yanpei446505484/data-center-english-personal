import { useCallback } from 'react';
import { Home, BookOpen, Layers, Brain, BarChart3, Star, BookX, Play, Wand2, BellRing } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Image } from '@/components/ui/image';
import { appLogoUrl } from '@/lib/publicAsset';

const NAV_ITEMS = [
  {
    path: '/',
    label: '学习首页',
    icon: Home,
  },
  {
    path: '/scenarios',
    label: '场景练习',
    icon: Play,
  },
  {
    path: '/browse',
    label: '句子浏览',
    icon: BookOpen,
  },
  {
    path: '/alarms',
    label: '告警与运维英语',
    icon: BellRing,
  },
  {
    path: '/flashcard',
    label: '闪卡学习',
    icon: Layers,
  },
  {
    path: '/quiz',
    label: '自测挑战',
    icon: Brain,
  },

  {
    path: '/text-analysis',
    label: '文本分析',
    icon: Wand2,
  },
  {
    path: '/progress',
    label: '学习记录',
    icon: BarChart3,
  },
  {
    path: '/wrong-book',
    label: '错题本',
    icon: BookX,
  },
  {
    path: '/favorites',
    label: '我的收藏',
    icon: Star,
  },
];

export default function AppSidebar() {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  // Close mobile sidebar sheet after navigation
  const handleNavClick = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3 group-data-[state=collapsed]:px-0 group-data-[state=collapsed]:justify-center">
          <Image
            src={appLogoUrl}
            alt="BDC"
            className="size-8 shrink-0 rounded-md object-contain"
          />
          <div className="flex-1 min-w-0 group-data-[state=collapsed]:hidden">
            <div className="text-sm font-semibold truncate">数据中心英语培训 · 个人版</div>
            <div className="text-xs text-muted-foreground truncate">Personal Edition</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-2">
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/' ? pathname === '/' : pathname === item.path || pathname.startsWith(`${item.path}/`);
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={item.label} isActive={isActive}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className="flex items-center gap-2"
                      onClick={handleNavClick}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="group-data-[state=collapsed]:hidden">
                        {item.label}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3 group-data-[state=collapsed]:px-0 group-data-[state=collapsed]:justify-center">
          <div className="size-7 shrink-0 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-xs font-medium text-secondary-foreground">YP</span>
          </div>
          <div className="flex-1 min-w-0 group-data-[state=collapsed]:hidden">
            <div className="text-sm font-medium truncate">Yan Pei</div>
            <div className="text-xs text-muted-foreground truncate">运维值班</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
