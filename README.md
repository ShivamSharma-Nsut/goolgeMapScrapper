# Google Maps Scraper Extension

A simple, client-side Chrome extension to extract business data from Google Maps search results.

## Features

✅ **100% Client-Side** - No server calls, everything runs locally in your browser
✅ **Auto-Scraping** - Automatically scrolls and loads more results
✅ **Real-Time Display** - See results as they're being scraped
✅ **CSV Export** - Download all scraped data as a CSV file
✅ **Easy to Use** - Just click "Start Scraping" when on Google Maps

## What Data Can Be Scraped?

- Business Name
- Place ID
- Rating (stars)
- Number of Reviews
- Address
- Google Maps URL
- Timestamp

## Installation

1. **Download the Extension**
   - Download all files to a folder on your computer

2. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/` in Chrome
   - Or click Menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" ON in the top right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

## How to Use

1. **Go to Google Maps**
   - Open https://www.google.com/maps in Chrome
   - Search for any business type or location (e.g., "restaurants in New York")

2. **Open the Scraper Panel**
   - The scraper panel will automatically appear on the right side of the page
   - It shows "Ready to scrape"

3. **Start Scraping**
   - Click the "▶ Start Scraping" button
   - The extension will:
     - Auto-scroll through results
     - Extract business information
     - Show live count of scraped businesses

4. **Export Data**
   - Click "💾 Export CSV" when done
   - A CSV file will be downloaded with all the data

5. **Clear Data** (Optional)
   - Click "🗑️ Clear" to remove all scraped data and start fresh

## Settings

- **Auto-scroll to load more results** - Automatically scrolls the results list to load more businesses
- **Extract detailed info** - Attempts to get more detailed information (coming soon)

## Tips for Best Results

1. **Use Specific Searches** - Instead of "restaurants", try "italian restaurants in Manhattan"
2. **Let it Run** - Allow the auto-scroll to complete before stopping
3. **Check the Log** - The log panel shows what's happening in real-time
4. **Export Regularly** - Export data periodically for large scraping jobs

## Technical Details

### How It Works

1. **API Interception** - The extension intercepts Google Maps API calls that load business data
2. **DOM Parsing** - Extracts visible business information from the page
3. **Data Storage** - Stores data locally in memory (not in Chrome storage)
4. **CSV Generation** - Converts data to CSV format for download

### File Structure

```
gmaps-scraper-extension/
├── manifest.json          # Extension configuration
├── contentScript.js       # Main scraping logic
├── injected.js           # API interceptor
├── styles.css            # UI styling
├── icon16.png            # Extension icon (16x16)
├── icon48.png            # Extension icon (48x48)
├── icon128.png           # Extension icon (128x128)
└── README.md             # This file
```

## Limitations

- Only works on google.com/maps pages
- Scrapes visible results only (limited by what Google Maps loads)
- No authentication or usage limits (unlimited scraping)
- Data is lost when you close/reload the page (export before closing)

## Privacy & Data

- **No Data Collection** - Nothing is sent to any external servers
- **No Tracking** - No analytics or tracking code
- **Local Only** - All data stays in your browser until you export it
- **No Storage** - Data is not saved to Chrome storage (memory only)

## Troubleshooting

### Panel Not Showing
- Make sure you're on google.com/maps
- Refresh the page
- Check if the extension is enabled in chrome://extensions/

### No Data Being Scraped
- Make sure you've clicked "Start Scraping"
- Wait for results to load on the page
- Check the log for error messages
- Try searching for a different location/business type

### Auto-Scroll Not Working
- Make sure "Auto-scroll" checkbox is enabled
- Some pages may not support auto-scrolling
- Try manually scrolling and clicking "Start Scraping" again

## Future Enhancements

- [ ] Extract phone numbers
- [ ] Extract websites
- [ ] Extract business hours
- [ ] Extract photos
- [ ] Parse API responses for more detailed data
- [ ] Add filters (by rating, review count, etc.)
- [ ] Save/load scraping sessions
- [ ] Multiple export formats (JSON, Excel)

## Legal & Ethical Use

⚠️ **Important Notice:**

- This tool is for educational and research purposes only
- Always respect Google's Terms of Service
- Don't scrape data for commercial purposes without proper authorization
- Be mindful of rate limits and don't overload Google's servers
- Respect business privacy and data protection laws
- Use responsibly and ethically

## License

MIT License - Feel free to modify and use as needed

## Support

For issues or questions, please check the troubleshooting section first.

---

**Made with ❤️ for learning purposes**
