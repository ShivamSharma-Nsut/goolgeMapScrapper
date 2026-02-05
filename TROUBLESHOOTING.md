# 🔧 TROUBLESHOOTING GUIDE - Google Maps Scraper

## The extension is grayed out / not showing

### **SOLUTION 1: Check if it's enabled on Google Maps**

1. Go to `chrome://extensions/`
2. Find "Google Maps Scraper"
3. Click on "Details"
4. Scroll down to "Site access"
5. Make sure it says "On specific sites" or "On all sites"
6. If it says "On click", change it to "On specific sites"

### **SOLUTION 2: Verify Permissions**

1. Go to `chrome://extensions/`
2. Click "Details" on Google Maps Scraper
3. Scroll to "Permissions"
4. You should see:
   - Read and change your data on sites you visit
   - Access to Google domains

If you don't see these, the extension didn't install correctly.

### **SOLUTION 3: Reload the Extension**

1. Go to `chrome://extensions/`
2. Find "Google Maps Scraper"
3. Click the **circular reload icon** (↻) on the extension card
4. Go to Google Maps
5. Press `F5` or `Ctrl+R` to refresh the page

### **SOLUTION 4: Check the Console for Errors**

1. Go to Google Maps: `https://www.google.com/maps`
2. Press `F12` to open Developer Tools
3. Click on the "Console" tab
4. Look for messages starting with "Google Maps Scraper:"
5. Send me a screenshot if you see any errors

### **SOLUTION 5: Test Mode**

To verify the extension is actually running:

1. Go to `chrome://extensions/`
2. Click "Details" on Google Maps Scraper
3. Find the "Inspect views" section
4. If you see "service worker" or any links, click them
5. This opens the extension's console
6. Any errors will show here

### **SOLUTION 6: Remove and Reinstall**

1. Go to `chrome://extensions/`
2. Click "Remove" on Google Maps Scraper
3. Extract the ZIP file to a NEW folder (different location)
4. Click "Load unpacked" again
5. Select the NEW folder
6. Go to Google Maps and refresh

### **SOLUTION 7: Check URL Pattern**

The extension ONLY works on URLs that look like:
- ✅ `https://www.google.com/maps/search/...`
- ✅ `https://www.google.com/maps/@...`
- ✅ `https://www.google.co.in/maps/...`
- ❌ `https://maps.google.com/` (old URL format)

Make sure you're using the modern Google Maps URL.

### **SOLUTION 8: Try the Test Version**

I've included a test file. To use it:

1. Open the extension folder
2. Open `manifest.json` in a text editor
3. Find the line: `"js": ["contentScript.js"],`
4. Change it to: `"js": ["contentScript-test.js"],`
5. Save the file
6. Go to `chrome://extensions/`
7. Click the reload icon on the extension
8. Go to Google Maps
9. You should see a RED BOX that says "EXTENSION IS WORKING!"

If you see the red box, the extension CAN run on the page. If not, there's a permissions issue.

---

## Common Issues & Fixes

### Extension icon is grayed out
- This means it's not active on the current page
- Check that you're on `google.com/maps` (not `maps.google.com`)
- Check site permissions in extension details

### Nothing appears on Google Maps
- Open Console (F12) and check for errors
- Try the test version (see Solution 8)
- Make sure you're searching for something (e.g., "restaurants")

### "This extension may have been corrupted"
- Remove the extension
- Re-extract the ZIP file
- Load unpacked again

### Extension loads but panel doesn't show
- Check browser console for errors
- The panel appears on the RIGHT side of the screen
- Try making your browser window wider
- Check if any other extensions are interfering

---

## Still Not Working?

If none of these work, please:

1. Go to Google Maps
2. Press F12
3. Click "Console" tab
4. Take a screenshot
5. Also go to `chrome://extensions/`
6. Click Details on the extension
7. Take a screenshot of the permissions section
8. Send both screenshots

I'll help you debug further!
