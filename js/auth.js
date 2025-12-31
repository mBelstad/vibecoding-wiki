// Authentication Module
// Handles password protection for the wiki chatbot

class AuthManager {
  constructor() {
    this.storageKey = 'vibecoding-auth-hash';
    this.sessionKey = 'vibecoding-auth-session';
    this.isAuthenticated = false;
    this.init();
  }

  init() {
    // Check if password is set
    const hasPassword = this.hasPasswordSet();
    
    // Check if already authenticated in this session
    const sessionAuth = sessionStorage.getItem(this.sessionKey);
    
    if (!hasPassword) {
      // No password set, show setup screen
      this.showPasswordSetup();
    } else if (sessionAuth === 'true') {
      // Already authenticated
      this.isAuthenticated = true;
      this.hidePasswordOverlay();
    } else {
      // Need to authenticate
      this.showPasswordPrompt();
    }
  }

  hasPasswordSet() {
    return localStorage.getItem(this.storageKey) !== null;
  }

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async setPassword(password) {
    if (!password || password.length < 4) {
      throw new Error('Password must be at least 4 characters');
    }
    
    const hash = await this.hashPassword(password);
    localStorage.setItem(this.storageKey, hash);
    this.isAuthenticated = true;
    sessionStorage.setItem(this.sessionKey, 'true');
    this.hidePasswordOverlay();
  }

  async verifyPassword(password) {
    const hash = await this.hashPassword(password);
    const storedHash = localStorage.getItem(this.storageKey);
    
    if (hash === storedHash) {
      this.isAuthenticated = true;
      sessionStorage.setItem(this.sessionKey, 'true');
      this.hidePasswordOverlay();
      return true;
    }
    return false;
  }

  async changePassword(oldPassword, newPassword) {
    const oldHash = await this.hashPassword(oldPassword);
    const storedHash = localStorage.getItem(this.storageKey);
    
    if (oldHash !== storedHash) {
      throw new Error('Current password is incorrect');
    }
    
    await this.setPassword(newPassword);
  }

  removePassword(password) {
    return new Promise(async (resolve, reject) => {
      const hash = await this.hashPassword(password);
      const storedHash = localStorage.getItem(this.storageKey);
      
      if (hash === storedHash) {
        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.sessionKey);
        this.isAuthenticated = false;
        resolve(true);
      } else {
        reject(new Error('Password is incorrect'));
      }
    });
  }

  logout() {
    sessionStorage.removeItem(this.sessionKey);
    this.isAuthenticated = false;
    this.showPasswordPrompt();
  }

  showPasswordSetup() {
    const overlay = this.getOrCreateOverlay();
    const content = overlay.querySelector('.password-content');
    
    content.innerHTML = `
      <div class="password-setup">
        <div class="password-icon">🔒</div>
        <h2>Set Up Password Protection</h2>
        <p>Create a password to protect access to the chatbot.</p>
        <form id="passwordSetupForm">
          <input 
            type="password" 
            id="setupPassword" 
            placeholder="Enter password (min 4 characters)"
            required
            minlength="4"
            autocomplete="new-password"
          >
          <input 
            type="password" 
            id="setupPasswordConfirm" 
            placeholder="Confirm password"
            required
            minlength="4"
            autocomplete="new-password"
          >
          <div class="password-error" id="setupError"></div>
          <button type="submit" class="btn btn-primary">Set Password</button>
        </form>
      </div>
    `;
    
    overlay.style.display = 'flex';
    
    const form = document.getElementById('passwordSetupForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('setupPassword').value;
      const confirm = document.getElementById('setupPasswordConfirm').value;
      const errorEl = document.getElementById('setupError');
      
      if (password !== confirm) {
        errorEl.textContent = 'Passwords do not match';
        return;
      }
      
      try {
        await this.setPassword(password);
        errorEl.textContent = '';
      } catch (error) {
        errorEl.textContent = error.message;
      }
    });
  }

  showPasswordPrompt() {
    const overlay = this.getOrCreateOverlay();
    const content = overlay.querySelector('.password-content');
    
    content.innerHTML = `
      <div class="password-prompt">
        <div class="password-icon">🔐</div>
        <h2>Enter Password</h2>
        <p>This chatbot is password protected.</p>
        <form id="passwordPromptForm">
          <input 
            type="password" 
            id="promptPassword" 
            placeholder="Enter password"
            required
            autocomplete="current-password"
          >
          <div class="password-error" id="promptError"></div>
          <button type="submit" class="btn btn-primary">Unlock</button>
        </form>
      </div>
    `;
    
    overlay.style.display = 'flex';
    
    const form = document.getElementById('passwordPromptForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('promptPassword').value;
      const errorEl = document.getElementById('promptError');
      
      const success = await this.verifyPassword(password);
      if (!success) {
        errorEl.textContent = 'Incorrect password';
        document.getElementById('promptPassword').value = '';
      } else {
        errorEl.textContent = '';
      }
    });
    
    // Focus the password input
    setTimeout(() => {
      document.getElementById('promptPassword')?.focus();
    }, 100);
  }

  getOrCreateOverlay() {
    let overlay = document.getElementById('passwordOverlay');
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'passwordOverlay';
      overlay.className = 'password-overlay';
      overlay.innerHTML = `
        <div class="password-content"></div>
      `;
      document.body.appendChild(overlay);
    }
    
    return overlay;
  }

  hidePasswordOverlay() {
    const overlay = document.getElementById('passwordOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    
    // Dispatch event that authentication is complete
    window.dispatchEvent(new CustomEvent('authenticationComplete'));
  }

  requireAuth(callback) {
    if (this.isAuthenticated) {
      callback();
    } else {
      window.addEventListener('authenticationComplete', callback, { once: true });
    }
  }
}

// Initialize auth manager
window.authManager = new AuthManager();

