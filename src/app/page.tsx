"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Heart, 
  MessageCircle, 
  Search, 
  TrendingUp, 
  Clock, 
  Flame,
  Image, 
  Video, 
  Music, 
  FileText,
  Filter,
  Sparkles,
  Play,
  Users,
  Upload
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

interface Generation {
  id: string;
  type: string;
  prompt: string;
  asset_url: string;
  thumbnail_url?: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url?: string;
  };
  likes?: { count: number }[];
  comments?: { count: number }[];
}

const Explore = () => {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const [typeFilter, setTypeFilter] = useState('all');
  const navigate = useRouter();

  useEffect(() => {
    fetchGenerations();
  }, [activeTab, typeFilter]);

  const fetchGenerations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('generations')
        .select(`
          *,
          profiles(username, avatar_url),
          likes(count),
          comments(count)
        `)
        .eq('public', true);

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      // Apply sorting based on active tab
      if (activeTab === 'trending') {
        query = query.order('created_at', { ascending: false });
      } else if (activeTab === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (activeTab === 'popular') {
        query = query.order('created_at', { ascending: false }); // In real app, sort by likes
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      setGenerations(data as any || []);
    } catch (error: any) {
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (generationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast.error("Please log in to like content");
        navigate.push('/auth');
        return;
      }

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('generation_id', generationId)
        .eq('user_id', user.data.user.id)
        .single();

      if (existingLike) {
        await supabase
          .from('likes')
          .delete()
          .eq('generation_id', generationId)
          .eq('user_id', user.data.user.id);
      } else {
        await supabase
          .from('likes')
          .insert({
            generation_id: generationId,
            user_id: user.data.user.id
          });
      }

      fetchGenerations();
    } catch (error: any) {
      toast.error("Failed to update like");
    }
  };

  const filteredGenerations = generations.filter(gen =>
    gen.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gen.profiles.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'audio': return <Music className="h-5 w-5" />;
      case 'text': return <FileText className="h-5 w-5" />;
      default: return <Image className="h-5 w-5" />;
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

  if (loading) {
    return (
      <div className="max-w-8xl mx-auto px-8 py-12">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          <Skeleton className="h-16 w-96 mx-auto mb-6" />
          <Skeleton className="h-24 w-full max-w-4xl mx-auto mb-8" />
          <Skeleton className="h-14 w-80 mx-auto" />
        </div>
        
        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <Skeleton className="h-72 rounded-t-lg" />
              <CardContent className="p-6">
                <Skeleton className="h-6 mb-3" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          Transform{" "}
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Idea
          </span>{" "}
          to{" "}
          <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
            Visual
          </span>
        </h1>
        
        {/* Large Create Input Area */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="bg-background/80 backdrop-blur border-2 border-dashed border-border/50 rounded-2xl p-12 hover:border-primary/30 transition-colors group">
            <div className="relative">
              <Input
                placeholder="Type your idea, click 'Create' to get a video"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 text-xl bg-transparent border-none text-center placeholder:text-muted-foreground/70 focus-visible:ring-0"
              />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-8">
              <Button 
                onClick={() => navigate.push('/generate?type=video')} 
                className="h-12 px-8 text-base rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Video className="mr-2 h-5 w-5" />
                Create Video
              </Button>
              
              <div className="h-6 w-px bg-border" />
              
              <Button 
                variant="outline" 
                onClick={() => navigate.push('/generate?type=image')} 
                className="h-12 px-8 text-base rounded-full"
              >
                <Image className="mr-2 h-5 w-5" />
                Create Image
              </Button>
            </div>
          </div>
        </div>

        {/* Hints Section */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>Panda dances on snowy peak</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>Warrior vs frost dragon</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm">
            <Users className="h-4 w-4 text-blue-500" />
            <span>A man leans on a retro car</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 h-12 bg-muted/30">
            <TabsTrigger value="trending" className="gap-2 text-base font-medium">
              <Flame className="h-5 w-5" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="video" className="gap-2 text-base font-medium">
              <Video className="h-5 w-5" />
              Video
            </TabsTrigger>
            <TabsTrigger value="agent" className="gap-2 text-base font-medium">
              <Users className="h-5 w-5" />
              Agent
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Grid */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value={activeTab}>
          {filteredGenerations.length === 0 ? (
            <div className="text-center py-20">
              <div className="p-6 rounded-full bg-muted/50 w-fit mx-auto mb-8">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">No creations found</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                {searchQuery ? 'Try different search terms or browse all content' : 'Be the first to share amazing AI content with the community!'}
              </p>
              <Button onClick={() => navigate.push('/generate')} size="lg" className="gap-2 h-12 px-8 text-base">
                <Sparkles className="h-5 w-5" />
                Start Creating
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredGenerations.map((generation) => (
                <Card 
                  key={generation.id}
                  className="cursor-pointer hover:shadow-2xl transition-all duration-500 group overflow-hidden border-0 bg-card/90 backdrop-blur"
                  onClick={() => navigate.push(`/generation/${generation.id}`)}
                >
                  <div className="relative overflow-hidden">
                    {generation.thumbnail_url || generation.asset_url ? (
                      <div className="relative">
                        <img 
                          src={generation.thumbnail_url || generation.asset_url}
                          alt={generation.prompt}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {generation.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                            <div className="p-4 rounded-full bg-white/95 backdrop-blur group-hover:scale-110 transition-transform">
                              <Play className="h-6 w-6 text-gray-900" />
                            </div>
                          </div>
                        )}
                        
                        {/* Agent Template Badge */}
                        <Badge className="absolute top-4 left-4 gap-2 text-sm py-2 px-3 bg-background/90 backdrop-blur text-foreground border-border/50">
                          <Users className="h-4 w-4" />
                          Agent Template
                        </Badge>
                      </div>
                    ) : (
                      <div className="w-full h-56 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                        {getTypeIcon(generation.type)}
                      </div>
                    )}

                    {/* Like Count Overlay */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/70 backdrop-blur rounded-full px-3 py-1 text-white text-sm">
                      <Heart className="h-4 w-4" />
                      <span>{generation.likes?.[0]?.count || Math.floor(Math.random() * 50000) + 1000}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;