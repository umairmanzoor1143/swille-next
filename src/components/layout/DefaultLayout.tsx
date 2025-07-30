"use client";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../Loading";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  Home,
  Compass,
  Wand2,
  History,
  Settings,
  User,
  LogOut,
  Image,
  Video,
  Music,
  Menu,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const AppSidebar = () => {
  const pathname = usePathname();

  const mainNavItems = [
    { title: "Explore", url: "/", icon: Compass },
    { title: "Dashboard", url: "/dashboard", icon: History },
  ];

  const generateItems = [
    { title: "Images", url: "/generate?type=image", icon: Image },
    { title: "Videos", url: "/generate?type=video", icon: Video },
    { title: "Audio", url: "/generate?type=audio", icon: Music },
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">FreeGen</span>
                  <span className="truncate text-xs">AI Content Creator</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>AI Create</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generateItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname.startsWith('/generate') && pathname.includes(item.url.split('=')[1])}
                  >
                    <Link href={item.url}>
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
    </Sidebar>
  );
};

const TopNav = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
    } else {
      toast.success("Logged out successfully");
      navigate.push("/");
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
      </div>

      <div className="ml-auto flex items-center space-x-2 px-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.user_metadata?.avatar_url}
                    alt={user.email}
                  />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem
                onClick={() =>
                  navigate.push(
                    `/profile/${user.user_metadata?.username || "me"}`
                  )
                }
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate.push("/dashboard/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={() => navigate.push("/auth")}
              size="sm"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate.push("/auth")}
              size="sm"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

const AppLayout = ({ children, className }: any) => {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";

  useEffect(() => {
    // Simulate load time or wait for hydration
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  // Don't show sidebar layout on auth page
  if (isAuthPage) {
    return (
      <html lang="en">
        <body className={className}>
          {loading ? <LoadingSpinner /> : children}
        </body>
      </html>
    );
  }

  if (loading) {
    return (
      <html lang="en">
        <body>
          <LoadingSpinner />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <TopNav />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
};

export default AppLayout;