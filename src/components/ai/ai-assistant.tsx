"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const GREETING = `Hi, I'm Hasnat's AI Assistant.
Ask me anything about his projects, skills, experience, AI journey or availability.`;

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "resume">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState<Record<string, unknown> | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, matchResult]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: messages.filter((m) => m.content !== GREETING),
          sessionId,
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function analyzeJob() {
    if (!jobDescription.trim() || loading) return;
    setLoading(true);
    setMatchResult(null);
    try {
      const res = await fetch("/api/ai/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, sessionId }),
      });
      const data = await res.json();
      setMatchResult(data);
    } catch {
      setMatchResult({ summary: "Analysis failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-2xl shadow-violet-600/40",
          open && "pointer-events-none opacity-0"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex h-[min(600px,85vh)] w-[min(420px,95vw)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-violet-400" />
                <span className="font-semibold text-sm">AI Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex border-b border-white/10">
              <button
                onClick={() => setTab("chat")}
                className={cn(
                  "flex-1 py-2 text-xs font-medium transition-colors",
                  tab === "chat" ? "border-b-2 border-violet-500 text-violet-400" : "text-zinc-500"
                )}
              >
                Portfolio Chat
              </button>
              <button
                onClick={() => setTab("resume")}
                className={cn(
                  "flex-1 py-2 text-xs font-medium transition-colors",
                  tab === "resume" ? "border-b-2 border-violet-500 text-violet-400" : "text-zinc-500"
                )}
              >
                Job Match
              </button>
            </div>

            {tab === "chat" ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                        msg.role === "user"
                          ? "ml-8 bg-violet-600/20 text-violet-100"
                          : "mr-4 bg-white/5 text-zinc-300"
                      )}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {loading && (
                    <div className="mr-4 rounded-xl bg-white/5 px-3 py-2 text-sm text-zinc-500">
                      Thinking...
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
                <div className="border-t border-white/10 p-3">
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Ask about projects, skills, availability..."
                      className="min-h-[44px] max-h-24 resize-none"
                      rows={1}
                    />
                    <Button size="icon" onClick={sendMessage} disabled={loading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col overflow-y-auto p-4">
                <div className="mb-3 flex items-center gap-2 text-sm text-zinc-400">
                  <FileSearch className="h-4 w-4" />
                  Paste a job description to get a match analysis
                </div>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description here..."
                  className="mb-3 min-h-[160px]"
                />
                <Button onClick={analyzeJob} disabled={loading} className="mb-4">
                  {loading ? "Analyzing..." : "Analyze Match"}
                </Button>
                {matchResult && (
                  <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                    {"matchScore" in matchResult && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-violet-400">
                          {String(matchResult.matchScore)}%
                        </div>
                        <div className="text-xs text-zinc-500">Match Score</div>
                      </div>
                    )}
                    {"summary" in matchResult && (
                      <p className="text-zinc-300">{String(matchResult.summary)}</p>
                    )}
                    {"strengths" in matchResult && Array.isArray(matchResult.strengths) && (
                      <div>
                        <p className="mb-1 font-medium text-green-400">Strengths</p>
                        <ul className="list-inside list-disc text-zinc-400">
                          {(matchResult.strengths as string[]).map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {"gaps" in matchResult && Array.isArray(matchResult.gaps) && (
                      <div>
                        <p className="mb-1 font-medium text-amber-400">Gaps</p>
                        <ul className="list-inside list-disc text-zinc-400">
                          {(matchResult.gaps as string[]).map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {"recommendedProjects" in matchResult &&
                      Array.isArray(matchResult.recommendedProjects) && (
                        <div>
                          <p className="mb-1 font-medium text-violet-400">Recommended Projects</p>
                          <ul className="list-inside list-disc text-zinc-400">
                            {(matchResult.recommendedProjects as string[]).map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
