"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Edit, 
  Save, 
  X, 
  Heart, 
  MessageCircle, 
  Image, 
  Video, 
  Music, 
  FileText,
  Calendar,
  MapPin,
  Link as LinkIcon
} from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  social_links?: any;
}

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

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('creations');

  useEffect(() => {
    if (username) {
      fetchProfile();
      fetchGenerations();
    }
    getCurrentUser();
  }, [username]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      setProfile(data as any);
      setEditForm({
        username: data.username || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || ''
      });
    } catch (error: any) {
      toast.error("Profile not found");
      navigate.push('/explore');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenerations = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!profileData) return;

      let query = supabase
        .from('generations')
        .select(`
          *,
          likes(count),
          comments(count)
        `)
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== profileData.id) {
        query = query.eq('public', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      setGenerations(data as any || []);
    } catch (error: any) {
      toast.error("Failed to load generations");
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username,
          bio: editForm.bio,
          avatar_url: editForm.avatar_url
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({
        ...profile,
        username: editForm.username,
        bio: editForm.bio,
        avatar_url: editForm.avatar_url
      });
      setIsEditing(false);
      toast.success("Profile updated");

      if (editForm.username !== username) {
        navigate.push(`/profile/${editForm.username}`);
      }
    } catch (error: any) {
      toast.error("Failed to update profile");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-3 w-3" />;
      case 'video': return <Video className="h-3 w-3" />;
      case 'audio': return <Music className="h-3 w-3" />;
      case 'text': return <FileText className="h-3 w-3" />;
      default: return <Image className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <Button onClick={() => navigate.push('/explore')}>
          Back to Explore
        </Button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {isOwnProfile && (
                <Button
                  variant={isEditing ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editForm.username}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">{profile.username}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="creations">Creations</TabsTrigger>
        </TabsList>

        <TabsContent value="creations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.map((generation) => (
              <Card 
                key={generation.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate.push(`/generation/${generation.id}`)}
              >
                <div className="relative">
                  {generation.thumbnail_url || generation.asset_url ? (
                    <img 
                      src={generation.thumbnail_url || generation.asset_url}
                      alt={generation.prompt}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                      {getTypeIcon(generation.type)}
                    </div>
                  )}
                  
                  <Badge className="absolute top-2 left-2 gap-1" variant="secondary">
                    {getTypeIcon(generation.type)}
                    {generation.type}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <p className="font-medium line-clamp-2 mb-2">{generation.prompt}</p>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{new Date(generation.created_at).toLocaleDateString()}</span>
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {generation.likes?.[0]?.count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {generation.comments?.[0]?.count || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
