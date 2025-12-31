// Main Application Logic
// Handles theme toggle, mobile navigation, and checklist persistence

class VibeCodingApp {
  constructor() {
    this.theme = localStorage.getItem('vibecoding-theme') || this.getSystemTheme();
    this.checklist = JSON.parse(localStorage.getItem('vibecoding-checklist') || '{}');
    this.init();
  }

  init() {
    // Apply theme
    this.applyTheme(this.theme);
    
    // Set up theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Set up mobile menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    if (mobileMenuToggle && sidebar) {
      mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });

      // Close sidebar when clicking outside
      document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
          sidebar.classList.remove('active');
        }
      });
    }

    // Set up checklist
    this.initChecklist();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('vibecoding-theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('vibecoding-theme', this.theme);
    this.applyTheme(this.theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  initChecklist() {
    const checklistElement = document.getElementById('checklist');
    if (!checklistElement) return;

    const checkboxes = checklistElement.querySelectorAll('input[type="checkbox"]');
    
    // Restore saved state
    checkboxes.forEach(checkbox => {
      const key = checkbox.getAttribute('data-key');
      if (this.checklist[key]) {
        checkbox.checked = true;
      }

      // Add event listener
      checkbox.addEventListener('change', () => {
        this.updateChecklist(key, checkbox.checked);
      });
    });

    // Update progress
    this.updateProgress();
  }

  updateChecklist(key, checked) {
    if (checked) {
      this.checklist[key] = true;
    } else {
      delete this.checklist[key];
    }
    
    localStorage.setItem('vibecoding-checklist', JSON.stringify(this.checklist));
    this.updateProgress();
  }

  updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (!progressFill || !progressText) return;

    const checklistElement = document.getElementById('checklist');
    const totalItems = checklistElement.querySelectorAll('input[type="checkbox"]').length;
    const checkedItems = Object.keys(this.checklist).length;
    const percentage = Math.round((checkedItems / totalItems) * 100);

    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new VibeCodingApp();
  });
} else {
  window.app = new VibeCodingApp();
}

