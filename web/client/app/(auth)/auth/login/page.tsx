'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2, Mail } from "lucide-react";
import { useUserStore } from "@/stores/user-store";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [formData, setFormData] = useState({
    email: "",
    code: "",
  });

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      // For MVP, check if user exists
      const response: any = await api.get(`/users?email=${formData.email}`);
      
      if (!response.data) {
        toast.error("No account found with this email");
        return;
      }
      
      setStep('verify');
      toast.success("Verification code sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.code.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setLoading(true);

    try {
      // Get user
      const response: any = await api.get(`/users?email=${formData.email}`);
      
      toast.success("Logged in successfully!");
      
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl rounded-3xl">
      <CardHeader className="space-y-3 pb-8">
        <Link href="/" className="flex items-center space-x-2 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-card flex items-center justify-center">
            <span className="text-white font-bold text-xl font-cabinet">E</span>
          </div>
          <span className="font-cabinet font-bold text-xl">EduEcho</span>
        </Link>
        <CardTitle className="text-4xl font-cabinet font-bold">Welcome back</CardTitle>
        <CardDescription className="text-base">
          {step === 'email' 
            ? "Enter your email to sign in" 
            : "Enter the verification code sent to your email"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
                className="h-12 rounded-2xl border-2 focus-visible:ring-[rgb(108,93,211)]"
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  Send verification code
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="font-medium">Verification Code</Label>
              <Input
                id="code"
                placeholder="000000"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                required
                disabled={loading}
                className="h-14 rounded-2xl border-2 text-center text-2xl font-bold tracking-[0.5em] focus-visible:ring-[rgb(108,93,211)]"
                maxLength={6}
              />
              <p className="text-sm text-muted-foreground text-center pt-2">
                Code sent to {formData.email}
              </p>
            </div>

            <Button type="submit" className="w-full h-12 bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Sign In"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep('email')}
              disabled={loading}
            >
              Back to email
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="pb-8">
        <p className="text-sm text-muted-foreground text-center w-full">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-[rgb(108,93,211)] hover:underline font-semibold">
            Create one
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
