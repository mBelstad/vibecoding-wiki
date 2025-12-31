# Vibecoding Wiki

A modern, developer-focused wiki website for the Vibecoding Playbook - a comprehensive guide for using AI assistants (Cursor with Claude) effectively while maintaining code quality and project safety.

## Features

- 🎨 **Modern Design**: Terminal-meets-modern-docs aesthetic with dark/light mode
- 🔍 **Full-Text Search**: Quick search with keyboard shortcut (Cmd/Ctrl+K)
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- 🌐 **Bilingual**: Support for Norwegian and English UI
- 📋 **Interactive Checklist**: "Have you remembered?" module with progress tracking
- 💻 **Code Snippets**: Syntax highlighting with one-click copy buttons
- 🧭 **Smart Navigation**: Floating table of contents with scroll spy
- ⚡ **Fast & Lightweight**: Pure HTML/CSS/JS, no build step required

## Quick Start

1. Open `index.html` in a web browser
2. Or use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```
3. Navigate to `http://localhost:8000`

## Project Structure

```
/
├── index.html                      # Landing page
├── playbook-full.html              # Full playbook
├── playbook-quickstart.html        # Quickstart guide
├── playbook-full-content.html      # Converted content
├── playbook-quickstart-content.html # Converted content
├── css/
│   └── styles.css                  # All styles
├── js/
│   ├── app.js                      # Main app logic
│   ├── search.js                   # Search functionality
│   ├── toc.js                      # Table of contents
│   └── i18n.js                     # Language switching
└── assets/
    └── icons/                      # SVG icons (if needed)
```

## Updating Content

To update the playbook content:

1. Edit `Vibecoding_Playbook_Full.md` or `Vibecoding_Playbook_Quickstart.md`
2. Run the conversion script:
   ```bash
   node convert-markdown.js
   ```
3. This will regenerate the HTML content files

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties for theming, Grid/Flexbox for layout
- **JavaScript**: Vanilla JS for all functionality
- **Prism.js**: Syntax highlighting (loaded from CDN)
- **Google Fonts**: Lexend for body text

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is part of the Vibecoding Playbook.

## Contributing

To contribute:
1. Make your changes
2. Test on multiple devices/browsers
3. Ensure all features work (search, TOC, theme toggle, etc.)
4. Submit your changes

---

Built with ⚡ for vibecoding

