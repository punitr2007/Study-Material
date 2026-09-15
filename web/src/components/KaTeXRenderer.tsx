import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface KaTeXRendererProps {
  content: string;
  className?: string;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ content, className = '' }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // Step 1: Extract and render display math ($$...$$)
    let processed = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      try {
        const rendered = katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
        });
        return `<div class="katex-display-wrapper"><div class="katex-display-scroll">${rendered}</div></div>`;
      } catch (err) {
        return `<pre class="katex-error">${math}</pre>`;
      }
    });

    // Step 2: Extract and render inline math ($...$)
    processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
        });
      } catch (err) {
        return `<code>${math}</code>`;
      }
    });

    // Step 3: Process Markdown Elements
    // Convert headings
    processed = processed.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
    processed = processed.replace(/^#### (.*$)/gim, '<h4 class="md-h4">$1</h4>');
    processed = processed.replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>');
    processed = processed.replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>');

    // Convert horizontal rules
    processed = processed.replace(/^---$/gim, '<hr class="md-hr" />');

    // Convert bold and italics
    processed = processed.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert code blocks and inline code
    processed = processed.replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre class="md-code-block"><code>$2</code></pre>');
    processed = processed.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

    // Convert unordered lists (- item or * item)
    processed = processed.replace(/^\s*[-*]\s+(.*)$/gim, '<li class="md-li">$1</li>');

    // Convert numbered lists (1. item)
    processed = processed.replace(/^\s*(\d+)\.\s+(.*)$/gim, '<li class="md-li md-ordered"><span class="md-list-num">$1.</span> $2</li>');

    // Convert line breaks and paragraph spacing (excluding inside pre and tags)
    const lines = processed.split('\n');
    const resultLines: string[] = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        if (inList) {
          resultLines.push('</ul>');
          inList = false;
        }
        resultLines.push('<div class="md-spacer"></div>');
        continue;
      }

      if (line.startsWith('<li')) {
        if (!inList) {
          resultLines.push('<ul class="md-ul">');
          inList = true;
        }
        resultLines.push(line);
      } else {
        if (inList) {
          resultLines.push('</ul>');
          inList = false;
        }
        if (
          line.startsWith('<h') ||
          line.startsWith('<div') ||
          line.startsWith('<pre') ||
          line.startsWith('<hr')
        ) {
          resultLines.push(line);
        } else {
          resultLines.push(`<p class="md-p">${line}</p>`);
        }
      }
    }
    if (inList) {
      resultLines.push('</ul>');
    }

    return resultLines.join('\n');
  }, [content]);

  return (
    <div
      className={`katex-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
