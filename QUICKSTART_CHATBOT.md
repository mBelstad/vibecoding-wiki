# Chatbot Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Open the Wiki
Open `index.html` in your web browser (or deploy to your web server).

### Step 2: Set Password
On first visit, you'll see a password setup screen:
- Enter a password (minimum 4 characters)
- Confirm it
- Click "Set Password"

### Step 3: Add API Key
1. Click the settings icon (⚙️) in the chat header
2. Enter your OpenAI API key (get one at platform.openai.com)
3. Click "Save"

**That's it! You're ready to chat! 🎉**

---

## 💬 Using the Chat

### Ask a Question
Simply type your question in the text box and press Enter or click Send.

### Use Presets
Select a preset from the dropdown for task-specific help:
- **New Feature** - Implementing new functionality
- **Bug Fix** - Debugging with hypothesis-driven approach
- **Refactor** - Code quality improvements
- **Explain Code** - Learning and understanding

### Switch Models
The default model is GPT-4o. To change:
1. Click settings (⚙️)
2. Select "Default Model"
3. Choose from 11 available models

**Recommended models:**
- **GPT-4.1** or **GPT-4o** - Best for coding
- **GPT-4o-mini** - Fast and cheap
- **o4-mini** - For complex reasoning

---

## ⚙️ Important Settings

### Token Limit (Prevent High Costs)
Default: 4,000 tokens per response

To change:
1. Settings → "Max Tokens per Response"
2. Lower for safety (2,000) or higher for longer responses (8,000)

### Temperature (Response Style)
Default: 0.7

- **0.0-0.3** - Focused, deterministic
- **0.7-1.0** - Balanced (recommended)
- **1.0-2.0** - Creative, varied

---

## 🔒 Security Notes

### ⚠️ Your API Key
- Stored in browser localStorage (not encrypted)
- Visible in browser dev tools
- Use a dedicated key with spending limits
- Monitor usage at platform.openai.com

### 🔐 Password Protection
- Client-side only (not military-grade)
- Good for casual protection
- Don't use on shared computers

### 💡 Best Practice
Set spending limits in your OpenAI dashboard:
1. Go to platform.openai.com
2. Settings → Billing → Usage limits
3. Set monthly limit (e.g., $10, $20, $50)

---

## 💰 Managing Costs

### Token Usage
- Shown below input field in real-time
- Daily statistics displayed
- Color warnings when approaching limit

### Cost-Saving Tips
1. **Use mini models** for simple questions (GPT-4o-mini)
2. **Clear chat history** when starting new topics
3. **Set token limits** (default 4,000 is good)
4. **Monitor daily usage** in the chat interface

### Typical Costs (Estimates)
- Simple question: $0.001 - $0.01
- Code explanation: $0.01 - $0.05
- Complex debugging: $0.05 - $0.20
- Long conversation: $0.20 - $1.00

*Actual costs vary by model and response length*

---

## 🔧 Troubleshooting

### "Please set your OpenAI API key"
→ Click settings (⚙️) and add your API key

### "API request failed"
→ Check your API key and OpenAI account credits

### "Incorrect password"
→ Re-enter carefully. If forgotten, clear browser data

### Chat not responding
→ Check browser console (F12) for errors

### High token count warning
→ Shorten your message or increase limit in settings

---

## 📚 Learn More

- **Full Guide**: See `CHATBOT_GUIDE.md`
- **Implementation Details**: See `CHATBOT_IMPLEMENTATION.md`
- **Vibecoding Playbook**: Click "Full Playbook" on homepage

---

## 🎯 Quick Tips

1. **Be specific** in your questions for better answers
2. **Use presets** for task-specific guidance
3. **Start fresh** - clear history when changing topics
4. **Monitor usage** - check daily stats regularly
5. **Set limits** - protect against unexpected costs

---

## 🆘 Need Help?

1. Read the full guide: `CHATBOT_GUIDE.md`
2. Check OpenAI status: status.openai.com
3. Review browser console for errors (F12)

---

**Enjoy your AI-powered Vibecoding assistant! 🚀**

