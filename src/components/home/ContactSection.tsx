"use client";

import { motion } from "motion/react";
import { Mail, Send, Copy, Check, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { PixelTerminal } from "@/components/icons/PixelTerminal";
import { PixelFileText } from "@/components/icons/PixelFileText";
import { PixelBird } from "@/components/icons/PixelBird";

const contactSchema = z.object({
  name: z.string().pipe(z.string().min(2, { message: "Identity is too short (min 2 chars)" })),
  email: z.email({ message: "Invalid frequency (email) format" }),
  message: z.string().pipe(z.string().min(10, { message: "Payload too small (min 10 chars)" })),
});

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'succeeded' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const email = "bdangi450@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage("");
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    // Frontend Validation
    const validation = contactSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: { [key: string]: string } = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setStatus('idle');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Transmission failed");
      }

      setStatus('succeeded');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  if (status === 'succeeded') {
    return (
      <section id="contact" className="w-full py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border-2 border-ctp-green p-12 rounded-[2rem] shadow-2xl flex flex-col items-center text-center space-y-6"
        >
          <div className="w-24 h-24 bg-ctp-green/10 rounded-full flex items-center justify-center text-ctp-green border-4 border-ctp-green/30">
            <PixelBird className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black font-heading uppercase tracking-tighter text-ctp-green italic">
              Transmission Received
            </h2>
            <p className="text-muted-foreground font-mono text-sm max-w-md">
              Your signal has been successfully processed. Expect a response on the same frequency soon.
            </p>
          </div>
          <Button 
            onClick={() => setStatus('idle')} 
            variant="outline" 
            className="rounded-xl font-mono text-xs font-bold uppercase tracking-widest border-ctp-green/50 hover:bg-ctp-green/10"
          >
            New Transmission
          </Button>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="contact" className="w-full py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Text & Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-7xl font-black text-foreground font-heading tracking-tight">
                Direct <span className="text-ctp-lavender italic">Channel</span>
              </h2>
              <div className="h-1.5 w-32 bg-ctp-lavender/30 rounded-full" />
            </div>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Have a project in mind or just want to talk shop? My signal is always open. 
              Drop a message or reach out through the frequency of your choice.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-card border border-border/50 rounded-2xl group transition-all hover:border-ctp-lavender/50 max-w-sm">
                <div className="p-3 bg-ctp-surface0 rounded-xl text-ctp-lavender">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Email Frequency</p>
                  <p className="text-sm font-bold truncate">{email}</p>
                </div>
                <button 
                  onClick={copyEmail}
                  className="p-2 hover:bg-ctp-surface1 rounded-lg transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {copied ? <Check className="w-5 h-5 text-ctp-green" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card border border-border/50 rounded-2xl group transition-all hover:border-ctp-sky/50 max-w-sm">
                <div className="p-3 bg-ctp-surface0 rounded-xl text-ctp-sky">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Availability</p>
                  <p className="text-sm font-bold truncate text-ctp-green">OPEN FOR NEW MISSIONS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: The Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border-2 border-border/50 p-8 rounded-[2rem] shadow-2xl relative"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pl-1">
                    <PixelTerminal className="w-4 h-4 text-ctp-lavender" />
                    <label htmlFor="name" className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Identity</label>
                  </div>
                  <input 
                    id="name"
                    type="text" 
                    name="name"
                    required
                    placeholder="Your Name"
                    className={`w-full bg-ctp-surface0 border ${errors.name ? 'border-ctp-red' : 'border-border/50'} focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender/30 outline-none p-4 rounded-xl font-mono text-sm transition-all`}
                  />
                  {errors.name && <p className="text-[10px] text-ctp-red font-mono pl-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pl-1">
                    <Mail className="w-4 h-4 text-ctp-lavender" />
                    <label htmlFor="email" className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Signal (Email)</label>
                  </div>
                  <input 
                    id="email"
                    type="email" 
                    name="email"
                    required
                    placeholder="name@company.com"
                    className={`w-full bg-ctp-surface0 border ${errors.email ? 'border-ctp-red' : 'border-border/50'} focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender/30 outline-none p-4 rounded-xl font-mono text-sm transition-all`}
                  />
                  {errors.email && <p className="text-[10px] text-ctp-red font-mono pl-1">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 pl-1">
                  <PixelFileText className="w-4 h-4 text-ctp-lavender" />
                  <label htmlFor="message" className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Message Payload</label>
                </div>
                <textarea 
                  id="message"
                  rows={5}
                  name="message"
                  required
                  placeholder="Transmission details..."
                  className={`w-full bg-ctp-surface0 border ${errors.message ? 'border-ctp-red' : 'border-border/50'} focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender/30 outline-none p-4 rounded-xl font-mono text-sm transition-all resize-none`}
                />
                {errors.message && <p className="text-[10px] text-ctp-red font-mono pl-1">{errors.message}</p>}
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-ctp-red bg-ctp-red/10 p-3 rounded-lg border border-ctp-red/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-xs font-mono">{errorMessage}</p>
                </div>
              )}

              <Button 
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-6 rounded-xl font-black font-heading text-lg group overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed"
                variant="default"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {status === 'submitting' ? (
                    <>
                      Encrypting...
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      Send Transmission
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </span>
                {status !== 'submitting' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-ctp-lavender to-ctp-sky opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Button>
            </form>

            {/* Decorative Corner */}
            <div className="absolute -top-3 -right-3 w-12 h-12 border-t-4 border-r-4 border-ctp-lavender rounded-tr-2xl" />
            <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-4 border-l-4 border-ctp-lavender rounded-bl-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
