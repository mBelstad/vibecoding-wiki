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
    'search.noResults': 'Ingen resultater funnet'
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
    'search.noResults': 'No results found'
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

