"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Bell, Key, Palette, Trash2, Download, Save, Eye, EyeOff, Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState(settings.openaiApiKey || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({ openaiApiKey: apiKey });
    setSaved(true);
    toast.success("Settings saved!");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold mb-1">Settings</h2>
        <p className="text-muted-foreground text-sm mb-6">Manage your account and preferences</p>

        <Tabs defaultValue="account">
          <TabsList className="glass border border-white/10 mb-6 h-auto gap-1 p-1 flex flex-wrap">
            {[
              { value: "account", label: "Account", icon: User },
              { value: "appearance", label: "Appearance", icon: Palette },
              { value: "api", label: "API Keys", icon: Key },
              { value: "notifications", label: "Notifications", icon: Bell },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-sm">
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4 mt-0">
            <Card className="glass border-white/10 p-6">
              <h3 className="font-semibold mb-4">Profile</h3>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                    DU
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Demo User</p>
                  <p className="text-sm text-muted-foreground">demo@codereview.ai</p>
                  <Badge className="mt-1 bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Pro Plan</Badge>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="first-name-settings" className="text-sm mb-1.5 block">First name</Label>
                    <Input id="first-name-settings" defaultValue="Demo" className="glass border-white/10" />
                  </div>
                  <div>
                    <Label htmlFor="last-name-settings" className="text-sm mb-1.5 block">Last name</Label>
                    <Input id="last-name-settings" defaultValue="User" className="glass border-white/10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email-settings" className="text-sm mb-1.5 block">Email</Label>
                  <Input id="email-settings" defaultValue="demo@codereview.ai" className="glass border-white/10" />
                </div>
              </div>
              <Button onClick={handleSave} className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                {saved ? <><Check className="w-4 h-4 mr-1.5" /> Saved!</> : <><Save className="w-4 h-4 mr-1.5" /> Save Changes</>}
              </Button>
            </Card>

            <Card className="glass border-white/10 p-6">
              <h3 className="font-semibold mb-1 text-red-400">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">Irreversible and destructive actions</p>
              <div className="flex gap-3">
                <Button variant="outline" className="glass border-white/10 hover:bg-white/5 gap-1.5 text-sm">
                  <Download className="w-3.5 h-3.5" />
                  Export Data
                </Button>
                <Button variant="outline" className="glass border-red-500/30 hover:bg-red-500/10 text-red-400 gap-1.5 text-sm">
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Account
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4 mt-0">
            <Card className="glass border-white/10 p-6">
              <h3 className="font-semibold mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {(["dark", "light", "system"] as const).map((t) => (
                  <button
                    key={t}
                    className={`p-4 rounded-xl border-2 transition-all capitalize font-medium text-sm ${
                      settings.theme === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 glass hover:border-white/20"
                    }`}
                    onClick={() => { updateSettings({ theme: t }); toast.success(`Theme set to ${t}`); }}
                  >
                    {t === "dark" ? "🌙" : t === "light" ? "☀️" : "💻"} {t}
                  </button>
                ))}
              </div>
            </Card>
            <Card className="glass border-white/10 p-6 space-y-4">
              <h3 className="font-semibold mb-2">Editor Preferences</h3>
              {[
                { label: "Minimap", key: "minimap" as const, desc: "Show code minimap in editor" },
                { label: "Word Wrap", key: "wordWrap" as const, desc: "Wrap long lines in editor" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    id={`setting-${item.key}`}
                    checked={settings.editor[item.key] as boolean}
                    onCheckedChange={(v) => updateSettings({ editor: { ...settings.editor, [item.key]: v } })}
                  />
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-4 mt-0">
            <Card className="glass border-white/10 p-6">
              <h3 className="font-semibold mb-1">OpenAI API Key</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use your own OpenAI API key. This is stored locally and never sent to our servers.
              </p>
              <div className="relative">
                <Input
                  id="api-key-input"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="glass border-white/10 pr-10 font-mono text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowApiKey(!showApiKey)}
                  aria-label={showApiKey ? "Hide API key" : "Show API key"}
                >
                  {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
              </div>
              <div className="flex gap-2 mt-3">
                <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  {saved ? <><Check className="w-4 h-4 mr-1.5" /> Saved!</> : <><Save className="w-4 h-4 mr-1.5" /> Save Key</>}
                </Button>
                <Button variant="outline" className="glass border-white/10" onClick={() => { setApiKey(""); updateSettings({ openaiApiKey: "" }); }}>
                  Clear
                </Button>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-400">
                  💡 <strong>Demo Mode Active:</strong> Set <code className="bg-black/20 px-1 rounded">NEXT_PUBLIC_DEMO_MODE=false</code> and add a real OpenAI key to use GPT-4o for real reviews.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4 mt-0">
            <Card className="glass border-white/10 p-6 space-y-4">
              <h3 className="font-semibold mb-2">Notification Preferences</h3>
              {[
                { key: "reviewComplete" as const, label: "Review Complete", desc: "Notify when code review finishes" },
                { key: "weeklyReport" as const, label: "Weekly Report", desc: "Get a weekly summary of your code quality" },
                { key: "tips" as const, label: "Tips & Tricks", desc: "Receive coding best practice tips" },
              ].map((item) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      id={`notif-${item.key}`}
                      checked={settings.notifications[item.key]}
                      onCheckedChange={(v) => updateSettings({ notifications: { ...settings.notifications, [item.key]: v } })}
                    />
                  </div>
                  <Separator className="mt-3 bg-white/10" />
                </div>
              ))}
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
