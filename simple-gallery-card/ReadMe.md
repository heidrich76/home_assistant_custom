# Simple Gallery Card Development

A brief explanation how the simple gallery card is developed based on **"Vite** as development server.


## Installation

**Install dependencies:**
   ```bash
   npm install
   ```


## Development

**Start the development server:**
   ```bash
   npm run dev
   ```

**Add the resource to Home Assistant** in `configuration.yaml` or via HA-Web-UI:
   ```yaml
   lovelace:
     resources:
       - url: "http://localhost:5173/src/simple-gallery-card-dev.js"
         type: module
   ```

**Add custom card to dashboard:**
   ```yaml
    type: custom:simple-gallery-card-dev
    media_content_id: media-source://media_source/local/reolink/
    title: My Gallery
   ```

**Live reloading**: Any changes saved will be immediately reflected in the Home Assistant UI.
However, browser page needs to be reloaded.
Add `debug=1` to URL for displaying debug messages, e.g., `http://192.168.178.74:8123/dashboard-development/gallery?debug=1`


## Deployment

**Build** to compile all source code into a JS file:
   ```bash
   npm run deploy
   ```

**Deploy** file to your Home Assistant (development) server for final testing:
   ```bash
   npm run deploy
   ```
   Note that this only works under Windows and that the target directory must be adapted in`package.json`.

**Register the production resource** in `configuration.yaml`:
   ```yaml
   lovelace:
     resources:
       - url: "/local/simple-gallery-card.js?v=1"
         type: module
   ```
