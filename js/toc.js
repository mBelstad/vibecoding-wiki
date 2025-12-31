// Table of Contents Module
// Generates and manages floating TOC with scroll spy

class TableOfContents {
  constructor() {
    this.tocNav = document.getElementById('tocNav');
    this.docsContent = document.getElementById('docsContent');
    this.sidebarNav = document.getElementById('sidebarNav');
    this.headings = [];
    this.observer = null;
    this.init();
  }

  init() {
    if (!this.docsContent) return;

    // Generate TOC
    this.generateTOC();
    
    // Generate sidebar navigation
    this.generateSidebar();

    // Set up scroll spy
    this.setupScrollSpy();

    // Add copy buttons to code blocks
    this.addCopyButtons();
  }

  generateTOC() {
    if (!this.tocNav) return;

    // Get all h2 and h3 headings from content
    const headings = this.docsContent.querySelectorAll('h2, h3');
    
    if (headings.length === 0) {
      this.tocNav.innerHTML = '<p style="color: var(--text-tertiary); font-size: var(--font-size-sm);">No sections</p>';
      return;
    }

    const tocHTML = Array.from(headings).map(heading => {
      const id = heading.id || this.generateId(heading.textContent);
      heading.id = id;
      this.headings.push({ id, element: heading });

      const level = heading.tagName === 'H3' ? 'toc-item-sub' : 'toc-item';
      return `
        <a href="#${id}" class="${level}" data-heading-id="${id}">
          ${heading.textContent}
        </a>
      `;
    }).join('');

    this.tocNav.innerHTML = tocHTML;

    // Add click handlers
    this.tocNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update URL without triggering scroll
          history.pushState(null, '', `#${targetId}`);
        }
      });
    });
  }

  generateSidebar() {
    if (!this.sidebarNav) return;

    // Get the current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Define navigation structure
    const navItems = [
      { href: 'index.html', text: 'Home', icon: '🏠' },
      { href: 'playbook-full.html', text: 'Full Playbook', icon: '📚' },
      { href: 'playbook-quickstart.html', text: 'Quickstart', icon: '⚡' }
    ];

    // If on a docs page, also show sections
    if (currentPage !== 'index.html') {
      const mainHeadings = this.docsContent.querySelectorAll('h2');
      const sectionItems = Array.from(mainHeadings).map(heading => {
        const id = heading.id || this.generateId(heading.textContent);
        heading.id = id;
        return {
          href: `#${id}`,
          text: heading.textContent,
          isSection: true
        };
      });

      const sidebarHTML = `
        <div class="sidebar-section">
          ${navItems.map(item => `
            <a href="${item.href}" class="${currentPage === item.href ? 'active' : ''}">
              ${item.icon} ${item.text}
            </a>
          `).join('')}
        </div>
        ${sectionItems.length > 0 ? `
          <div class="sidebar-divider" style="height: 1px; background: var(--border-primary); margin: var(--spacing-md) 0;"></div>
          <div class="sidebar-section">
            ${sectionItems.map(item => `
              <a href="${item.href}" class="sidebar-section-link" data-section-id="${item.href.substring(1)}">
                ${item.text}
              </a>
            `).join('')}
          </div>
        ` : ''}
      `;

      this.sidebarNav.innerHTML = sidebarHTML;

      // Add click handlers for section links
      this.sidebarNav.querySelectorAll('.sidebar-section-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('data-section-id');
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', `#${targetId}`);
            
            // Close mobile menu if open
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
              sidebar.classList.remove('active');
            }
          }
        });
      });
    } else {
      // Just show main navigation on home page
      const sidebarHTML = navItems.map(item => `
        <a href="${item.href}" class="${currentPage === item.href ? 'active' : ''}">
          ${item.icon} ${item.text}
        </a>
      `).join('');
      
      this.sidebarNav.innerHTML = sidebarHTML;
    }
  }

  setupScrollSpy() {
    if (!this.tocNav || this.headings.length === 0) return;

    const options = {
      root: null,
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const tocLink = this.tocNav.querySelector(`[data-heading-id="${id}"]`);
        const sidebarLink = this.sidebarNav ? this.sidebarNav.querySelector(`[data-section-id="${id}"]`) : null;

        if (entry.isIntersecting) {
          // Remove active class from all links
          this.tocNav.querySelectorAll('a').forEach(link => link.classList.remove('active'));
          if (this.sidebarNav) {
            this.sidebarNav.querySelectorAll('.sidebar-section-link').forEach(link => link.classList.remove('active'));
          }

          // Add active class to current link
          if (tocLink) tocLink.classList.add('active');
          if (sidebarLink) sidebarLink.classList.add('active');
        }
      });
    }, options);

    // Observe all headings
    this.headings.forEach(({ element }) => {
      this.observer.observe(element);
    });
  }

  generateId(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  addCopyButtons() {
    // Wrap code blocks with copy button
    const codeBlocks = this.docsContent.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      
      // Skip if already wrapped
      if (pre.parentElement.classList.contains('code-block')) return;

      // Detect language
      const className = codeBlock.className;
      const languageMatch = className.match(/language-(\w+)/);
      const language = languageMatch ? languageMatch[1] : 'text';

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';

      // Create header with copy button
      const header = document.createElement('div');
      header.className = 'code-header';
      header.innerHTML = `
        <span class="code-language">${language}</span>
        <button class="copy-btn" data-code-block>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Copy</span>
        </button>
      `;

      // Wrap the pre element
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      // Add copy functionality
      const copyBtn = header.querySelector('.copy-btn');
      copyBtn.addEventListener('click', () => {
        const code = codeBlock.textContent;
        this.copyToClipboard(code, copyBtn);
      });
    });
  }

  copyToClipboard(text, button) {
    const originalHTML = button.innerHTML;
    
    const showSuccess = () => {
      button.classList.add('copied');
      button.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Copied!</span>
      `;
      
      setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = originalHTML;
      }, 2000);
    };

    const showError = () => {
      button.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>Error</span>
      `;
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
      }, 2000);
    };

    // Try modern Clipboard API first (requires HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(showSuccess)
        .catch(() => {
          // Fallback to legacy method
          this.legacyCopy(text) ? showSuccess() : showError();
        });
    } else {
      // Use legacy method for HTTP
      this.legacyCopy(text) ? showSuccess() : showError();
    }
  }

  legacyCopy(text) {
    // Legacy clipboard copy using textarea and execCommand
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error('Copy failed:', err);
    }
    
    document.body.removeChild(textarea);
    return success;
  }
}

// Initialize TOC when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.toc = new TableOfContents();
  });
} else {
  window.toc = new TableOfContents();
}

