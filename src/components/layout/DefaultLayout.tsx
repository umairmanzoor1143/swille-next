"use client";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../Loading";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
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
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
// import "../../css/06a3730f89c0b076.css"

const AppSidebar = () => {
  const { state } = useSidebar();
  const router = useParams();
  const { path } = router;
  const currentPath = path;

  const mainNavItems = [
    { title: "Explore", url: "/explore", icon: Compass },
    { title: "Dashboard", url: "/dashboard", icon: History },
  ];

  const generateItems = [
    { title: "Images", url: "/generate?type=image", icon: Image },
    { title: "Videos", url: "/generate?type=video", icon: Video },
    { title: "Audio", url: "/generate?type=audio", icon: Music },
  ];

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className={isCollapsed ? "w-20" : "w-72"}
      collapsible="icon"
      side="left"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-3 px-6 py-4">
            <Sparkles className="h-6 w-6 text-primary" />
            {!isCollapsed && <span className="font-bold text-lg">FreeGen</span>}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 px-4">
                    <Link
                      href={item.url}
                      className={
                        currentPath === item.url
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="mr-4 h-5 w-5" />
                      {!isCollapsed && (
                        <span className="text-base font-medium">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-base px-6 py-3 font-semibold">
            {!isCollapsed && "AI Create"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generateItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 px-4">
                    <Link
                      href={item.url}
                      className={
                        currentPath === item.url
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="mr-4 h-5 w-5" />
                      {!isCollapsed && (
                        <span className="text-base font-medium">
                          {item.title}
                        </span>
                      )}
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
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
        </div>

        <div className="ml-auto flex items-center space-x-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.email}
                    />
                    <AvatarFallback className="text-base">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52" align="end" forceMount>
                <DropdownMenuItem
                  onClick={() =>
                    navigate.push(
                      `/profile/${user.user_metadata?.username || "me"}`
                    )
                  }
                >
                  <User className="mr-3 h-5 w-5" />
                  <span className="text-base">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate.push("/dashboard/settings")}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  <span className="text-base">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="text-base">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate.push("/auth")}
                className="text-base h-10 px-4"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate.push("/auth")}
                className="text-base h-10 px-6"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const AppLayout = ({ children, className }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
//  const isClient = typeof window !== "undefined"; // Check if running on the client side
  // const navigate = isClient ? useRouter() : null; // Use useRouter only on the client side
  // const { pathname, query } = navigate || { pathname: "", query: {} };
  // const isAuthPage = pathname === "/auth";

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     setUser(user);
  //     setLoading(false);

  //     // Redirect to auth if not logged in and trying to access protected routes
  //     if (!user && !isAuthPage && location.pathname !== "/explore") {
  //       navigate?.push("/auth");
  //     }
  //   };

  //   checkAuth();

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     setUser(session?.user || null);
  //     if (!session?.user && !isAuthPage && location.pathname !== "/explore") {
  //       navigate?.push("/auth");
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [location.pathname, navigate, isAuthPage]);
 useEffect(() => {
    // Simulate load time or wait for hydration
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); // You can adjust the delay

    return () => clearTimeout(timeout);
  }, []);
  // Don't show layout on auth page


  if (loading) {
    return (
      <html lang="en">
        <body>
          <LoadingSpinner />
        </body>
      </html>
    );
    // You can use your custom loader here
  }

  return (
    <html lang="en">
      {/* <Header /> */}
      <body className={className}>
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <TopNav />
              <main className="flex-1 overflow-auto">
                {location.pathname === "/generate" ? (
                  children
                ) : (
                  <div className="container mx-auto p-4">{children}</div>
                )}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
};

export default AppLayout;
