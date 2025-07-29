"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Flag, 
  Download, 
  Edit, 
  Trash2,
  ArrowLeft,
  Send,
  Image as ImageIcon,
  Video,
  Music,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GenerationData {
  id: string;
  type: string;
  prompt: string;
  asset_url: string;
  thumbnail_url?: string;
  created_at: string;
  public: boolean;
  user_id: string;
  metadata?: any;
  profiles: {
    username: string;
    avatar_url?: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url?: string;
  };
}

const Generation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();
  const [generation, setGeneration] = useState<GenerationData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchGeneration();
      fetchComments();
      checkLikeStatus();
      getCurrentUser();
    }
  }, [id]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchGeneration = async () => {
    try {
      const { data, error } = await supabase
        .from('generations')
        .select(`
          *,
          profiles(username, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setGeneration(data as any);
    } catch (error: any) {
      toast.error("Failed to load generation");
      navigate.push('/explore');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles(username, avatar_url)
        `)
        .eq('generation_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data as any || []);
    } catch (error: any) {
      toast.error("Failed to load comments");
    }
  };

  const checkLikeStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: like } = await supabase
        .from('likes')
        .select('id')
        .eq('generation_id', id)
        .eq('user_id', user.id)
        .single();

      setIsLiked(!!like);

      // Get like count
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('generation_id', id);

      setLikeCount(count || 0);
    } catch (error) {
      // Ignore errors for anonymous users
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please log in to like content");
      navigate.push('/auth');
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('generation_id', id)
          .eq('user_id', currentUser.id);
        setLikeCount(prev => prev - 1);
      } else {
        await supabase
          .from('likes')
          .insert({
            generation_id: id,
            user_id: currentUser.id
          });
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error: any) {
      toast.error("Failed to update like");
    }
  };

  const handleComment = async () => {
    if (!currentUser) {
      toast.error("Please log in to comment");
      navigate.push('/auth');
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      await supabase
        .from('comments')
        .insert({
          generation_id: id,
          user_id: currentUser.id,
          content: newComment.trim()
        });

      setNewComment('');
      fetchComments();
      toast.success("Comment added");
    } catch (error: any) {
      toast.error("Failed to add comment");
    }
  };

  const handleDelete = async () => {
    try {
      await supabase
        .from('generations')
        .delete()
        .eq('id', id);

      toast.success("Generation deleted");
      navigate.push('/dashboard');
    } catch (error: any) {
      toast.error("Failed to delete generation");
    }
  };

  const handleFlag = async () => {
    if (!currentUser) {
      toast.error("Please log in to report content");
      navigate.push('/auth');
      return;
    }

    try {
      await supabase
        .from('flags')
        .insert({
          generation_id: id,
          user_id: currentUser.id,
          reason: 'Inappropriate content'
        });

      toast.success("Content reported");
    } catch (error: any) {
      toast.error("Failed to report content");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      default: return <ImageIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4 w-1/4"></div>
          <div className="h-96 bg-muted rounded mb-6"></div>
          <div className="h-4 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!generation) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Generation not found</h1>
        <Button onClick={() => navigate.push('/explore')}>
          Back to Explore
        </Button>
      </div>
    );
  }

  const isOwner = currentUser?.id === generation.user_id;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="mb-6 gap-2"
        onClick={() => navigate.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Generation Display */}
          <Card className="mb-6">
            <CardContent className="p-0">
              {generation.type === 'image' && (
                <img 
                  src={generation.asset_url}
                  alt={generation.prompt}
                  className="w-full h-auto rounded-lg"
                />
              )}
              {generation.type === 'video' && (
                <video 
                  src={generation.asset_url}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              )}
              {generation.type === 'audio' && (
                <div className="p-8 text-center">
                  <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <audio 
                    src={generation.asset_url}
                    controls
                    className="w-full"
                  />
                </div>
              )}
              {generation.type === 'text' && (
                <div className="p-6">
                  <div className="prose max-w-none">
                    {generation.prompt}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className="gap-2"
              >
                <Heart className="h-4 w-4" />
                {likeCount}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                {comments.length}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <div className="flex gap-2">
              {isOwner ? (
                <>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Generation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this generation? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleFlag}
                  >
                    <Flag className="h-4 w-4" />
                    Report
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Generation Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getTypeIcon(generation.type)}
                Generation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Prompt</h3>
                <p className="text-sm text-muted-foreground">
                  {generation.prompt}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={generation.profiles.avatar_url} />
                  <AvatarFallback>
                    {generation.profiles.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{generation.profiles.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(generation.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant="secondary" className="gap-1">
                  {getTypeIcon(generation.type)}
                  {generation.type}
                </Badge>
                <Badge variant={generation.public ? "default" : "secondary"}>
                  {generation.public ? "Public" : "Private"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment */}
              {currentUser && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button 
                    onClick={handleComment}
                    disabled={!newComment.trim()}
                    size="sm"
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Comment
                  </Button>
                </div>
              )}

              {!currentUser && (
                <div className="text-center text-sm text-muted-foreground">
                  <Button 
                    variant="link" 
                    onClick={() => navigate.push('/auth')}
                    className="p-0"
                  >
                    Log in to comment
                  </Button>
                </div>
              )}

              <Separator />

              {/* Comments List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.profiles.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {comment.profiles.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {comment.profiles.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No comments yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Generation;