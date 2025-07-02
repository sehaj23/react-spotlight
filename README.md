# 🔍 Spotlight Search

[![npm version](https://badge.fury.io/js/react-spotlight-search.svg)](https://badge.fury.io/js/react-spotlight-search)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A beautiful, fast, and customizable Spotlight-like search component for React applications.

![Spotlight Search Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Spotlight+Search+Demo)

## ✨ Features

- 🔍 **Fuzzy Search**: Intelligent search with typo tolerance using Fuse.js
- 🏷️ **Tag Support**: Search by alternative names and hidden tags
- ⏰ **Recently Used**: Smart caching of recently selected items (up to 6)
- ⌨️ **Keyboard Navigation**: Full keyboard support with arrow keys and shortcuts
- 🎨 **Modern Design**: Beautiful Spotlight-inspired UI with smooth animations
- 🌙 **Theme Support**: Light, dark, and auto themes
- 📱 **Responsive**: Works perfectly on all screen sizes
- 🎯 **Custom Handlers**: Per-item click functions for flexible behavior
- 🚀 **TypeScript**: Full TypeScript support with comprehensive types
- 🔧 **Customizable**: Easy styling with CSS custom properties
- ⚡ **Performant**: Optimized for large datasets with smart filtering

## 🚀 Quick Start

### Installation

```bash
npm install spotlight-search
```

**Peer Dependencies** (install if not already in your project):
```bash
npm install react react-dom @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### Basic Usage

```tsx
import React, { useState } from 'react';
import { Spotlight, SpotlightItem } from 'spotlight-search';

const items: SpotlightItem[] = [
  {
    id: '1',
    name: 'Dashboard',
    url: '/dashboard',
    tags: ['home', 'main', 'overview']
  },
  {
    id: '2',
    name: 'User Settings',
    url: '/settings',
    tags: ['profile', 'preferences', 'config'],
    onClick: (item) => {
      // Custom click handler for this item
      console.log('Opening settings with custom logic');
    }
  },
  {
    id: '3',
    name: 'Analytics',
    url: '/analytics',
    tags: ['stats', 'metrics', 'data']
  }
];

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: SpotlightItem) => {
    // Global handler for items without custom onClick
    window.location.href = item.url;
    setIsOpen(false);
  };

  // Open spotlight with keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Search (⌘K)
      </button>
      
      <Spotlight
        items={items}
        onSelect={handleSelect}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placeholder="Search anything..."
        showInitialResults={false}
        theme="auto"
      />
    </>
  );
}
```

## 📖 API Reference

### SpotlightItem

```tsx
interface SpotlightItem {
  id: string;                               // Unique identifier
  name: string;                             // Display name
  url: string;                              // URL or path
  tags: string[];                           // Alternative search terms
  icon?: string;                            // Optional icon URL
  onClick?: (item: SpotlightItem) => void; // Custom click handler
}
```

### SpotlightProps

```tsx
interface SpotlightProps {
  items: SpotlightItem[];                   // Array of searchable items
  onSelect: (item: SpotlightItem) => void; // Global selection handler
  placeholder?: string;                     // Search input placeholder (default: "Search...")
  maxResults?: number;                      // Maximum results to show (default: 8)
  showRecent?: boolean;                     // Show recently used items (default: true)
  showInitialResults?: boolean;             // Show results before typing (default: true)
  className?: string;                       // Additional CSS class
  isOpen?: boolean;                         // Control visibility (default: true)
  onClose?: () => void;                     // Close callback
  customStyles?: string;                    // Path to custom CSS file or CSS string
  theme?: 'light' | 'dark' | 'auto';      // Theme selection (default: 'auto')
}
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate between results |
| `Enter` | Select highlighted item |
| `Tab` / `→` | Accept autocomplete suggestion |
| `Escape` | Close spotlight |
| `⌘K` / `Ctrl+K` | Open spotlight (implement in your app) |

## 🎨 Customization

### Themes

The component supports three theme modes:

```tsx
<Spotlight theme="light" />   // Force light theme
<Spotlight theme="dark" />    // Force dark theme  
<Spotlight theme="auto" />    // Follow system preference (default)
```

### Custom Styling

#### Method 1: CSS File
```tsx
<Spotlight customStyles="/path/to/custom-styles.css" />
```

#### Method 2: Inline CSS
```tsx
<Spotlight 
  customStyles={`
    .spotlight-container {
      border-radius: 20px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    }
    .spotlight-item.selected {
      background: rgba(255, 0, 0, 0.1);
    }
  `}
/>
```

#### Method 3: CSS Custom Properties
```css
:root {
  --spotlight-bg: rgba(255, 255, 255, 0.98);
  --spotlight-text: #000000;
  --spotlight-border: rgba(0, 0, 0, 0.1);
  --spotlight-accent: #007AFF;
}
```

### Smart Icons

The component automatically selects appropriate Material-UI icons based on item names and tags:

- **Dashboard** → Dashboard icon
- **Settings** → Settings icon
- **Analytics** → Analytics icon
- **Team/Users** → Group icon
- **Projects** → Assignment icon
- **Messages** → Message icon
- **Calendar** → Event icon
- **Files** → Folder icon
- **Default** → Article icon

## 🔧 Advanced Usage

### Custom Click Handlers

Provide different behaviors for different items:

```tsx
const items: SpotlightItem[] = [
  {
    id: 'external',
    name: 'Google',
    url: 'https://google.com',
    tags: ['search', 'external'],
    onClick: (item) => {
      window.open(item.url, '_blank'); // Open in new tab
    }
  },
  {
    id: 'api',
    name: 'Refresh Data',
    url: '/api/refresh',
    tags: ['action', 'reload'],
    onClick: async (item) => {
      const response = await fetch(item.url, { method: 'POST' });
      if (response.ok) {
        alert('Data refreshed successfully!');
      }
    }
  },
  {
    id: 'modal',
    name: 'Open Modal',
    url: '/modal',
    tags: ['dialog', 'popup'],
    onClick: (item) => {
      setModalOpen(true);
      setModalContent(item.name);
    }
  }
];
```

### Complex Search Data

```tsx
const complexItems: SpotlightItem[] = [
  {
    id: 'user-john',
    name: 'John Doe',
    url: '/users/john',
    tags: ['user', 'employee', 'developer', 'john.doe@company.com'],
    icon: '/avatars/john.jpg'
  },
  {
    id: 'project-alpha',
    name: 'Project Alpha',
    url: '/projects/alpha',
    tags: ['project', 'development', 'frontend', 'react', 'typescript'],
    onClick: (item) => {
      // Track project access
      analytics.track('project_accessed', { projectId: item.id });
      window.location.href = item.url;
    }
  }
];
```

### Integration with React Router

```tsx
import { useNavigate } from 'react-router-dom';

function AppWithRouter() {
  const navigate = useNavigate();

  const handleSelect = (item: SpotlightItem) => {
    navigate(item.url);
    setIsOpen(false);
  };

  return (
    <Spotlight
      items={items}
      onSelect={handleSelect}
      // ... other props
    />
  );
}
```

## 🎯 Examples

### E-commerce Store
```tsx
const storeItems = [
  { id: '1', name: 'iPhone 15 Pro', url: '/products/iphone-15-pro', tags: ['phone', 'apple', 'mobile'] },
  { id: '2', name: 'MacBook Air', url: '/products/macbook-air', tags: ['laptop', 'apple', 'computer'] },
  { id: '3', name: 'Orders', url: '/orders', tags: ['purchase', 'history', 'shopping'] },
  { id: '4', name: 'Account Settings', url: '/account', tags: ['profile', 'user', 'preferences'] }
];
```

### Documentation Site
```tsx
const docsItems = [
  { id: '1', name: 'Getting Started', url: '/docs/getting-started', tags: ['intro', 'setup', 'installation'] },
  { id: '2', name: 'API Reference', url: '/docs/api', tags: ['reference', 'methods', 'functions'] },
  { id: '3', name: 'Examples', url: '/docs/examples', tags: ['samples', 'code', 'snippets'] },
  { id: '4', name: 'FAQ', url: '/docs/faq', tags: ['questions', 'help', 'support'] }
];
```

### Admin Dashboard
```tsx
const adminItems = [
  { id: '1', name: 'User Management', url: '/admin/users', tags: ['users', 'accounts', 'management'] },
  { id: '2', name: 'System Logs', url: '/admin/logs', tags: ['logs', 'debugging', 'monitoring'] },
  { id: '3', name: 'Analytics', url: '/admin/analytics', tags: ['stats', 'metrics', 'reports'] }
];
```

## 🛠️ Development

### Build from Source

```bash
git clone https://github.com/yourusername/spotlight-search.git
cd spotlight-search
npm install
npm run build
```

### Run Demo

```bash
npm run dev
# Open demo.html in your browser
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/spotlight-search.git`
3. Install dependencies: `npm install`
4. Make your changes
5. Test your changes: `npm run build`
6. Submit a pull request

## 📄 License

MIT © [Your Name](https://github.com/yourusername)

## 🙏 Acknowledgments

- Inspired by macOS Spotlight search
- Built with [Fuse.js](https://fusejs.io/) for fuzzy searching
- Uses [Material-UI](https://mui.com/) for icons and components
- TypeScript support for better developer experience

---

**Star ⭐ this repository if you find it helpful!**