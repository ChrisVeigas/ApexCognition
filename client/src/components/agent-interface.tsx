import { useState, useRef, useEffect } from "react";
import { useDeterministicGroq, AgentPlan } from "@/hooks/useGroq";
import { ComponentRenderer } from "@/components/fixed-ui";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  Send,
  Activity,
  Layers,
  Undo2,
  Redo2,
  Eye,
  Code,
  Zap,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

function ChatPanel({
  onPrompt,
  status,
  plan,
  undo,
  redo,
  canUndo,
  canRedo,
}: {
  onPrompt: (p: string) => void;
  status: string;
  plan: AgentPlan | null;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onPrompt(input);
      setInput("");
    }
  };

  const examplePrompts = [
    "Login Page",
    "Analytics Dashboard",
    "Pricing Plans",
    "Contact Form",
    "User Profile",
    "Product Page",
    "Data Table",
    "Settings Panel",
  ];

  return (
    <div className="flex flex-col h-full border-r border-border bg-background">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-bold text-lg text-foreground"></h1>
            <p className="text-xs text-muted-foreground">
              Templates + AI Powered
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 border-b border-border bg-muted/30 flex items-center gap-3">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 rounded-lg hover:bg-accent text-foreground hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 rounded-lg hover:bg-accent text-foreground hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-border mx-1" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          History
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!plan && status === "idle" && (
          <div className="space-y-4">
            <div className="text-sm p-5 border border-border rounded-xl bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-primary" />
                <p className="font-semibold text-foreground text-base">
                  System Ready
                </p>
              </div>
              <p className="text-foreground/80 mb-4 leading-relaxed">
                Describe a UI component. The system will use deterministic
                templates when possible, or AI generation for complex requests.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <Zap className="w-3 h-3 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Fast templates available for common patterns
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Quick Examples
              </p>
              <div className="grid grid-cols-2 gap-2">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => onPrompt(prompt)}
                    className="text-left text-sm bg-background border border-border hover:border-primary hover:bg-accent/50 p-3 rounded-lg transition-all group"
                  >
                    <span className="text-primary group-hover:text-primary font-medium mr-1.5">
                      →
                    </span>
                    <span className="text-foreground">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {status !== "idle" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div
              className={cn(
                "flex gap-3 transition-opacity",
                status === "planning" ? "opacity-100" : "opacity-60",
              )}
            >
              <div className="shrink-0">
                <div
                  className={cn(
                    "mt-1 w-2 h-2 rounded-full",
                    status === "planning"
                      ? "bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50"
                      : "bg-green-500",
                  )}
                />
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Phase 1: Analysis
                </p>
                <div className="text-sm border-l-2 border-border pl-4 py-1 space-y-2">
                  {plan ? (
                    <>
                      <p className="font-semibold text-foreground text-base">
                        Intent: {plan.intent}
                      </p>
                      <div className="space-y-1.5">
                        {plan.steps.map((step, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-foreground/70"
                          >
                            <span className="text-primary font-semibold mt-0.5">
                              {i + 1}.
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>Analyzing requirements...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {status !== "planning" && (
              <div
                className={cn(
                  "flex gap-3 transition-opacity",
                  status === "complete" ? "opacity-60" : "opacity-100",
                )}
              >
                <div className="shrink-0">
                  <div
                    className={cn(
                      "mt-1 w-2 h-2 rounded-full",
                      status === "complete"
                        ? "bg-green-500"
                        : "bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50",
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Phase 2: Generation
                  </p>
                  <p className="text-sm text-foreground">
                    {plan?.steps.includes("Using deterministic")
                      ? "Using optimized template ⚡"
                      : "Generating with Groq AI 🤖"}
                  </p>
                </div>
              </div>
            )}

            {status === "complete" && plan && (
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="mt-1 w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Phase 3: Complete
                  </p>
                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm text-green-800 dark:text-green-200 italic leading-relaxed">
                      "{plan.explanation}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Layers className="w-3 h-3" />
                    <span>
                      {plan.components.length} component
                      {plan.components.length !== 1 ? "s" : ""} rendered
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border bg-background">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your UI (e.g., 'Login page with social auth')"
            className="flex-1 bg-muted/50 text-sm px-4 py-3 rounded-xl outline-none border border-transparent focus:border-primary focus:bg-background transition-all placeholder:text-muted-foreground/50 text-foreground"
            disabled={status !== "idle" && status !== "complete"}
          />
          <button
            type="submit"
            disabled={status !== "idle" && status !== "complete"}
            className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {status === "idle" || status === "complete" ? (
              <Send className="w-4 h-4" />
            ) : (
              <Activity className="w-4 h-4 animate-spin" />
            )}
          </button>
        </form>
        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          Press Enter to generate • Powered by Groq + Templates
        </p>
      </div>
    </div>
  );
}

function WorkspacePanel({
  plan,
  status,
}: {
  plan: AgentPlan | null;
  status: string;
}) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  useEffect(() => {
    if (status === "complete") {
      setActiveTab("preview");
    }
  }, [status]);

  const generatedCode = plan
    ? `// Generated UI Components
// Layout: ${plan.layout}
// Timestamp: ${new Date(plan.timestamp).toLocaleString()}

export function GeneratedUI() {
  return (
${JSON.stringify(plan.components, null, 2)
  .split("\n")
  .map((line) => "    " + line)
  .join("\n")}
  );
}

// Explanation:
// ${plan.explanation}
`
    : "// Waiting for generation...";

  return (
    <div className="flex flex-col h-full bg-secondary/20">
      <div className="h-12 border-b border-border bg-background flex items-center px-4 justify-between">
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-md">
          <button
            onClick={() => setActiveTab("preview")}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2",
              activeTab === "preview"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2",
              activeTab === "code"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Code className="w-3 h-3" /> Code
          </button>
        </div>

        <div className="flex items-center gap-2">
          {status === "complete" && (
            <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-950/30 px-2 py-1 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                Ready
              </span>
            </div>
          )}
          {status === "planning" && (
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-blue-500 animate-spin" />
              <span className="text-xs text-muted-foreground">
                Processing...
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        {activeTab === "preview" && (
          <div className="w-full h-full flex flex-col">
            {plan ? (
              <div
                className={cn(
                  "flex-1 p-8 overflow-auto transition-opacity duration-500",
                  status === "planning" ? "opacity-50" : "opacity-100",
                )}
              >
                <div className="mx-auto max-w-6xl bg-background border border-border shadow-lg rounded-lg overflow-hidden relative min-h-125">
                  {status === "planning" && (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <Activity className="w-10 h-10 text-primary animate-pulse" />
                        <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                          Assembling Components...
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="w-full p-8">
                    {plan.components.map((c, i) => (
                      <ComponentRenderer key={i} component={c} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
                <Layers className="w-16 h-16 opacity-20" />
                <p className="text-sm font-medium">No UI generated yet</p>
                <p className="text-xs">Enter a prompt to get started</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "code" && (
          <div className="w-full h-full bg-background overflow-auto">
            <SyntaxHighlighter
              language="javascript"
              style={githubGist}
              customStyle={{
                margin: 0,
                height: "100%",
                fontSize: "13px",
                background: "transparent",
                padding: "20px",
              }}
              showLineNumbers={true}
            >
              {generatedCode}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentInterface() {
  const { generate, status, plan, undo, redo, canUndo, canRedo } =
    useDeterministicGroq();

  return (
    <div className="flex w-full h-screen bg-background overflow-hidden font-sans">
      <div className="w-100 shrink-0 h-full">
        <ChatPanel
          onPrompt={generate}
          status={status}
          plan={plan}
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>
      <div className="flex-1 h-full min-w-0">
        <WorkspacePanel plan={plan} status={status} />
      </div>
    </div>
  );
}
