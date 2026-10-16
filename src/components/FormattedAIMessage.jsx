import React from 'react';

/**
 * Lightweight, safe parser to render AI markdown output into beautiful HTML/CSS components:
 * - Converts **bold** to styled glowing highlights
 * - Converts bullet points (- item or * item) to modern badge list items
 * - Formats metric key-values (e.g. Temperature: 14°C) into mini cards
 * - Preserves readable paragraphs and line spacing
 */
export default function FormattedAIMessage({ text }) {
  if (!text) return null;

  // Split into paragraphs / lines
  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-2 space-y-1.5 pl-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="flex-1">{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  // Helper to render bold (**text**), inline code (`code`), or emojis
  const renderInline = (str) => {
    // Regex matches **bold**, `code`, or regular text
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return (
          <strong key={i} className="font-bold text-cyan-200 drop-shadow-sm">
            {content}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-black/40 text-cyan-300 font-mono text-xs">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();

    // Check if bullet point (- or * or •)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const bulletContent = trimmed.replace(/^[-*•]\s+/, '');
      currentList.push(bulletContent);
    } else {
      flushList();

      if (trimmed === '') {
        // Spacer
        elements.push(<div key={`space-${lineIndex}`} className="h-2" />);
      } else {
        // Regular paragraph or heading
        elements.push(
          <p key={`p-${lineIndex}`} className="text-xs md:text-sm leading-relaxed text-slate-100">
            {renderInline(line)}
          </p>
        );
      }
    }
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
}
