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

    // Clean citation markers
    processed = processed.replace(/\[cite:\s*\d+\]/gi, '');

    // Step 3: Process Markdown Elements
    // Convert headings (h5 down to h1)
    processed = processed.replace(/^##### (.*$)/gim, '<h5 class="md-h5">$1</h5>');
    processed = processed.replace(/^#### (.*$)/gim, '<h4 class="md-h4">$1</h4>');
    processed = processed.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
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

    // Convert blockquotes
    processed = processed.replace(/^>\s*(.*)$/gim, '<blockquote class="md-blockquote"><p>$1</p></blockquote>');

    // Convert unordered lists (- item or * item or unicode bullets)
    processed = processed.replace(/^\s*[-*•≡]\s+(.*)$/gim, '<li class="md-li">$1</li>');

    // Convert numbered lists (1. item)
    processed = processed.replace(/^\s*(\d+)\.\s+(.*)$/gim, '<li class="md-li md-ordered"><span class="md-list-num">$1.</span> $2</li>');

    // Convert lines, tables, and paragraphs
    const rawLines = processed.split('\n');
    const resultLines: string[] = [];
    let inList = false;
    let textBuffer: string[] = [];

    const flushTextBuffer = () => {
      if (textBuffer.length > 0) {
        resultLines.push(`<p class="md-p">${textBuffer.join(' ')}</p>`);
        textBuffer = [];
      }
    };

    const flushList = () => {
      if (inList) {
        resultLines.push('</ul>');
        inList = false;
      }
    };

    let idx = 0;
    while (idx < rawLines.length) {
      const line = rawLines[idx].trim();

      // Check for Markdown table: starts and ends with |
      if (line.startsWith('|') && line.endsWith('|') && idx + 1 < rawLines.length) {
        const nextLine = rawLines[idx + 1].trim();
        if (/^\|(\s*:?-+:?\s*\|)+\s*$/.test(nextLine)) {
          flushTextBuffer();
          flushList();

          const headers = line.split('|').slice(1, -1).map(h => h.trim());
          const aligns = nextLine.split('|').slice(1, -1).map(d => {
            const dt = d.trim();
            if (dt.startsWith(':') && dt.endsWith(':')) return 'center';
            if (dt.endsWith(':')) return 'right';
            return 'left';
          });

          let tableHtml = '<div class="md-table-wrapper"><table class="md-table"><thead><tr>';
          headers.forEach((h, i) => {
            const align = aligns[i] || 'left';
            tableHtml += `<th class="md-th" style="text-align: ${align}">${h}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';

          idx += 2;
          while (idx < rawLines.length && rawLines[idx].trim().startsWith('|') && rawLines[idx].trim().endsWith('|')) {
            const cells = rawLines[idx].trim().split('|').slice(1, -1).map(c => c.trim());
            tableHtml += '<tr>';
            cells.forEach((c, i) => {
              const align = aligns[i] || 'left';
              tableHtml += `<td class="md-td" style="text-align: ${align}">${c}</td>`;
            });
            tableHtml += '</tr>';
            idx++;
          }
          tableHtml += '</tbody></table></div>';
          resultLines.push(tableHtml);
          continue;
        }
      }

      if (!line) {
        flushTextBuffer();
        flushList();
        resultLines.push('<div class="md-spacer"></div>');
        idx++;
        continue;
      }

      if (line.startsWith('<li')) {
        flushTextBuffer();
        if (!inList) {
          resultLines.push('<ul class="md-ul">');
          inList = true;
        }
        resultLines.push(line);
      } else {
        flushList();
        if (
          line.startsWith('<h') ||
          line.startsWith('<div') ||
          line.startsWith('<pre') ||
          line.startsWith('<hr') ||
          line.startsWith('<blockquote')
        ) {
          flushTextBuffer();
          resultLines.push(line);
        } else {
          // Accumulate paragraph text
          textBuffer.push(line);
        }
      }
      idx++;
    }

    flushTextBuffer();
    flushList();

    return resultLines.join('\n');
  }, [content]);

  return (
    <div
      className={`katex-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
