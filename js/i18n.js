// Internationalization (i18n) Module
// Handles language switching between Norwegian and English

const translations = {
  no: {
    'hero.title': 'Vibecoding Playbook',
    'hero.subtitle': 'Behold farten fra vibecoding, men gjør prosjektet trygt, forutsigbart og ship-ready.',
    'hero.fullPlaybook': 'Full Playbook',
    'hero.quickstart': 'Quickstart',
    'remembered.title': 'HAR DU HUSKET?',
    'remembered.item1': 'Oppdatert Context-Pack.md i dag',
    'remembered.item2': 'Brukt handoff-mal ved ny chat',
    'remembered.item3': 'Verify + rollback i hver endring',
    'remembered.item4': 'Ingen secrets i repo',
    'remembered.item5': 'Minimal diffs',
    'remembered.item6': 'Prototype i /prototype, production i /app',
    'quickLinks.title': 'Quick Links',
    'quickLinks.principles': 'Prinsipper',
    'quickLinks.principlesDesc': 'Kontrollflater og effektiv koding',
    'quickLinks.roles': 'Roller',
    'quickLinks.rolesDesc': 'Menneske og AI-roller',
    'quickLinks.prompts': 'Prompts',
    'quickLinks.promptsDesc': 'Maler for hver rolle',
    'quickLinks.templates': 'Templates',
    'quickLinks.templatesDesc': 'ADR, experiment, runbooks',
    'footer.text': 'Vibecoding Playbook - Cursor + Claude Sonnet/Opus',
    'toc.title': 'På denne siden',
    'search.placeholder': 'Søk...',
    'search.noResults': 'Ingen resultater funnet',
    'content.file': 'playbook-full-content.html'
  },
  en: {
    'hero.title': 'Vibecoding Playbook',
    'hero.subtitle': 'Keep the speed of vibecoding, but make the project safe, predictable and ship-ready.',
    'hero.fullPlaybook': 'Full Playbook',
    'hero.quickstart': 'Quickstart',
    'remembered.title': 'HAVE YOU REMEMBERED?',
    'remembered.item1': 'Updated Context-Pack.md today',
    'remembered.item2': 'Used handoff template for new chat',
    'remembered.item3': 'Verify + rollback in every change',
    'remembered.item4': 'No secrets in repo',
    'remembered.item5': 'Minimal diffs',
    'remembered.item6': 'Prototype in /prototype, production in /app',
    'quickLinks.title': 'Quick Links',
    'quickLinks.principles': 'Principles',
    'quickLinks.principlesDesc': 'Control surfaces and efficient coding',
    'quickLinks.roles': 'Roles',
    'quickLinks.rolesDesc': 'Human and AI roles',
    'quickLinks.prompts': 'Prompts',
    'quickLinks.promptsDesc': 'Templates for each role',
    'quickLinks.templates': 'Templates',
    'quickLinks.templatesDesc': 'ADR, experiment, runbooks',
    'footer.text': 'Vibecoding Playbook - Cursor + Claude Sonnet/Opus',
    'toc.title': 'On this page',
    'search.placeholder': 'Search...',
    'search.noResults': 'No results found',
    'content.file': 'playbook-full-content-en.html'
  }
};

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('vibecoding-lang') || 'no';
    this.init();
  }

  init() {
    // Apply saved language
    this.applyLanguage(this.currentLang);
    
    // Set up language toggle button
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => this.toggleLanguage());
      this.updateToggleButton();
    }
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'no' ? 'en' : 'no';
    localStorage.setItem('vibecoding-lang', this.currentLang);
    this.applyLanguage(this.currentLang);
    this.updateToggleButton();
  }

  applyLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = translations[lang][key];
      if (translation) {
        element.textContent = translation;
      }
    });

    // Update search placeholder
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.placeholder = translations[lang]['search.placeholder'];
    }

    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Reload content if on docs page
    const docsContent = document.getElementById('docsContent');
    if (docsContent && window.location.pathname.includes('playbook')) {
      this.reloadContent(lang);
    }
  }
  
  reloadContent(lang) {
    const docsContent = document.getElementById('docsContent');
    if (!docsContent) return;
    
    // Determine which content file to load
    let contentFile;
    if (window.location.pathname.includes('playbook-full')) {
      contentFile = lang === 'en' ? 'playbook-full-content-en.html' : 'playbook-full-content.html';
    } else if (window.location.pathname.includes('playbook-quickstart')) {
      contentFile = lang === 'en' ? 'playbook-quickstart-content-en.html' : 'playbook-quickstart-content.html';
    } else {
      return;
    }
    
    // Load the content
    fetch(contentFile)
      .then(response => response.text())
      .then(html => {
        docsContent.innerHTML = html;
        // Trigger syntax highlighting
        if (window.Prism) window.Prism.highlightAll();
        // Reinitialize TOC
        if (window.TableOfContents) {
          window.toc = new TableOfContents();
        }
        // Reinitialize search
        if (window.Search) {
          window.search = new Search();
        }
      })
      .catch(error => {
        console.error('Error loading translated content:', error);
      });
  }

  updateToggleButton() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      const langText = langToggle.querySelector('.lang-text');
      if (langText) {
        langText.textContent = this.currentLang === 'no' ? 'EN' : 'NO';
      }
    }
  }

  t(key) {
    return translations[this.currentLang][key] || key;
  }
}

// Initialize i18n when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18n();
  });
} else {
  window.i18n = new I18n();
}

