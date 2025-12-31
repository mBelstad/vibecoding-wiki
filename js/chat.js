// Chat Module
// Handles OpenAI API integration, wiki context, prompt presets, and MCP tools

// Prompt presets for Cursor optimization
const PROMPT_PRESETS = {
  'general': {
    name: 'General Question',
    systemPrompt: 'You are a helpful assistant that answers questions about the Vibecoding Playbook.',
    userPrefix: ''
  },
  'new-feature': {
    name: 'New Feature',
    systemPrompt: 'You are an expert software architect helping implement new features using Vibecoding principles. Focus on: 1) Clear requirements, 2) Minimal viable implementation, 3) Testing strategy, 4) Rollback plan.',
    userPrefix: 'Help me implement this feature following Vibecoding best practices:\n\n'
  },
  'bug-fix': {
    name: 'Bug Fix',
    systemPrompt: 'You are a debugging expert using the Vibecoding hypothesis-driven approach. Always: 1) State the hypothesis, 2) Suggest measurable tests, 3) Propose minimal changes, 4) Include rollback steps.',
    userPrefix: 'Help me debug this issue using hypothesis-driven debugging:\n\n'
  },
  'refactor': {
    name: 'Refactor',
    systemPrompt: 'You are a code quality expert focused on clean architecture and maintainability. Follow Vibecoding principles: 1) Minimal diffs, 2) Keep it simple, 3) Document decisions (ADR), 4) Maintain backward compatibility.',
    userPrefix: 'Help me refactor this code while maintaining quality:\n\n'
  },
  'explain': {
    name: 'Explain Code',
    systemPrompt: 'You are a technical educator helping understand code and concepts. Explain clearly with: 1) High-level overview, 2) Key concepts, 3) Practical examples, 4) Common pitfalls.',
    userPrefix: 'Explain this code/concept:\n\n'
  }
};

class ChatManager {
  constructor() {
    this.messages = [];
    this.currentPreset = 'general';
    this.isProcessing = false;
    this.wikiContext = null;
    this.mcpTools = [];
    this.conversationId = Date.now().toString();
    
    this.init();
  }

  async init() {
    // Wait for authentication
    window.authManager.requireAuth(() => {
      this.loadWikiContext();
      this.loadChatHistory();
      this.initializeUI();
      this.loadMCPTools();
    });
  }

  async loadWikiContext() {
    try {
      // Load the wiki content to use as context
      const response = await fetch('Vibecoding_Playbook_Full_EN.md');
      const fullText = await response.text();
      
      // Create a condensed version (first ~2000 tokens worth)
      const lines = fullText.split('\n');
      let condensed = '';
      let charCount = 0;
      const maxChars = 8000; // Roughly 2000 tokens
      
      for (const line of lines) {
        if (charCount + line.length > maxChars) break;
        condensed += line + '\n';
        charCount += line.length;
      }
      
      this.wikiContext = condensed;
    } catch (error) {
      console.error('Failed to load wiki context:', error);
      this.wikiContext = 'Vibecoding Playbook - A methodology for efficient and safe AI-assisted coding.';
    }
  }

  loadChatHistory() {
    const saved = localStorage.getItem('vibecoding-chat-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.conversationId === this.conversationId) {
          this.messages = parsed.messages || [];
        }
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }

  saveChatHistory() {
    if (window.settingsManager.settings.autoSaveHistory) {
      localStorage.setItem('vibecoding-chat-history', JSON.stringify({
        conversationId: this.conversationId,
        messages: this.messages,
        timestamp: Date.now()
      }));
    }
  }

  clearChatHistory() {
    this.messages = [];
    this.conversationId = Date.now().toString();
    this.saveChatHistory();
    this.renderMessages();
  }

  initializeUI() {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;

    // Render initial messages
    this.renderMessages();

    // Preset selector
    const presetSelect = document.getElementById('presetSelect');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        this.currentPreset = e.target.value;
      });
    }

    // Model selector
    const modelSelect = document.getElementById('chatModelSelect');
    if (modelSelect) {
      modelSelect.addEventListener('change', (e) => {
        window.modelManager.setModel(e.target.value);
        this.updateModelDisplay();
      });
    }

    // Send button
    const sendBtn = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');
    
    if (sendBtn && messageInput) {
      sendBtn.addEventListener('click', () => this.sendMessage());
      
      messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      messageInput.addEventListener('input', () => {
        this.updateTokenCount();
      });
    }

    // Clear chat button
    const clearBtn = document.getElementById('clearChat');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all chat messages?')) {
          this.clearChatHistory();
        }
      });
    }

    // Settings button
    const settingsBtn = document.getElementById('chatSettings');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        window.settingsManager.openSettingsModal();
      });
    }

    this.updateModelDisplay();
    this.updateTokenCount();
  }

  updateModelDisplay() {
    const modelDisplay = document.getElementById('currentModel');
    if (modelDisplay) {
      const model = window.modelManager.getCurrentModel();
      modelDisplay.textContent = model.name;
    }
  }

  updateTokenCount() {
    const input = document.getElementById('messageInput');
    const display = document.getElementById('tokenCount');
    
    if (!input || !display) return;

    const estimated = window.modelManager.estimateTokens(input.value);
    const maxTokens = window.settingsManager.getMaxTokens();
    
    display.textContent = `~${estimated} tokens`;
    
    if (estimated > maxTokens * 0.8) {
      display.style.color = 'var(--error-color, red)';
    } else if (estimated > maxTokens * 0.5) {
      display.style.color = 'var(--warning-color, orange)';
    } else {
      display.style.color = '';
    }
  }

  async sendMessage() {
    const input = document.getElementById('messageInput');
    if (!input || !input.value.trim()) return;

    // Check for API key
    if (!window.settingsManager.hasApiKey()) {
      alert('Please set your OpenAI API key in settings first.');
      window.settingsManager.openSettingsModal();
      return;
    }

    if (this.isProcessing) return;

    const userMessage = input.value.trim();
    input.value = '';
    this.updateTokenCount();

    // Add user message
    this.addMessage('user', userMessage);

    // Show typing indicator
    this.showTypingIndicator();
    this.isProcessing = true;

    try {
      const response = await this.callOpenAI(userMessage);
      this.hideTypingIndicator();
      this.addMessage('assistant', response);
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage('error', `Error: ${error.message}`);
    } finally {
      this.isProcessing = false;
    }
  }

  async callOpenAI(userMessage) {
    const apiKey = window.settingsManager.getApiKey();
    const model = window.modelManager.getCurrentModel();
    const preset = PROMPT_PRESETS[this.currentPreset];
    
    // Build system prompt with wiki context
    const systemPrompt = `${preset.systemPrompt}

You have access to the Vibecoding Playbook documentation:

${this.wikiContext}

Use this documentation to answer questions accurately. If the answer isn't in the documentation, say so clearly.`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (keep last 10 messages for context)
    const recentMessages = this.messages.slice(-10).filter(m => m.role !== 'error');
    messages.push(...recentMessages);

    // Add current message with preset prefix
    const finalUserMessage = preset.userPrefix + userMessage;
    messages.push({ role: 'user', content: finalUserMessage });

    // Prepare request
    const requestBody = {
      model: model.id,
      messages: messages,
      max_tokens: window.settingsManager.getMaxTokens(),
      temperature: window.settingsManager.getTemperature()
    };

    // Add function calling if model supports it and MCP is enabled
    if (model.supportsFunctions && window.settingsManager.isMCPEnabled()) {
      requestBody.tools = this.getMCPTools();
    }

    // Make API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    
    // Handle tool calls if present
    if (data.choices[0].message.tool_calls) {
      return await this.handleToolCalls(data.choices[0].message, messages);
    }

    // Track usage
    this.trackUsage(data.usage);

    return data.choices[0].message.content;
  }

  async handleToolCalls(assistantMessage, messages) {
    // Add assistant message with tool calls
    messages.push(assistantMessage);

    // Execute each tool call
    const toolResults = [];
    for (const toolCall of assistantMessage.tool_calls) {
      const result = await this.executeMCPTool(toolCall);
      toolResults.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        content: JSON.stringify(result)
      });
    }

    // Add tool results to messages
    messages.push(...toolResults);

    // Make another API call with tool results
    const apiKey = window.settingsManager.getApiKey();
    const model = window.modelManager.getCurrentModel();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model.id,
        messages: messages,
        max_tokens: window.settingsManager.getMaxTokens(),
        temperature: window.settingsManager.getTemperature()
      })
    });

    const data = await response.json();
    this.trackUsage(data.usage);

    return data.choices[0].message.content;
  }

  async executeMCPTool(toolCall) {
    try {
      const { name, arguments: args } = toolCall.function;
      const parsedArgs = JSON.parse(args);

      // Find the MCP server that provides this tool
      const servers = window.settingsManager.getEnabledMCPServers();
      const server = servers.find(s => s.tools.some(t => t.name === name));

      if (!server) {
        return { error: 'Tool not found' };
      }

      // Call the MCP server
      const response = await fetch(`${server.url}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: name,
          arguments: parsedArgs
        })
      });

      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  getMCPTools() {
    const servers = window.settingsManager.getEnabledMCPServers();
    const tools = [];

    for (const server of servers) {
      for (const tool of server.tools) {
        tools.push({
          type: 'function',
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters
          }
        });
      }
    }

    return tools;
  }

  async loadMCPTools() {
    if (!window.settingsManager.isMCPEnabled()) return;

    const servers = window.settingsManager.getEnabledMCPServers();
    
    for (const server of servers) {
      try {
        const response = await fetch(`${server.url}/tools`);
        const tools = await response.json();
        
        window.settingsManager.updateMCPServer(server.id, { tools });
      } catch (error) {
        console.error(`Failed to load tools from ${server.name}:`, error);
      }
    }
  }

  trackUsage(usage) {
    if (!usage) return;

    const model = window.modelManager.getCurrentModel();
    const cost = window.modelManager.estimateCost(
      usage.prompt_tokens,
      usage.completion_tokens,
      model.id
    );

    // Store usage stats
    const stats = JSON.parse(localStorage.getItem('vibecoding-usage-stats') || '{}');
    const today = new Date().toISOString().split('T')[0];
    
    if (!stats[today]) {
      stats[today] = { tokens: 0, cost: 0, requests: 0 };
    }

    stats[today].tokens += usage.total_tokens;
    stats[today].cost += cost;
    stats[today].requests += 1;

    localStorage.setItem('vibecoding-usage-stats', JSON.stringify(stats));

    // Update display
    this.updateUsageDisplay(stats[today]);
  }

  updateUsageDisplay(todayStats) {
    const display = document.getElementById('usageStats');
    if (display) {
      display.textContent = `Today: ${todayStats.tokens.toLocaleString()} tokens ($${todayStats.cost.toFixed(4)})`;
    }
  }

  addMessage(role, content) {
    const message = { role, content, timestamp: Date.now() };
    this.messages.push(message);
    this.saveChatHistory();
    this.renderMessages();
  }

  renderMessages() {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    container.innerHTML = '';

    if (this.messages.length === 0) {
      container.innerHTML = `
        <div class="chat-empty">
          <div class="chat-empty-icon">💬</div>
          <p>Ask me anything about the Vibecoding Playbook!</p>
          <p class="chat-empty-hint">Select a preset above to get started with specific tasks.</p>
        </div>
      `;
      return;
    }

    for (const message of this.messages) {
      const messageEl = document.createElement('div');
      messageEl.className = `chat-message chat-message-${message.role}`;
      
      const avatar = document.createElement('div');
      avatar.className = 'chat-message-avatar';
      avatar.textContent = message.role === 'user' ? '👤' : message.role === 'error' ? '⚠️' : '🤖';
      
      const content = document.createElement('div');
      content.className = 'chat-message-content';
      
      // Simple markdown rendering
      content.innerHTML = this.renderMarkdown(message.content);
      
      messageEl.appendChild(avatar);
      messageEl.appendChild(content);
      container.appendChild(messageEl);
    }

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  }

  renderMarkdown(text) {
    // Very basic markdown rendering
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>');
    
    // Wrap in paragraph if not already
    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>';
    }

    // Wrap list items
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    return html;
  }

  showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'chat-message chat-message-assistant';
    indicator.innerHTML = `
      <div class="chat-message-avatar">🤖</div>
      <div class="chat-message-content">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }
}

// Initialize chat manager when authenticated
window.addEventListener('authenticationComplete', () => {
  window.chatManager = new ChatManager();
});

