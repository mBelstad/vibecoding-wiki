#!/usr/bin/env node
// Markdown to HTML converter for Vibecoding Wiki
// Usage: node convert-markdown.js

const fs = require('fs');

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateId(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function processInlineMarkdown(text) {
  let result = text;
  
  // Inline code (must come before bold/italic)
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  return result;
}

function convertMarkdownToHTML(markdown) {
  const lines = markdown.split('\n');
  const output = [];
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeContent = [];
  let inList = false;
  let listType = '';
  let listIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.substring(3).trim() || 'text';
        codeContent = [];
      } else {
        inCodeBlock = false;
        const code = escapeHtml(codeContent.join('\n'));
        output.push(`<pre><code class="language-${codeLanguage}">${code}</code></pre>`);
        codeContent = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Handle headers
    if (line.startsWith('# ')) {
      if (inList) {
        output.push(`</${listType}>`);
        inList = false;
      }
      const text = line.substring(2);
      const id = generateId(text);
      output.push(`<h1 id="${id}">${text}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) {
        output.push(`</${listType}>`);
        inList = false;
      }
      const text = line.substring(3);
      const id = generateId(text);
      output.push(`<h2 id="${id}">${text}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      if (inList) {
        output.push(`</${listType}>`);
        inList = false;
      }
      const text = line.substring(4);
      const id = generateId(text);
      output.push(`<h3 id="${id}">${text}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      if (inList) {
        output.push(`</${listType}>`);
        inList = false;
      }
      const text = line.substring(5);
      const id = generateId(text);
      output.push(`<h4 id="${id}">${text}</h4>`);
      continue;
    }

    // Handle blockquotes
    if (line.startsWith('> ')) {
      if (inList) {
        output.push(`</${listType}>`);
        inList = false;
      }
      output.push(`<blockquote>${processInlineMarkdown(line.substring(2))}</blockquote>`);
      continue;
    }

    // Handle horizontal rules
    if (line.trim() === '---') {
      if (inList) {
        output.push(`</${listType}>`);
        inList = false;
      }
      output.push('<hr>');
      continue;
    }

    // Handle unordered lists
    if (line.match(/^- /)) {
      if (!inList || listType !== 'ul') {
        if (inList) output.push(`</${listType}>`);
        output.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      const content = processInlineMarkdown(line.substring(2));
      output.push(`<li>${content}</li>`);
      continue;
    }

    // Handle ordered lists
    if (line.match(/^\d+\. /)) {
      if (!inList || listType !== 'ol') {
        if (inList) output.push(`</${listType}>`);
        output.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      const content = processInlineMarkdown(line.replace(/^\d+\. /, ''));
      output.push(`<li>${content}</li>`);
      continue;
    }

    // Handle empty lines
    if (line.trim() === '') {
      if (inList) {
        output.push(`</${listType}>`);
        inList = false;
        listType = '';
      }
      output.push('');
      continue;
    }

    // Close lists if we're not in one anymore
    if (inList && !line.match(/^[-\d]/) && line.trim() !== '') {
      output.push(`</${listType}>`);
      inList = false;
      listType = '';
    }

    // Handle regular paragraphs
    if (line.trim() !== '' && !line.startsWith('<')) {
      const content = processInlineMarkdown(line);
      output.push(`<p>${content}</p>`);
    }
  }

  // Close any open lists
  if (inList) {
    output.push(`</${listType}>`);
  }

  return output.join('\n');
}

// Main execution
console.log('🔄 Converting markdown files to HTML...\n');

const files = [
  { 
    input: 'Vibecoding_Playbook_Full.md', 
    output: 'playbook-full-content.html',
    title: 'Full Playbook (NO)'
  },
  { 
    input: 'Vibecoding_Playbook_Quickstart.md', 
    output: 'playbook-quickstart-content.html',
    title: 'Quickstart (NO)'
  },
  { 
    input: 'Vibecoding_Playbook_Full_EN.md', 
    output: 'playbook-full-content-en.html',
    title: 'Full Playbook (EN)'
  },
  { 
    input: 'Vibecoding_Playbook_Quickstart_EN.md', 
    output: 'playbook-quickstart-content-en.html',
    title: 'Quickstart (EN)'
  }
];

let successCount = 0;
let errorCount = 0;

files.forEach(({ input, output, title }) => {
  try {
    const markdown = fs.readFileSync(input, 'utf8');
    const html = convertMarkdownToHTML(markdown);
    fs.writeFileSync(output, html, 'utf8');
    console.log(`✓ ${title}: ${input} → ${output}`);
    successCount++;
  } catch (error) {
    console.error(`✗ ${title}: Error converting ${input}`);
    console.error(`  ${error.message}`);
    errorCount++;
  }
});

console.log(`\n📊 Conversion complete: ${successCount} successful, ${errorCount} failed`);

if (errorCount === 0) {
  console.log('✨ All files converted successfully!');
  process.exit(0);
} else {
  console.log('⚠️  Some files failed to convert.');
  process.exit(1);
}

