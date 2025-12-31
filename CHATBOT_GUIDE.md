# Vibecoding Wiki Chatbot Guide

## Overview

The Vibecoding Wiki now includes an AI-powered chatbot assistant that helps answer questions about the Vibecoding methodology, provides coding assistance, and offers task-specific guidance optimized for Cursor.

## Features

### 🔐 Password Protection
- Simple client-side password protection to restrict access
- Password is hashed using SHA-256 before storage
- Session-based authentication (stays logged in until browser closes)

### 🤖 AI Assistant
- Powered by OpenAI's latest models
- Wiki-aware: Automatically includes Vibecoding Playbook content as context
- Supports multiple conversation threads with history

### 🎯 Task-Based Prompt Presets
Pre-configured prompts optimized for common Cursor workflows:
- **General Question**: Basic Q&A about Vibecoding
- **New Feature**: Structured guidance for implementing features
- **Bug Fix**: Hypothesis-driven debugging approach
- **Refactor**: Code quality and architecture improvements
- **Explain Code**: Educational explanations of code concepts

### 🔄 Model Switching
Choose from the latest OpenAI models:
- **GPT-4.1** series (gpt-4.1, gpt-4.1-mini, gpt-4.1-nano)
- **GPT-4o** series (gpt-4o, gpt-4o-mini)
- **GPT-4 Turbo**
- **o-series reasoning models** (o1, o1-mini, o1-pro, o3, o3-mini, o4-mini)

### 💰 Token Usage Protection
- Configurable max tokens per response (default: 4,000)
- Real-time token count estimation
- Daily usage tracking with cost estimates
- Prevents accidental runaway costs

### 🔌 MCP (Model Context Protocol) Support
- Connect to external MCP servers for extended capabilities
- Support for tool calling via OpenAI function calling
- Easy configuration through settings UI

## Getting Started

### First Time Setup

1. **Open the Wiki**: Navigate to the homepage (index.html)

2. **Set Password**: On first visit, you'll be prompted to create a password
   - Enter a password (minimum 4 characters)
   - Confirm the password
   - Click "Set Password"

3. **Configure API Key**:
   - Click the settings icon (⚙️) in the chat header
   - Enter your OpenAI API key (starts with `sk-`)
   - Click "Save"
   - Your key is stored locally in your browser with basic obfuscation

4. **Start Chatting**: Type your question and press Enter or click Send

## Using the Chatbot

### Selecting a Preset

1. Use the dropdown menu at the top of the chat
2. Select the preset that matches your task:
   - **New Feature**: When implementing new functionality
   - **Bug Fix**: When debugging issues
   - **Refactor**: When improving code quality
   - **Explain Code**: When learning about code/concepts

### Switching Models

1. Click the settings icon (⚙️)
2. Select your preferred model from the "Default Model" dropdown
3. Models are grouped by type:
   - **Chat models**: Best for general conversation and coding
   - **Reasoning models**: Best for complex problem-solving

### Model Recommendations

- **GPT-4.1** or **GPT-4o**: Best all-around for coding tasks
- **GPT-4.1-mini** or **GPT-4o-mini**: Fast and cost-effective
- **o4-mini** or **o3-mini**: For complex reasoning at lower cost
- **o1-pro**: Maximum reasoning power (most expensive)

## Settings Configuration

### API Key Management
- **Set Key**: Enter your OpenAI API key
- **View Key**: Shows masked version (first 7 and last 4 characters)
- **Clear Key**: Remove stored API key

### Generation Settings
- **Max Tokens**: Limit response length (100-128,000)
- **Temperature**: Control randomness (0-2, default 0.7)
  - Lower = more focused and deterministic
  - Higher = more creative and varied

### MCP Server Configuration
1. Enable MCP Integration checkbox
2. Click "Add MCP Server"
3. Enter server name and URL
4. Toggle servers on/off as needed
5. Remove servers you no longer need

### Password Management
- **Change Password**: Update your access password
- **Remove Password**: Disable password protection entirely

### Data Management
- **Clear Chat History**: Delete all conversation history
- **Export Settings**: Download your settings as JSON (excludes API key)

## Security Notes

### ⚠️ Important Security Information

1. **API Key Storage**:
   - Your API key is stored in browser localStorage
   - It's base64 encoded (obfuscation, NOT encryption)
   - Anyone with access to your browser dev tools can view it
   - Never share your device while logged in

2. **Password Protection**:
   - Client-side only (no server validation)
   - SHA-256 hashed before storage
   - Suitable for casual protection, not military-grade security

3. **Direct API Calls**:
   - The browser calls OpenAI API directly
   - No backend proxy or server involved
   - Your API key never touches any server we control

4. **Recommendations**:
   - Use a dedicated API key with usage limits set in OpenAI dashboard
   - Monitor your OpenAI usage regularly
   - Don't use on shared/public computers
   - Clear browser data when done on shared devices

## Token Usage & Cost Management

### Monitoring Usage
- Real-time token count shown below the input field
- Daily usage statistics displayed (tokens + estimated cost)
- Color-coded warnings when approaching limits

### Setting Limits
1. Open Settings (⚙️)
2. Adjust "Max Tokens per Response"
3. Recommended: 4,000 tokens (balanced)
4. Conservative: 2,000 tokens
5. Generous: 8,000 tokens

### Cost Estimates
The chatbot tracks and estimates costs based on:
- Input tokens (your messages + context)
- Output tokens (AI responses)
- Model pricing (varies by model)

View daily totals in the chat input footer.

## Troubleshooting

### "Please set your OpenAI API key"
- Click settings icon (⚙️)
- Enter a valid OpenAI API key
- Key must start with `sk-`

### "API request failed"
- Check your API key is correct
- Verify you have credits in your OpenAI account
- Check your internet connection
- Try a different model

### "Incorrect password"
- Re-enter your password carefully
- If forgotten, you'll need to clear browser localStorage
- In browser console: `localStorage.removeItem('vibecoding-auth-hash')`

### Chat not responding
- Check browser console for errors (F12)
- Verify API key is set correctly
- Try refreshing the page
- Clear chat history and try again

### Token limit warnings
- Reduce your message length
- Increase max tokens in settings
- Clear chat history to reduce context size

## Advanced Features

### MCP Integration

MCP (Model Context Protocol) allows the chatbot to use external tools:

1. **Setup**:
   - Enable MCP in settings
   - Add MCP server URL
   - Server must support MCP protocol

2. **Usage**:
   - Tools are automatically discovered
   - AI can call tools when needed
   - Results are incorporated into responses

3. **Example Use Cases**:
   - File system operations
   - Web searches
   - API calls
   - Database queries

### Custom Presets

While presets are currently hardcoded, you can:
1. Use the "General Question" preset
2. Add your own prompt prefix in your message
3. Example: "Acting as a security expert, review this code..."

## Best Practices

### For Best Results

1. **Be Specific**: Clear, detailed questions get better answers
2. **Use Presets**: Select the appropriate preset for your task
3. **Provide Context**: Include relevant code or details
4. **Iterate**: Ask follow-up questions to refine answers

### For Cost Efficiency

1. **Choose Appropriate Models**:
   - Use mini models for simple questions
   - Use full models for complex tasks
   - Use reasoning models only when needed

2. **Manage Context**:
   - Clear chat history when starting new topics
   - Keep messages concise
   - Monitor token usage

3. **Set Limits**:
   - Configure max tokens appropriately
   - Set OpenAI account spending limits
   - Review usage regularly

## Privacy & Data

### What's Stored Locally
- Password hash (SHA-256)
- API key (base64 encoded)
- Chat history
- Settings preferences
- Usage statistics

### What's Sent to OpenAI
- Your messages
- Chat history (last 10 messages for context)
- Wiki content (condensed, ~2000 tokens)
- Selected model and parameters

### What's NOT Stored
- Your actual password (only hash)
- Chat history on any server
- Personal information

## Support

### Getting Help

1. **Documentation**: Read the Vibecoding Playbook
2. **OpenAI Status**: Check status.openai.com
3. **Browser Console**: Check for error messages (F12)

### Common Questions

**Q: Can I use this offline?**
A: No, requires internet connection to call OpenAI API

**Q: Can I use other AI providers?**
A: Currently only OpenAI is supported

**Q: Is my chat history private?**
A: Yes, stored only in your browser localStorage

**Q: Can I export my conversations?**
A: Not currently, but you can copy/paste messages

**Q: What's the best model for coding?**
A: GPT-4.1 or GPT-4o for best results, GPT-4o-mini for speed

## Updates & Maintenance

### Adding New Models

When OpenAI releases new models:
1. Edit `js/models.js`
2. Add model definition to `OPENAI_MODELS`
3. Include: id, name, type, description, pricing, capabilities
4. Refresh the page

### Updating Wiki Context

The chatbot automatically loads wiki content from:
- `Vibecoding_Playbook_Full_EN.md`

To update context:
1. Edit the markdown file
2. Refresh the page
3. Context is reloaded automatically

## Version History

### v1.0.0 (Current)
- Initial release
- Password protection
- OpenAI integration
- Task-based presets
- Model switching
- Token usage tracking
- MCP support
- Settings management

---

**Built with ❤️ for the Vibecoding community**

