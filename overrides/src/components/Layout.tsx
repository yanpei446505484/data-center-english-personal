import { useEffect, useRef, Suspense, Component, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Image } from '@/components/ui/image';

import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { logger } from '@/lib/app-logger';
import { appLogoUrl } from '@/lib/publicAsset';
import { isChunkLoadError, recoverFromChunkLoad } from '@/lib/chunkRecovery';


/** Loading skeleton shown during route transitions */
function PageLoadingFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted/60" />
      <div className="h-4 w-3/4 rounded bg-muted/60" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="h-32 rounded-md bg-muted/40" />
        <div className="h-32 rounded-md bg-muted/40" />
      </div>
    </div>
  );
}

/** Error boundary that catches rendering crashes with retry */
interface ErrorBoundaryProps {
  children: ReactNode;
  locationKey: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RouteErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private autoRetried = false;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    logger.error('[Layout] Route render error:', String(error));
    // Auto-retry once for chunk load errors
    if (isChunkLoadError(error) && !this.autoRetried) {
      this.autoRetried = true;
      // Remove a stale service worker/cache before loading the current release.
      setTimeout(() => void recoverFromChunkLoad(), 300);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state when route changes — allows retry via navigation
    if (prevProps.locationKey !== this.props.locationKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
      this.autoRetried = false;
    }
  }

  handleRetry = () => {
    if (isChunkLoadError(this.state.error)) {
      void recoverFromChunkLoad(true);
      return;
    }
    // Reset error state and let React re-render (re-trigger lazy import)
    this.setState({ hasError: false, error: null });
    this.autoRetried = false;
  };

  handleReload = () => {
    void recoverFromChunkLoad(true);
  };

  render() {
    if (this.state.hasError) {
      const isChunk = isChunkLoadError(this.state.error);
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <AlertTriangle className="size-10 text-warning" />
          <p className="text-sm text-muted-foreground text-center">
            {isChunk ? '检测到版本更新，正在加载最新页面…' : '页面加载出错，请重试'}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleRetry}
              className="gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              重试
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleReload}
              className="gap-1.5"
            >
              刷新页面
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const Layout = () => {
  const location = useLocation();

  const mainRef = useRef<HTMLElement>(null);

  // Scroll to top on route change — prevents mobile "white page" caused by
  // scroll position carryover from previous page
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-w-0 overflow-x-hidden">
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/30">
          <div className="flex h-14 items-center gap-3 px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2.5 min-w-0">
              <Image
                src={appLogoUrl}
                alt="BDC"
                className="size-7 shrink-0 rounded-md object-contain"
              />
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-sm font-semibold text-foreground tracking-tight truncate">
                  数据中心英语培训 · 个人版
                </span>
                <span className="text-xs text-muted-foreground tracking-tight truncate hidden sm:block">
                  Personal Edition
                </span>
              </div>
            </div>
            <div className="ml-auto text-xs text-muted-foreground">无需登录 · 全部功能可用</div>
          </div>
        </header>
        <main ref={mainRef} className="flex-1 min-h-0 w-full overflow-y-auto px-4 md:px-6 lg:px-8 py-6">
          <RouteErrorBoundary locationKey={location.pathname}>
            <Suspense fallback={<PageLoadingFallback />}>
              <Outlet />
            </Suspense>
          </RouteErrorBoundary>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
