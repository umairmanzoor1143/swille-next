"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Image, Video, Music, FileText, Heart, MessageCircle, Calendar, TrendingUp, Zap } from "lucide-react";
import { useRouter} from 'next/navigation';

import { toast } from "sonner";

interface Generation {
  id: string;
  type: string;
  prompt: string;
  asset_url: string;
  thumbnail_url?: string;
  created_at: string;
  public: boolean;
  likes?: { count: number }[];
  comments?: { count: number }[];
}

const Dashboard = () => {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');
  const navigate = useRouter();

  useEffect(() => {
    fetchGenerations();
  }, []);

  const fetchGenerations = async () => {
    try {
      const { data, error } = await supabase
        .from('generations')
        .select(`
          *,
          likes(count),
          comments(count)
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id as string)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGenerations(data as any || []);
    } catch (error: any) {
      toast.error("Failed to load generations");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      default: return <Image className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'video': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'audio': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'text': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const stats = [
    { icon: Image, label: "Images Created", value: generations.filter(g => g.type === 'image').length, color: "text-blue-500" },
    { icon: Video, label: "Videos Made", value: generations.filter(g => g.type === 'video').length, color: "text-purple-500" },
    { icon: Music, label: "Audio Generated", value: generations.filter(g => g.type === 'audio').length, color: "text-green-500" },
    { icon: Heart, label: "Total Likes", value: generations.reduce((acc, g) => acc + (g.likes?.[0]?.count || 0), 0), color: "text-red-500" }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 rounded-t-lg" />
              <CardContent className="p-4">
                <Skeleton className="h-4 mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">View your AI content</p>
        </div>
        <Button onClick={() => navigate.push('/generate')} size="sm" className="gap-1.5">
          <Plus className="h-3 w-3" />
          Create
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-muted">
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Creations */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1.5 text-base">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              My Creations
            </CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-8">
                <TabsTrigger value="recent" className="text-xs px-2">Recent</TabsTrigger>
                <TabsTrigger value="popular" className="text-xs px-2">Popular</TabsTrigger>
                <TabsTrigger value="public" className="text-xs px-2">Public</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {generations.length === 0 ? (
            <div className="text-center py-8">
              <div className="p-2.5 rounded bg-muted w-fit mx-auto mb-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-1">No creations yet</h3>
              <p className="text-xs text-muted-foreground mb-3">Start creating content with AI</p>
              <Button onClick={() => navigate.push('/generate')} size="sm">
                Create First Piece
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {generations.slice(0, 12).map((generation) => (
                <Card 
                  key={generation.id} 
                  className="cursor-pointer hover:shadow-md transition-all group overflow-hidden border-0 bg-card/50"
                  onClick={() => navigate.push(`/generation/${generation.id}`)}
                >
                  <div className="relative">
                    {generation.thumbnail_url || generation.asset_url ? (
                      <img 
                        src={generation.thumbnail_url || generation.asset_url}
                        alt={generation.prompt}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-32 bg-muted flex items-center justify-center">
                        {getTypeIcon(generation.type)}
                      </div>
                    )}
                    
                    <Badge className={`absolute top-1.5 left-1.5 gap-0.5 text-xs py-0 px-1 ${getTypeColor(generation.type)}`}>
                      {getTypeIcon(generation.type)}
                      {generation.type}
                    </Badge>

                    <div className="absolute top-1.5 right-1.5">
                      <Badge variant={generation.public ? "default" : "secondary"} className="text-[10px] py-0 px-1 h-4">
                        {generation.public ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-2.5">
                    <p className="text-xs font-medium line-clamp-2 mb-2">{generation.prompt}</p>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                      <span>{new Date(generation.created_at).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-0.5">
                          <Heart className="h-2.5 w-2.5" />
                          {generation.likes?.[0]?.count || 0}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MessageCircle className="h-2.5 w-2.5" />
                          {generation.comments?.[0]?.count || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
