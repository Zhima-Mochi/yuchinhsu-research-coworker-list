# Yu-Chin Hsu Research Coworker List Extension

A Chrome extension that helps track and organize research collaborators from [Yu-Chin Hsu's research page](https://yuchinhsu.yolasite.com/research.php).

## Features

- Automatically extracts coauthor information from the research page
- Categorizes collaborators by paper status:
  - Published Papers
  - Working Papers (excluding published papers)
  - Work in Progress (excluding published papers)
- Provides an easy-to-use popup interface to view collaborator information
- Updates information in real-time when visiting the research page

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Zhima-Mochi/yuchinhsu-research-coworker-list.git
   ```

2. Open Chrome and navigate to `chrome://extensions/` or `edge://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the cloned repository folder

## Usage

1. Click the extension icon in your Chrome toolbar when visiting Yu-Chin Hsu's research page
2. View the organized list of collaborators categorized by paper status
3. The extension will automatically update its data when you visit the research page

## Project Structure

- `manifest.json` - Extension configuration and permissions
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality
- `content.js` - Content script for extracting information from the webpage
- `icon128.png` - Extension icon