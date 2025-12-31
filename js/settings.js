// Settings Module
// Manages API key, model selection, MCP configuration, and user preferences

class SettingsManager {
  constructor() {
    this.storagePrefix = 'vibecoding-';
    this.settings = {
      apiKey: null,
      maxTokens: 4000,
      temperature: 0.7,
      mcpServers: [],
      enableMCP: false,
      showTokenCount: true,
      autoSaveHistory: true
    };
    this.loadSettings();
  }

  loadSettings() {
    // Load API key (obfuscated)
    const encodedKey = localStorage.getItem(this.storagePrefix + 'api-key');
    if (encodedKey) {
      this.settings.apiKey = this.decodeKey(encodedKey);
    }

    // Load other settings
    const savedSettings = localStorage.getItem(this.storagePrefix + 'settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        this.settings = { ...this.settings, ...parsed };
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }

  saveSettings() {
    const { apiKey, ...otherSettings } = this.settings;
    
    // Save API key separately (obfuscated)
    if (apiKey) {
      localStorage.setItem(this.storagePrefix + 'api-key', this.encodeKey(apiKey));
    }

    // Save other settings
    localStorage.setItem(this.storagePrefix + 'settings', JSON.stringify(otherSettings));
  }

  // Simple obfuscation (NOT encryption, just prevents casual viewing)
  encodeKey(key) {
    return btoa(key);
  }

  decodeKey(encoded) {
    try {
      return atob(encoded);
    } catch (e) {
      return null;
    }
  }

  setApiKey(key) {
    if (!this.validateApiKey(key)) {
      throw new Error('Invalid API key format');
    }
    this.settings.apiKey = key;
    this.saveSettings();
  }

  getApiKey() {
    return this.settings.apiKey;
  }

  hasApiKey() {
    return this.settings.apiKey !== null && this.settings.apiKey.length > 0;
  }

  validateApiKey(key) {
    // OpenAI keys start with 'sk-' and are typically 48+ characters
    return key && typeof key === 'string' && key.startsWith('sk-') && key.length >= 20;
  }

  clearApiKey() {
    this.settings.apiKey = null;
    localStorage.removeItem(this.storagePrefix + 'api-key');
    this.saveSettings();
  }

  setMaxTokens(tokens) {
    const parsed = parseInt(tokens);
    if (isNaN(parsed) || parsed < 100 || parsed > 128000) {
      throw new Error('Max tokens must be between 100 and 128000');
    }
    this.settings.maxTokens = parsed;
    this.saveSettings();
  }

  getMaxTokens() {
    return this.settings.maxTokens;
  }

  setTemperature(temp) {
    const parsed = parseFloat(temp);
    if (isNaN(parsed) || parsed < 0 || parsed > 2) {
      throw new Error('Temperature must be between 0 and 2');
    }
    this.settings.temperature = parsed;
    this.saveSettings();
  }

  getTemperature() {
    return this.settings.temperature;
  }

  // MCP Server Management
  addMCPServer(server) {
    if (!server.name || !server.url) {
      throw new Error('Server must have name and url');
    }
    
    // Check for duplicates
    const exists = this.settings.mcpServers.find(s => s.url === server.url);
    if (exists) {
      throw new Error('Server with this URL already exists');
    }

    this.settings.mcpServers.push({
      id: Date.now().toString(),
      name: server.name,
      url: server.url,
      enabled: server.enabled !== false,
      tools: server.tools || []
    });
    this.saveSettings();
  }

  removeMCPServer(serverId) {
    this.settings.mcpServers = this.settings.mcpServers.filter(s => s.id !== serverId);
    this.saveSettings();
  }

  updateMCPServer(serverId, updates) {
    const server = this.settings.mcpServers.find(s => s.id === serverId);
    if (server) {
      Object.assign(server, updates);
      this.saveSettings();
    }
  }

  getMCPServers() {
    return this.settings.mcpServers;
  }

  getEnabledMCPServers() {
    return this.settings.mcpServers.filter(s => s.enabled);
  }

  setMCPEnabled(enabled) {
    this.settings.enableMCP = enabled;
    this.saveSettings();
  }

  isMCPEnabled() {
    return this.settings.enableMCP && this.settings.mcpServers.some(s => s.enabled);
  }

  // UI Management
  openSettingsModal() {
    const modal = this.getOrCreateModal();
    this.renderSettings();
    modal.style.display = 'flex';
  }

  closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  getOrCreateModal() {
    let modal = document.getElementById('settingsModal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'settingsModal';
      modal.className = 'settings-modal';
      modal.innerHTML = `
        <div class="settings-modal-content">
          <div class="settings-header">
            <h2>⚙️ Settings</h2>
            <button class="settings-close" id="settingsClose">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="settings-body" id="settingsBody"></div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close button
      document.getElementById('settingsClose').addEventListener('click', () => {
        this.closeSettingsModal();
      });

      // Close on outside click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeSettingsModal();
        }
      });
    }
    
    return modal;
  }

  renderSettings() {
    const body = document.getElementById('settingsBody');
    if (!body) return;

    const maskedKey = this.settings.apiKey 
      ? `${this.settings.apiKey.substring(0, 7)}...${this.settings.apiKey.substring(this.settings.apiKey.length - 4)}`
      : 'Not set';

    body.innerHTML = `
      <div class="settings-section">
        <h3>🔑 OpenAI API Key</h3>
        <p class="settings-description">Your API key is stored locally and never sent to our servers.</p>
        <div class="settings-row">
          <input 
            type="password" 
            id="apiKeyInput" 
            placeholder="sk-..." 
            value="${this.settings.apiKey || ''}"
            class="settings-input"
          >
          <button id="saveApiKey" class="btn btn-primary">Save</button>
        </div>
        <div class="settings-info">Current: ${maskedKey}</div>
        ${this.settings.apiKey ? '<button id="clearApiKey" class="btn btn-secondary">Clear API Key</button>' : ''}
        <div id="apiKeyError" class="settings-error"></div>
      </div>

      <div class="settings-section">
        <h3>🤖 Model Settings</h3>
        <div class="settings-row">
          <label for="modelSelect">Default Model:</label>
          <select id="modelSelect" class="settings-select">
            ${this.renderModelOptions()}
          </select>
        </div>
      </div>

      <div class="settings-section">
        <h3>⚡ Generation Settings</h3>
        <div class="settings-row">
          <label for="maxTokensInput">Max Tokens per Response:</label>
          <input 
            type="number" 
            id="maxTokensInput" 
            value="${this.settings.maxTokens}"
            min="100"
            max="128000"
            class="settings-input"
          >
        </div>
        <div class="settings-row">
          <label for="temperatureInput">Temperature (0-2):</label>
          <input 
            type="number" 
            id="temperatureInput" 
            value="${this.settings.temperature}"
            min="0"
            max="2"
            step="0.1"
            class="settings-input"
          >
        </div>
      </div>

      <div class="settings-section">
        <h3>🔌 MCP Servers</h3>
        <p class="settings-description">Connect to Model Context Protocol servers for extended capabilities.</p>
        <div class="settings-row">
          <label>
            <input 
              type="checkbox" 
              id="enableMCP" 
              ${this.settings.enableMCP ? 'checked' : ''}
            >
            Enable MCP Integration
          </label>
        </div>
        <div id="mcpServersList">${this.renderMCPServers()}</div>
        <button id="addMCPServer" class="btn btn-secondary">+ Add MCP Server</button>
      </div>

      <div class="settings-section">
        <h3>🔐 Password Protection</h3>
        <button id="changePassword" class="btn btn-secondary">Change Password</button>
        <button id="removePassword" class="btn btn-secondary">Remove Password</button>
      </div>

      <div class="settings-section">
        <h3>💾 Data Management</h3>
        <button id="clearHistory" class="btn btn-secondary">Clear Chat History</button>
        <button id="exportSettings" class="btn btn-secondary">Export Settings</button>
      </div>
    `;

    this.attachEventListeners();
  }

  renderModelOptions() {
    const models = window.modelManager.getAllModels();
    const currentModel = window.modelManager.currentModel;
    
    return models.map(model => `
      <option value="${model.id}" ${model.id === currentModel ? 'selected' : ''}>
        ${model.name} - ${model.description}
      </option>
    `).join('');
  }

  renderMCPServers() {
    if (this.settings.mcpServers.length === 0) {
      return '<p class="settings-info">No MCP servers configured</p>';
    }

    return `
      <div class="mcp-servers-list">
        ${this.settings.mcpServers.map(server => `
          <div class="mcp-server-item" data-server-id="${server.id}">
            <label>
              <input 
                type="checkbox" 
                class="mcp-server-toggle"
                data-server-id="${server.id}"
                ${server.enabled ? 'checked' : ''}
              >
              <strong>${server.name}</strong>
            </label>
            <div class="mcp-server-url">${server.url}</div>
            <button class="btn-icon mcp-server-remove" data-server-id="${server.id}">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  attachEventListeners() {
    // API Key
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    if (saveApiKeyBtn) {
      saveApiKeyBtn.addEventListener('click', () => {
        const input = document.getElementById('apiKeyInput');
        const error = document.getElementById('apiKeyError');
        try {
          this.setApiKey(input.value.trim());
          error.textContent = '✓ API key saved successfully';
          error.style.color = 'var(--success-color, green)';
          setTimeout(() => this.renderSettings(), 1000);
        } catch (e) {
          error.textContent = e.message;
          error.style.color = 'var(--error-color, red)';
        }
      });
    }

    const clearApiKeyBtn = document.getElementById('clearApiKey');
    if (clearApiKeyBtn) {
      clearApiKeyBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your API key?')) {
          this.clearApiKey();
          this.renderSettings();
        }
      });
    }

    // Model selection
    const modelSelect = document.getElementById('modelSelect');
    if (modelSelect) {
      modelSelect.addEventListener('change', (e) => {
        window.modelManager.setModel(e.target.value);
      });
    }

    // Max tokens
    const maxTokensInput = document.getElementById('maxTokensInput');
    if (maxTokensInput) {
      maxTokensInput.addEventListener('change', (e) => {
        try {
          this.setMaxTokens(e.target.value);
        } catch (error) {
          alert(error.message);
          e.target.value = this.settings.maxTokens;
        }
      });
    }

    // Temperature
    const temperatureInput = document.getElementById('temperatureInput');
    if (temperatureInput) {
      temperatureInput.addEventListener('change', (e) => {
        try {
          this.setTemperature(e.target.value);
        } catch (error) {
          alert(error.message);
          e.target.value = this.settings.temperature;
        }
      });
    }

    // MCP Enable
    const enableMCP = document.getElementById('enableMCP');
    if (enableMCP) {
      enableMCP.addEventListener('change', (e) => {
        this.setMCPEnabled(e.target.checked);
      });
    }

    // Add MCP Server
    const addMCPBtn = document.getElementById('addMCPServer');
    if (addMCPBtn) {
      addMCPBtn.addEventListener('click', () => {
        this.showAddMCPServerDialog();
      });
    }

    // MCP Server toggles and removes
    document.querySelectorAll('.mcp-server-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const serverId = e.target.dataset.serverId;
        this.updateMCPServer(serverId, { enabled: e.target.checked });
      });
    });

    document.querySelectorAll('.mcp-server-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const serverId = e.target.closest('[data-server-id]').dataset.serverId;
        if (confirm('Remove this MCP server?')) {
          this.removeMCPServer(serverId);
          this.renderSettings();
        }
      });
    });

    // Password management
    const changePasswordBtn = document.getElementById('changePassword');
    if (changePasswordBtn) {
      changePasswordBtn.addEventListener('click', () => {
        this.showChangePasswordDialog();
      });
    }

    const removePasswordBtn = document.getElementById('removePassword');
    if (removePasswordBtn) {
      removePasswordBtn.addEventListener('click', () => {
        this.showRemovePasswordDialog();
      });
    }

    // Data management
    const clearHistoryBtn = document.getElementById('clearHistory');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Clear all chat history? This cannot be undone.')) {
          localStorage.removeItem('vibecoding-chat-history');
          alert('Chat history cleared');
        }
      });
    }

    const exportSettingsBtn = document.getElementById('exportSettings');
    if (exportSettingsBtn) {
      exportSettingsBtn.addEventListener('click', () => {
        this.exportSettings();
      });
    }
  }

  showAddMCPServerDialog() {
    const name = prompt('Enter MCP server name:');
    if (!name) return;

    const url = prompt('Enter MCP server URL:');
    if (!url) return;

    try {
      this.addMCPServer({ name, url, enabled: true });
      this.renderSettings();
    } catch (error) {
      alert(error.message);
    }
  }

  showChangePasswordDialog() {
    const oldPassword = prompt('Enter current password:');
    if (!oldPassword) return;

    const newPassword = prompt('Enter new password (min 4 characters):');
    if (!newPassword) return;

    const confirm = prompt('Confirm new password:');
    if (newPassword !== confirm) {
      alert('Passwords do not match');
      return;
    }

    window.authManager.changePassword(oldPassword, newPassword)
      .then(() => alert('Password changed successfully'))
      .catch(error => alert(error.message));
  }

  showRemovePasswordDialog() {
    const password = prompt('Enter password to remove protection:');
    if (!password) return;

    window.authManager.removePassword(password)
      .then(() => {
        alert('Password protection removed');
        this.closeSettingsModal();
      })
      .catch(error => alert(error.message));
  }

  exportSettings() {
    const exportData = {
      settings: this.settings,
      model: window.modelManager.currentModel,
      exportDate: new Date().toISOString()
    };

    // Remove API key from export
    delete exportData.settings.apiKey;

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibecoding-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize settings manager
window.settingsManager = new SettingsManager();

