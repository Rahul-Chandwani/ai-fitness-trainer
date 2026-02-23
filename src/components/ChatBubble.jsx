import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";

export default function ChatBubble({ role, text, compact = false }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-4`}>
      {!isUser && (
        <div className="w-12 h-20 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20 flex-shrink-0 mb-2 shadow-sm">
          <Bot className="w-6 h-6 text-accent" />
        </div>
      )}

      <div
        className={`max-w-[85%] md:max-w-[80%] rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative transition-all duration-300 overflow-hidden
        ${compact ? "px-6 py-4 md:px-8 md:py-6 text-sm" : "px-8 py-5 md:px-10 md:py-8 text-sm md:text-base"}
        ${isUser
            ? "bg-text text-bg rounded-br-none font-black uppercase italic tracking-tighter break-words"
            : "bg-card/40 text-text rounded-bl-none border border-border backdrop-blur-md break-words shadow-sm"
          }`}
      >
        {isUser ? (
          <div className="flex flex-col gap-2">
            <span className="text-[0.6rem] font-black opacity-30 tracking-[0.3em] uppercase">USER_UPLINK</span>
            {text}
          </div>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none 
              prose-p:my-3 prose-headings:my-5 prose-ul:my-3 prose-li:my-1.5
              prose-strong:text-accent prose-strong:font-black prose-a:text-accent prose-code:text-accent prose-code:bg-card/60 prose-code:px-1.5 prose-code:rounded">
            <div className="text-[0.6rem] font-black text-accent/60 uppercase tracking-[0.4em] mb-6 flex items-center gap-2.5">
              <span className="w-2 h-2 bg-accent/30 rounded-full animate-pulse"></span>
              NEURAL_FEEDBACK_TRANSMISSION
            </div>
            <ReactMarkdown>
              {text}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-12 h-12 bg-text/10 rounded-2xl flex items-center justify-center border border-text/10 flex-shrink-0 mb-2 shadow-sm">
          <User className="w-6 h-6 text-text" />
        </div>
      )}
    </div>
  );
}
