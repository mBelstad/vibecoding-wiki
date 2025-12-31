// OpenAI Models Configuration
// Defines all available models and their capabilities

const OPENAI_MODELS = {
  // GPT-4.1 Series (Latest)
  'gpt-4.1': {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    type: 'chat',
    description: 'Latest GPT model - General purpose, excellent for coding',
    maxTokens: 128000,
    supportsVision: true,
    supportsFunctions: true,
    costPer1kInput: 0.01,
    costPer1kOutput: 0.03,
    recommended: true
  },
  'gpt-4.1-mini': {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    type: 'chat',
    description: 'Fast and cost-effective - Quick responses',
    maxTokens: 128000,
    supportsVision: true,
    supportsFunctions: true,
    costPer1kInput: 0.0015,
    costPer1kOutput: 0.006,
    recommended: false
  },
  'gpt-4.1-nano': {
    id: 'gpt-4.1-nano',
    name: 'GPT-4.1 Nano',
    type: 'chat',
    description: 'Ultra-fast - Simple tasks, very cheap',
    maxTokens: 128000,
    supportsVision: false,
    supportsFunctions: true,
    costPer1kInput: 0.0005,
    costPer1kOutput: 0.002,
    recommended: false
  },

  // GPT-4o Series
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    type: 'chat',
    description: 'Flagship multimodal - High quality responses',
    maxTokens: 128000,
    supportsVision: true,
    supportsFunctions: true,
    costPer1kInput: 0.005,
    costPer1kOutput: 0.015,
    recommended: true
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    type: 'chat',
    description: 'Good balance of speed and quality',
    maxTokens: 128000,
    supportsVision: true,
    supportsFunctions: true,
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.0006,
    recommended: false
  },

  // GPT-4 Turbo
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    type: 'chat',
    description: 'Previous generation - Still very capable',
    maxTokens: 128000,
    supportsVision: true,
    supportsFunctions: true,
    costPer1kInput: 0.01,
    costPer1kOutput: 0.03,
    recommended: false
  },

  // o-series (Reasoning Models)
  'o4-mini': {
    id: 'o4-mini',
    name: 'o4-mini',
    type: 'reasoning',
    description: 'Latest reasoning model - Advanced problem solving',
    maxTokens: 100000,
    supportsVision: false,
    supportsFunctions: false,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.012,
    recommended: true,
    reasoningModel: true
  },
  'o3': {
    id: 'o3',
    name: 'o3',
    type: 'reasoning',
    description: 'Complex reasoning tasks - Deep analysis',
    maxTokens: 100000,
    supportsVision: false,
    supportsFunctions: false,
    costPer1kInput: 0.015,
    costPer1kOutput: 0.06,
    recommended: false,
    reasoningModel: true
  },
  'o3-mini': {
    id: 'o3-mini',
    name: 'o3-mini',
    type: 'reasoning',
    description: 'Reasoning model - Cost-effective',
    maxTokens: 100000,
    supportsVision: false,
    supportsFunctions: false,
    costPer1kInput: 0.001,
    costPer1kOutput: 0.004,
    recommended: false,
    reasoningModel: true
  },
  'o1': {
    id: 'o1',
    name: 'o1',
    type: 'reasoning',
    description: 'Deep thinking and analysis',
    maxTokens: 100000,
    supportsVision: false,
    supportsFunctions: false,
    costPer1kInput: 0.015,
    costPer1kOutput: 0.06,
    recommended: false,
    reasoningModel: true
  },
  'o1-mini': {
    id: 'o1-mini',
    name: 'o1-mini',
    type: 'reasoning',
    description: 'Lighter reasoning tasks',
    maxTokens: 65536,
    supportsVision: false,
    supportsFunctions: false,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.012,
    recommended: false,
    reasoningModel: true
  },
  'o1-pro': {
    id: 'o1-pro',
    name: 'o1-pro',
    type: 'reasoning',
    description: 'Maximum reasoning power - Most advanced',
    maxTokens: 100000,
    supportsVision: false,
    supportsFunctions: false,
    costPer1kInput: 0.03,
    costPer1kOutput: 0.12,
    recommended: false,
    reasoningModel: true
  }
};

class ModelManager {
  constructor() {
    this.models = OPENAI_MODELS;
    this.currentModel = this.getDefaultModel();
    this.loadSettings();
  }

  loadSettings() {
    const savedModel = localStorage.getItem('vibecoding-selected-model');
    if (savedModel && this.models[savedModel]) {
      this.currentModel = savedModel;
    }
  }

  saveSettings() {
    localStorage.setItem('vibecoding-selected-model', this.currentModel);
  }

  getDefaultModel() {
    // Return the first recommended model
    const recommended = Object.values(this.models).find(m => m.recommended);
    return recommended ? recommended.id : 'gpt-4o';
  }

  setModel(modelId) {
    if (this.models[modelId]) {
      this.currentModel = modelId;
      this.saveSettings();
      return true;
    }
    return false;
  }

  getCurrentModel() {
    return this.models[this.currentModel];
  }

  getAllModels() {
    return Object.values(this.models);
  }

  getModelsByType(type) {
    return Object.values(this.models).filter(m => m.type === type);
  }

  getRecommendedModels() {
    return Object.values(this.models).filter(m => m.recommended);
  }

  estimateCost(inputTokens, outputTokens, modelId = null) {
    const model = modelId ? this.models[modelId] : this.getCurrentModel();
    if (!model) return 0;

    const inputCost = (inputTokens / 1000) * model.costPer1kInput;
    const outputCost = (outputTokens / 1000) * model.costPer1kOutput;
    return inputCost + outputCost;
  }

  getModelInfo(modelId) {
    return this.models[modelId] || null;
  }

  supportsFeature(feature, modelId = null) {
    const model = modelId ? this.models[modelId] : this.getCurrentModel();
    if (!model) return false;

    switch (feature) {
      case 'vision':
        return model.supportsVision;
      case 'functions':
        return model.supportsFunctions;
      case 'reasoning':
        return model.reasoningModel || false;
      default:
        return false;
    }
  }

  getMaxTokens(modelId = null) {
    const model = modelId ? this.models[modelId] : this.getCurrentModel();
    return model ? model.maxTokens : 4096;
  }

  // Estimate token count (rough approximation)
  estimateTokens(text) {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  formatModelForDisplay(modelId) {
    const model = this.models[modelId];
    if (!model) return modelId;

    let display = model.name;
    if (model.reasoningModel) {
      display += ' 🧠';
    }
    if (model.recommended) {
      display += ' ⭐';
    }
    return display;
  }
}

// Initialize model manager
window.modelManager = new ModelManager();

