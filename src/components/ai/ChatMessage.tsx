"use client";

export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "contact-form";
}

function formatContent(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // Process code blocks first
  const codeBlockRegex = /```(?:\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={key++}>{formatInline(remaining.slice(lastIndex, match.index))}</span>
      );
    }
    parts.push(
      <pre
        key={key++}
        className="my-2 overflow-x-auto rounded-lg bg-bg-dark p-3 text-sm text-white"
      >
        <code>{match[1]}</code>
      </pre>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < remaining.length) {
    parts.push(<span key={key++}>{formatInline(remaining.slice(lastIndex))}</span>);
  }

  if (parts.length === 0) {
    parts.push(<span key={0}>{formatInline(text)}</span>);
  }

  return parts;
}

function formatInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match bold, inline code, and links
  const inlineRegex = /(\*\*(.+?)\*\*)|(`([^`]+?)`)|(\[([^\]]+?)\]\(([^)]+?)\))/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold
      parts.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[3]) {
      // Inline code
      parts.push(
        <code
          key={key++}
          className="rounded bg-bg-dark/10 px-1.5 py-0.5 text-sm font-mono"
        >
          {match[4]}
        </code>
      );
    } else if (match[5]) {
      // Link
      parts.push(
        <a
          key={key++}
          href={match[7]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline hover:text-accent-hover"
        >
          {match[6]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-[fadeIn_0.2s_ease-out]`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-accent text-white rounded-br-md"
            : "bg-bg-cream text-text-primary rounded-bl-md"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{formatContent(content)}</div>
      </div>
    </div>
  );
}
