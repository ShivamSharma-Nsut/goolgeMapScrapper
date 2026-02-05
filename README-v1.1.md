# Google Maps Scraper Extension v1.1.0

## 🆕 What's New in v1.1.0

- **Complete Data Extraction** - Now extracts ALL fields from Google Maps including phone, website, hours, etc.
- **Enhanced Detail Mode** - Automatically clicks on listings to extract detailed information
- **Full CSV Compatibility** - Exports in the exact same format as G Maps Extractor with 24 columns

## Extracted Data Fields

### ✅ Complete List of 24 Fields:

1. **Name** - Business name
2. **Description** - Business description (if available)
3. **Fulladdress** - Complete address
4. **Street** - Street address
5. **Municipality** - City and state
6. **Categories** - Business categories/types
7. **Time Zone** - Time zone (default: America/Chicago)
8. **Amenities** - Available amenities
9. **Phone** - Phone number
10. **Phones** - Formatted phone numbers
11. **Claimed** - Business verification status (YES/NO)
12. **Review Count** - Number of reviews
13. **Average Rating** - Star rating (out of 5)
14. **Review URL** - Link to reviews
15. **Google Maps URL** - Direct link to the business on Google Maps
16. **Latitude** - GPS latitude coordinate
17. **Longitude** - GPS longitude coordinate
18. **Website** - Business website URL
19. **Domain** - Website domain name
20. **Opening Hours** - Business hours
21. **Featured Image** - Main business photo URL
22. **Cid** - Google's internal CID
23. **Fid** - Feature ID
24. **Place Id** - Unique Google Place ID

## How to Use

### Installation
1. Download and extract the ZIP file
2. Go to `chrome://extensions/` in Chrome
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the extracted folder

### Usage
1. Go to **Google Maps** (google.com/maps)
2. Search for businesses (e.g., "dentists in austin")
3. The scraper panel appears automatically on the right
4. **Important Settings:**
   - ✅ Enable "Auto-scroll to load more results"
   - ✅ Enable "Extract detailed info" for complete data
5. Click **"▶ Start Scraping"**
6. Wait for it to complete (it will auto-scroll and click on each business)
7. Click **"💾 Export CSV"**

### Tips for Best Results

**🎯 Enable "Extract detailed info"** - This is crucial! When enabled:
- The scraper will automatically click on each business
- It extracts phone numbers, websites, hours, etc.
- Takes longer but gives you complete data
- Without this, you'll only get basic info

**📜 Let auto-scroll finish** - Don't stop too early:
- The scraper needs to scroll through all results
- It also needs time to click each business and extract details
- For 100 businesses with details, expect 5-10 minutes

**🔍 Use specific searches**:
- ✅ "italian restaurants in Manhattan"
- ❌ "restaurants" (too broad)

**⚠️ Be patient** - Detailed extraction is slower:
- Basic scraping: ~1 second per business
- With details: ~2-3 seconds per business
- This ensures complete, accurate data

## Data Extraction Modes

### Mode 1: Quick Scrape (Details OFF)
- Only extracts visible data from the list
- Very fast
- Limited fields: Name, Rating, Address, Place ID
- Best for: Quick lists, lead generation

### Mode 2: Complete Scrape (Details ON) ⭐ RECOMMENDED
- Clicks on each business to extract full details
- Slower but comprehensive
- All 24 fields populated
- Best for: Complete business intelligence, sales leads

## CSV Export Format

The exported CSV matches the exact format of commercial scrapers like G Maps Extractor:

```csv
"Name","Description","Fulladdress","Street","Municipality","Categories","Time Zone"...
"ATX Family Dental",,"1700 S 1st St, Austin, TX 78704, United States","1700 S 1st St",...
```

## Troubleshooting

### Phone numbers are empty
- ✅ Make sure "Extract detailed info" is checked
- ✅ Let the scraper run completely (don't stop early)
- ✅ The scraper needs to click each business (watch it work)

### Website URLs are missing
- ✅ Enable "Extract detailed info"
- ✅ Some businesses don't have websites registered on Google
- ✅ Check the Google Maps page manually - if it's not there, the scraper can't find it

### Only getting partial data
- ✅ Don't stop the scraper too soon
- ✅ Each business needs time to be clicked and parsed
- ✅ Watch the log panel - it shows "Extracted details for: [name]"

### CSV has wrong format
- ✅ This version exports the exact same format as commercial tools
- ✅ 24 columns in the correct order
- ✅ Compatible with Excel, Google Sheets, etc.

## Performance

- **100 businesses (basic)**: ~2 minutes
- **100 businesses (detailed)**: ~8-12 minutes
- **500 businesses (detailed)**: ~40-60 minutes

The extension automatically paces requests to avoid overwhelming Google's servers.

## Known Limitations

1. **Detection Risk** - Google may detect automated scraping if you:
   - Scrape thousands of businesses in one session
   - Run multiple sessions back-to-back
   - Recommendation: Take breaks, vary your searches

2. **Missing Data** - Some fields may be empty because:
   - The business didn't provide that information
   - Google doesn't have that data
   - The business page structure is different

3. **Rate Limiting** - If scraping stops unexpectedly:
   - Google may be rate limiting
   - Wait 10-15 minutes and try again
   - Reduce the number of results per search

## Best Practices

1. **Start Small** - Test with 20-30 results first
2. **Use Details Mode** - For complete, usable data
3. **Export Frequently** - Don't lose data if something crashes
4. **Specific Searches** - Better results with targeted queries
5. **Check the Log** - Monitor progress in real-time

## Privacy & Ethics

- ✅ 100% client-side - no data sent to external servers
- ✅ No tracking or analytics
- ✅ Your data stays on your computer
- ⚠️ Use responsibly - respect Google's ToS
- ⚠️ Don't use for spam or harassment
- ⚠️ Use scraped data ethically and legally

## Support

See TROUBLESHOOTING.md for detailed help with common issues.

---

**Version 1.1.0** - Full feature parity with commercial scrapers, completely free and open source.
