"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Image, Video, Music, FileText, Wand2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Generate = () => {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<string>("");
  const [isPublic, setIsPublic] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<any[]>([]);

  const navigate = useRouter();
  const params = useParams();
  useEffect(() => {
    // Assuming your dynamic route is /generate/[type], so type is a key in params
    const typeParam = params?.type;
    if (typeof typeParam === "string") {
      setType(typeParam);
    }
  }, [params]);

  const generationTypes = [
    {
      value: "image",
      label: "Image",
      icon: Image,
      description: "Generate stunning visual content",
    },
    {
      value: "video",
      label: "Video",
      icon: Video,
      description: "Create dynamic video content",
    },
    {
      value: "audio",
      label: "Audio",
      icon: Music,
      description: "Compose music and sound",
    },
    {
      value: "text",
      label: "Text",
      icon: FileText,
      description: "Generate written content",
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || !type) {
      toast.error("Please enter a prompt and select a generation type");
      return;
    }

    setGenerating(true);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast.error("You must be logged in to generate content");
        navigate.push("/auth");
        return;
      }

      // For now, we'll create a placeholder generation
      // In a real app, this would integrate with AI APIs
      const { data, error } = await supabase
        .from("generations")
        .insert({
          user_id: user.data.user.id,
          type,
          prompt,
          asset_url: `https://via.placeholder.com/512x512?text=${type.toUpperCase()}`,
          thumbnail_url: `https://via.placeholder.com/256x256?text=${type.toUpperCase()}`,
          public: isPublic,
          status: "completed",
          metadata: {
            generated_at: new Date().toISOString(),
            model: `${type}-model-v1`,
          },
        })
        .select()
        .single();

      if (error) throw error;

      // Add the new generation to the list
      setGeneratedItems((prev) => [data, ...prev]);
      toast.success("Generation completed!");
      setPrompt("");
    } catch (error: any) {
      toast.error("Generation failed: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const getTypeInfo = () => {
    const typeInfo = generationTypes.find((t) => t.value === type);
    return (
      typeInfo || {
        label: "Content",
        icon: Wand2,
        description: "Generate amazing content",
      }
    );
  };

  const typeInfo = getTypeInfo();

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left Side - Generation Controls */}
      <div className="w-1/2 bg-gradient-to-br from-background to-muted/20 border-r">
        <div className="h-full flex flex-col p-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded bg-primary/10">
                <typeInfo.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Generate {typeInfo.label}</h1>
                <p className="text-xs text-muted-foreground">
                  {typeInfo.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {/* Prompt Input */}
            <Card className="border-0 shadow-sm bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1.5 text-sm">
                  <FileText className="h-3.5 w-3.5" />
                  Describe Your Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`Describe what you want to create... ${
                    type === "image"
                      ? 'e.g., "A mystical forest with glowing creatures"'
                      : type === "video"
                      ? 'e.g., "A cinematic drone shot of a waterfall"'
                      : type === "audio"
                      ? 'e.g., "Uplifting orchestral music"'
                      : type === "text"
                      ? 'e.g., "A story about time travel"'
                      : "Describe your vision..."
                  }`}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] text-xs border-0 bg-background/80 resize-none"
                  disabled={!type}
                />
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border-0 shadow-sm bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-2.5 rounded bg-background/60">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-primary/10">
                      <Wand2 className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <Label
                        htmlFor="public-toggle"
                        className="text-xs font-medium"
                      >
                        Make Public
                      </Label>
                      <p className="text-[10px] text-muted-foreground">
                        Share with community
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="public-toggle"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generate Button */}
          <div className="pt-3">
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || !type || generating}
              className="w-full gap-2 py-4 text-sm font-semibold bg-primary hover:bg-primary/90 shadow-sm"
              size="sm"
            >
              <Wand2
                className={`h-4 w-4 ${generating ? "animate-spin" : ""}`}
              />
              {generating ? "Creating..." : `Generate ${typeInfo.label}`}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Generated Results */}
      <div className="w-1/2 bg-gradient-to-bl from-muted/10 to-background">
        <div className="h-full flex flex-col">
          <div className="border-b bg-background/95 backdrop-blur p-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-primary/10">
                <Image className="h-3.5 w-3.5 text-primary" />
              </div>
              <h2 className="text-sm font-bold">Your Creations</h2>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-3">
            {generatedItems.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-xs">
                  <div className="p-3 rounded bg-primary/10 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <typeInfo.icon className="h-8 w-8 text-primary/60" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">
                    Ready to Create
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your generated {typeInfo.label.toLowerCase()} will appear
                    here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {generatedItems.map((item, index) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all group bg-card/50"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.asset_url}
                        alt={item.prompt}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 left-1.5">
                        <span className="bg-background/90 backdrop-blur text-foreground px-1.5 py-0.5 rounded text-[10px] font-medium border">
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium line-clamp-2 mb-1">
                            {item.prompt}
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            {new Date(item.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-6 px-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
