# What About

A productivity browser extension that helps you stay focused by making you reflect on your priorities before accessing distracting websites.

## Overview

What About intercepts your visits to blocked websites and presents you with a full-screen overlay displaying your tasks and goals. Instead of blocking sites completely, it adds friction to the distraction by requiring you to:

1. See your actual priorities
2. Hover over a "Continue" button for several seconds to proceed
3. Or choose to close the site and get back to work

<details>
  <summary>Preview</summary>
   <img width="1252" height="686" alt="Screenshot 2025-10-27 at 1 47 15 AM" src="https://github.com/user-attachments/assets/48d4bc97-cebf-49c4-b9ee-64ee7adbe821" />
</details>

## Features

- **Smart Blocking**: Add any website to your blocklist (e.g., `instagram.com`, `twitter.com`, `reddit.com`)
- **Task Reminders**: Display custom tasks/goals when you visit blocked sites
- **Intentional Friction**: Configurable wait time before allowing access
- **Hover-to-Continue**: Must hold hover over the continue button - no passive waiting
- **Quick Exit**: Option to close the distracting site immediately
- **Auto-save Settings**: Changes sync automatically across your browser
- **Cross-browser Support**: Works on Chrome, Firefox, and Edge

### Future Features
- Show this every X minutes, to break the chain of scrolling
- Make use of the UI more better way, can have some more productive things there (quote?, yearmap?, goals?, maybe your ex's photo?)
- Ability to check the tasks in the UI (this is going more towards the todo list end of the spectrum)

## Installation

### From Source

1. Clone the repository:

```bash
git clone https://github.com/dev-shetty/whatabout.git
cd whatabout
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the extension:

```bash
pnpm build
```

4. Load in your browser:

**Chrome/Edge:**

- Navigate to `chrome://extensions/` (or `edge://extensions/`)
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist/chrome` (or `dist/edge`) directory

**Firefox:**

- Navigate to `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on"
- Select the `manifest.json` file from `dist/firefox` directory

## Usage

### Initial Setup

1. Click the extension icon in your browser toolbar
2. Add sites you want to block (e.g., `instagram.com`, `reddit.com`)
3. Add tasks/goals you want to focus on
4. Set your preferred wait time (default: 3 seconds)

### Blocking Experience

When you visit a blocked site:

1. A full-screen overlay appears showing your tasks
2. Two options are presented:
   - **Continue**: Hover over this button for the configured time to proceed to the site
   - **Close site**: Immediately close the tab and return to work

### Managing Settings

- **Add Tasks**: Enter tasks in the popup to remind yourself of priorities
- **Add Blocked Sites**: Enter domain names without protocols (e.g., `example.com`)
- **Adjust Wait Time**: Rhw time required to hover before continuing
- **Remove Items**: Click the × button next to any task or site to remove it

Changes save automatically. Reload pages to apply new settings to already-open tabs.

## Development

### Project Structure

```
whatabout/
├── src/
│   ├── content/          # Content script injected into blocked pages
│   │   ├── App.tsx       # Main overlay UI
│   │   ├── scripts.tsx   # Content script entry point
│   │   └── styles.css    # Styles (shadow DOM isolated)
│   ├── popup/            # Extension popup UI
│   │   ├── PopupApp.tsx  # Main popup component
│   │   └── ui/           # Reusable UI components
│   ├── constants/        # Default settings and constants
│   └── types/            # TypeScript type definitions
├── background.ts         # Service worker for tab management
├── manifest.json         # Extension manifest
└── popup.html            # Popup HTML entry point
```

## Tech Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Styling
- **Chrome Extension Manifest V3**: Extension API
- **Shadow DOM**: Style isolation for content scripts
- **extension.js**: Build tooling for cross-browser support

## How It Works

1. **Content Script**: Injected into all pages, checks if the current site is blocked
2. **Shadow DOM**: Overlay UI is isolated from host page styles to prevent conflicts
3. **Chrome Storage API**: Settings synced across browser sessions
4. **Message Passing**: Content script communicates with background script to close tabs

---

Built with the intention of helping people be more mindful about their internet usage and spend that time being productive.

Readme written by [Cursor AI](https://cursor.com). Logo by [Logofa.st](https://logofa.st/)
