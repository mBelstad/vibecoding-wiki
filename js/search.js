// Search Module
// Handles full-text search across all content with keyboard shortcuts

class Search {
  constructor() {
    this.searchModal = document.getElementById('searchModal');
    this.searchInput = document.getElementById('searchInput');
    this.searchResults = document.getElementById('searchResults');
    this.searchBtn = document.getElementById('searchBtn');
    this.searchClose = document.getElementById('searchClose');
    this.searchIndex = [];
    this.init();
  }

  init() {
    if (!this.searchModal) return;

    // Build search index
    this.buildSearchIndex();

    // Set up event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Open search modal
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => this.openModal());
    }

    // Keyboard shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.openModal();
      }

      // Close on Escape
      if (e.key === 'Escape' && this.searchModal.classList.contains('active')) {
        this.closeModal();
      }
    });

    // Close button
    if (this.searchClose) {
      this.searchClose.addEventListener('click', () => this.closeModal());
    }

    // Click outside to close
    this.searchModal.addEventListener('click', (e) => {
      if (e.target === this.searchModal) {
        this.closeModal();
      }
    });

    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.performSearch(e.target.value);
      });
    }
  }

  openModal() {
    this.searchModal.classList.add('active');
    this.searchInput.focus();
  }

  closeModal() {
    this.searchModal.classList.remove('active');
    this.searchInput.value = '';
    this.searchResults.innerHTML = '';
  }

  buildSearchIndex() {
    // Index current page content
    const content = document.querySelector('.docs-content') || document.querySelector('.landing-main');
    if (!content) return;

    // Index headings and their content
    const headings = content.querySelectorAll('h1, h2, h3, h4');
    headings.forEach(heading => {
      const id = heading.id || this.generateId(heading.textContent);
      heading.id = id;

      // Get content until next heading
      let contentText = '';
      let nextElement = heading.nextElementSibling;
      while (nextElement && !nextElement.matches('h1, h2, h3, h4')) {
        contentText += ' ' + nextElement.textContent;
        nextElement = nextElement.nextElementSibling;
      }

      this.searchIndex.push({
        title: heading.textContent,
        content: contentText.substring(0, 300), // First 300 chars
        url: window.location.pathname + '#' + id,
        level: heading.tagName
      });
    });

    // Also index page sections without explicit headings
    const paragraphs = content.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
      if (p.textContent.length > 50) {
        this.searchIndex.push({
          title: 'Section ' + (index + 1),
          content: p.textContent.substring(0, 200),
          url: window.location.pathname,
          level: 'P'
        });
      }
    });
  }

  generateId(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  performSearch(query) {
    if (!query || query.length < 2) {
      this.searchResults.innerHTML = '';
      return;
    }

    const results = this.search(query);
    this.displayResults(results, query);
  }

  search(query) {
    const lowerQuery = query.toLowerCase();
    const results = [];

    this.searchIndex.forEach(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const contentMatch = item.content.toLowerCase().includes(lowerQuery);

      if (titleMatch || contentMatch) {
        // Calculate relevance score
        let score = 0;
        if (titleMatch) score += 10;
        if (contentMatch) score += 5;

        results.push({
          ...item,
          score
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, 10); // Return top 10 results
  }

  displayResults(results, query) {
    if (results.length === 0) {
      const lang = window.i18n ? window.i18n.currentLang : 'no';
      const noResultsText = lang === 'en' ? 'No results found' : 'Ingen resultater funnet';
      this.searchResults.innerHTML = `
        <div class="search-no-results">${noResultsText}</div>
      `;
      return;
    }

    const html = results.map(result => {
      const excerpt = this.highlightQuery(result.content, query);
      return `
        <a href="${result.url}" class="search-result-item">
          <div class="search-result-title">${this.highlightQuery(result.title, query)}</div>
          <div class="search-result-excerpt">${excerpt}</div>
        </a>
      `;
    }).join('');

    this.searchResults.innerHTML = html;

    // Add click handlers to close modal
    this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        setTimeout(() => this.closeModal(), 100);
      });
    });
  }

  highlightQuery(text, query) {
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.search = new Search();
  });
} else {
  window.search = new Search();
}

