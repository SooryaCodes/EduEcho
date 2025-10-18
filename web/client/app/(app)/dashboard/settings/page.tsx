'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";
import api from "@/lib/api";
import { Loader2, User, Bell, Shield, LogOut } from "lucide-react";

const learnerTypes = ["QuickLearner", "FullMark", "Average", "Beginner"];
const languages = ["en", "es", "fr", "de", "hi", "ml", "ta"];

export default function SettingsPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    type: user?.type || "Average",
    language: user?.language || "en",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("Please log in again");
        router.push("/auth/login");
        return;
      }

      const userData = JSON.parse(storedUser);
      
      const response: any = await api.put(`/users/${userData._id}`, {
        name: formData.name,
        type: formData.type,
        language: formData.language,
      });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-cabinet font-bold mb-2">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Settings */}
        <Card className="p-8 rounded-3xl border-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-light-purple flex items-center justify-center">
              <User className="w-6 h-6 text-[rgb(108,93,211)]" />
            </div>
            <h2 className="text-2xl font-cabinet font-bold">Profile</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
                className="h-12 rounded-2xl border-2 focus-visible:ring-[rgb(108,93,211)]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="h-12 rounded-2xl border-2 bg-muted"
              />
              <p className="text-sm text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Preferred Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
                disabled={loading}
              >
                <SelectTrigger className="h-12 rounded-2xl border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Learning Preferences */}
        <Card className="p-8 rounded-3xl border-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-light-yellow flex items-center justify-center">
              <Bell className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-cabinet font-bold">Learning Preferences</h2>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Learning Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              disabled={loading}
              className="space-y-3"
            >
              {learnerTypes.map((type) => (
                <label
                  key={type}
                  className={`flex items-center space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.type === type
                      ? "border-[rgb(108,93,211)] bg-light-purple"
                      : "border-border hover:border-[rgb(108,93,211)]/50"
                  }`}
                >
                  <RadioGroupItem value={type} />
                  <span className="font-medium">{type}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 h-14 rounded-2xl bg-purple-card hover:bg-[rgb(129,140,248)] font-semibold text-base"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>

      {/* Danger Zone */}
      <Card className="p-8 rounded-3xl border-2 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-cabinet font-bold text-red-900 dark:text-red-400">Danger Zone</h2>
        </div>

        <p className="text-muted-foreground mb-6">
          Once you log out, you'll need to verify your email again to access your account.
        </p>

        <Button
          type="button"
          variant="destructive"
          onClick={handleLogout}
          className="h-12 px-8 rounded-2xl font-semibold"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>
      </Card>
    </div>
  );
}

