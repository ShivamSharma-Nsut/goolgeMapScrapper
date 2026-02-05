# 📞 PHONE & WEBSITE EXTRACTION GUIDE

## Version 1.2.0 - Fixed Phone & Website Extraction

### What's Fixed:
- ✅ **Phone numbers** now extract properly with multiple fallback methods
- ✅ **Websites** now extract from detail pages
- ✅ **Better timing** - waits 3 seconds for detail pages to load
- ✅ **Sequential extraction** - processes one business at a time
- ✅ **Auto back navigation** - returns to list after extraction

---

## 🚀 QUICK START - Get Phone & Website Data

### Step 1: Installation
1. Remove old extension (if installed)
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the extracted folder

### Step 2: Important Settings
Before scraping, **CHECK THESE BOXES:**

```
✅ Auto-scroll to load more results
✅ Extract detailed info (slower but more data)  ← CRITICAL!
```

**Without "Extract detailed info" enabled, you will NOT get phone numbers and websites!**

### Step 3: Start Scraping
1. Go to Google Maps: `google.com/maps`
2. Search for businesses (e.g., "dentists in austin")
3. Click **"▶ Start Scraping"**
4. **Wait patiently!** Watch the log panel

### Step 4: What to Expect

**You'll see in the log:**
```
🔍 Scanning visible results...
✅ Found 10 new businesses
🔄 Starting detailed extraction for 10 businesses...
📍 Extracting 1/10...
🔍 Clicking on business for details...
✅ Extracted details: ATX Family Dental (✓ phone) (✓ website)
📍 Extracting 2/10...
```

**Important markers:**
- `(✓ phone)` = Phone number found
- `(✓ website)` = Website found
- If you see these, the data is being captured!

---

## ⏱️ How Long Does It Take?

The extension processes **ONE business at a time** to get accurate data:

| Businesses | Time (with details) |
|-----------|-------------------|
| 10 | ~1 minute |
| 50 | ~5 minutes |
| 100 | ~10 minutes |
| 200 | ~20 minutes |

**Each business takes ~4 seconds:**
- Click (instant)
- Wait for page load (3 sec)
- Extract data (instant)
- Go back (1 sec)

---

## 🎯 How It Works

### The Extraction Process:

```
1. Scraper scrolls → finds 10 businesses
2. Adds them to list with basic info (name, rating, address)
3. Clicks on Business #1
4. Waits 3 seconds for detail page to load
5. Extracts phone, website, hours, etc.
6. Clicks "Back" button
7. Moves to Business #2
8. Repeat until all done
```

### Multiple Extraction Methods:

The scraper tries **3 different methods** to find phone numbers:

**Method 1:** Look for phone button with `data-item-id="phone"`
**Method 2:** Search all buttons for phone patterns
**Method 3:** Search all text for phone patterns like `+1 512-717-3147`

Same for websites - tries 3 methods to ensure it finds the data.

---

## 🐛 Troubleshooting

### "Phone and Website columns are still empty!"

**✅ Solution 1:** Make sure "Extract detailed info" is checked
```
Before clicking Start, verify:
☑️ Extract detailed info (slower but more data)
```

**✅ Solution 2:** Watch the log panel
The log should show:
```
✅ Extracted details: Business Name (✓ phone) (✓ website)
```

If you see this, the data IS being captured. Export and check CSV.

If you DON'T see `(✓ phone)` or `(✓ website)`:
- The business might not have that info on Google Maps
- Check manually by clicking the business yourself

**✅ Solution 3:** Don't stop too early
Let it finish! Each business needs 3-4 seconds.

For 50 businesses, wait the full ~5 minutes.

**✅ Solution 4:** Check the console
1. Press F12 to open DevTools
2. Click "Console" tab
3. Look for these messages:
```
Found phone: +1 512-717-3147
Found website: https://example.com
```

If you see these, data is being extracted.

**✅ Solution 5:** Test with one business
1. Search for a specific business you KNOW has a phone/website
2. Click Start
3. Watch it extract just that one
4. Check if phone/website appear in the log
5. If yes, the extension works! Just wait longer for full extractions

### "It's stuck on one business!"

**This is normal!** The scraper waits 3 seconds per business.

Watch the counter: `📍 Extracting 5/50...`

If it's truly stuck (same number for >30 seconds):
- Click Stop
- Click Start again
- It will resume from where it left off

### "Some businesses have phone, some don't"

**This is expected!**
- Not all businesses have phone numbers on Google Maps
- Some businesses only have websites, not phones
- Some have neither

Check the Google Maps page manually - if it's not there, the scraper can't find it.

### "The scraper clicked but didn't extract"

Possible causes:
1. **Page loaded too slowly** - Increase wait time in code
2. **Google changed the HTML** - Selectors need updating
3. **Popup or overlay appeared** - Close it manually

**Quick fix:**
Stop and restart the scraper. It will skip businesses it already has.

---

## 📊 Expected Results

For a typical search like "dentists in austin" with 50 results:

- **Phone numbers:** 40-45 businesses (80-90%)
- **Websites:** 45-48 businesses (90-95%)
- **Both phone & website:** 35-40 businesses (70-80%)

Not all businesses provide this info to Google, so 100% is impossible.

---

## 💡 Pro Tips

1. **Start small** - Test with 10-20 businesses first
2. **Check the log** - Make sure you see "(✓ phone) (✓ website)"
3. **Export often** - Don't lose data if something crashes
4. **Use specific searches** - "dentists in downtown austin" vs "dentists"
5. **Be patient** - Detail extraction is slow but accurate
6. **Don't close the tab** - Keep Google Maps tab open during scraping

---

## 📝 Sample Output

Your CSV will look like this:

```csv
Name,Phone,Website,Review Count,Rating
ATX Family Dental,+1 512-717-3147,https://www.atxfamilydental.com/,772,4.9
Austin Dental Works,+1 512-877-9822,https://www.austindentalworks.com/,591,4.9
```

---

## Still Having Issues?

1. Open Developer Console (F12)
2. Click "Console" tab
3. Take a screenshot of any errors
4. Send it to me with:
   - What search term you used
   - How many results appeared
   - What the log panel shows

I'll help you debug!

---

**Remember:** The key is to enable "Extract detailed info" and be patient!
