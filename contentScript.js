// Content script that runs on Google Maps pages
// Manages UI, data collection, and export

(function () {
  'use strict';

  // State management
  let scrapedData = [];
  let isScaping = false;
  let autoScrollInterval = null;
  let scrapedPlaceIds = new Set();

  // Inject the API interceptor script
  function injectInterceptor() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.onload = function () {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  }

  // Create the scraper UI
  function createUI() {
    // Check if UI already exists
    if (document.getElementById('gmaps-scraper-panel')) {
      console.log('Mr. G-Map Scrapper: UI already exists');
      return;
    }

    console.log('Mr. G-Map Scrapper: Creating UI...');

    const panel = document.createElement('div');
    panel.id = 'gmaps-scraper-panel';
    panel.innerHTML = `
      <div class="scraper-header">
        <h3>🗺️ Mr. G-Map Scrapper</h3>
        <button id="scraper-minimize" class="btn-icon">−</button>
      </div>
      <div class="scraper-body">
        <div class="scraper-stats">
          <div class="stat-item">
            <span class="stat-label">Scraped:</span>
            <span class="stat-value" id="scraped-count">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Status:</span>
            <span class="stat-value" id="scraper-status">Ready</span>
          </div>
        </div>
        
        <div class="scraper-controls">
          <button id="start-scraping" class="btn btn-primary">▶ Start Scraping</button>
          <button id="stop-scraping" class="btn btn-secondary" style="display: none;">⏸ Stop</button>
          <button id="export-csv" class="btn btn-success" disabled>💾 Export CSV</button>
          <button id="clear-data" class="btn btn-danger" disabled>🗑️ Clear</button>
        </div>

        <div class="scraper-settings">
          <label>
            <input type="checkbox" id="auto-scroll" checked>
            Auto-scroll to load more results
          </label>
          <label>
            <input type="checkbox" id="extract-details" checked>
            Extract detailed info (slower but more data)
          </label>
        </div>

        <div class="scraper-log" id="scraper-log">
          <div class="log-item">[${new Date().toLocaleTimeString()}] 🌟 Mr. G-Map Scrapper loaded successfully!</div>
          <div class="log-item">[${new Date().toLocaleTimeString()}] Ready to scrape. Click "Start Scraping" to begin.</div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Attach event listeners
    attachEventListeners();
  }

  // Attach event listeners to UI elements
  function attachEventListeners() {
    // Start button
    document.getElementById('start-scraping').addEventListener('click', startScraping);

    // Stop button
    document.getElementById('stop-scraping').addEventListener('click', stopScraping);

    // Export button
    document.getElementById('export-csv').addEventListener('click', exportToCSV);

    // Clear button
    document.getElementById('clear-data').addEventListener('click', clearData);

    // Minimize button
    document.getElementById('scraper-minimize').addEventListener('click', togglePanel);

    // Listen for intercepted API responses
    window.addEventListener('gmaps_search_response', handleSearchData);
    window.addEventListener('gmaps_details_response', handleDetailsData);
  }

  // Toggle panel minimize/maximize
  function togglePanel() {
    const panel = document.getElementById('gmaps-scraper-panel');
    panel.classList.toggle('minimized');
    const btn = document.getElementById('scraper-minimize');
    btn.textContent = panel.classList.contains('minimized') ? '+' : '−';
  }

  // Start scraping
  function startScraping() {
    isScaping = true;
    addLog('🚀 Scraping started...');
    updateStatus('Scraping...');

    document.getElementById('start-scraping').style.display = 'none';
    document.getElementById('stop-scraping').style.display = 'inline-block';

    // Start auto-scrolling if enabled
    if (document.getElementById('auto-scroll').checked) {
      startAutoScroll();
    }

    // Trigger initial scrape of visible results
    scrapeVisibleResults();
  }

  // Stop scraping
  function stopScraping() {
    isScaping = false;
    addLog('⏸️ Scraping stopped');
    updateStatus('Stopped');

    document.getElementById('start-scraping').style.display = 'inline-block';
    document.getElementById('stop-scraping').style.display = 'none';

    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  // Start auto-scrolling to load more results
  function startAutoScroll() {
    addLog('📜 Auto-scroll enabled');

    let scrollCount = 0;
    let noNewResultsCount = 0;
    let lastResultCount = scrapedData.length;

    autoScrollInterval = setInterval(() => {
      if (!isScaping) {
        clearInterval(autoScrollInterval);
        return;
      }

      // Don't scroll if we're currently extracting details
      if (document.getElementById('extract-details').checked) {
        const status = document.getElementById('scraper-status').textContent;
        if (status.includes('Extracting')) {
          // Wait for detail extraction to finish
          return;
        }
      }

      // Find the results container and scroll it
      const resultsContainer = document.querySelector('[role="feed"]');
      if (resultsContainer) {
        const previousScrollTop = resultsContainer.scrollTop;
        resultsContainer.scrollTop = resultsContainer.scrollHeight;
        scrollCount++;

        // Check if we've reached the end (scroll position didn't change)
        if (previousScrollTop === resultsContainer.scrollTop) {
          addLog('📍 Reached end of results, checking for new items...');

          // Give Google a moment to load more results
          setTimeout(() => {
            scrapeVisibleResults();

            // Check if we got new results
            if (scrapedData.length === lastResultCount) {
              noNewResultsCount++;
              if (noNewResultsCount >= 3) {
                addLog('✅ No more results available');
                clearInterval(autoScrollInterval);
                stopScraping();
              }
            } else {
              noNewResultsCount = 0;
              lastResultCount = scrapedData.length;
            }
          }, 2000);
        } else {
          // Successfully scrolled, scan for new results after a delay
          setTimeout(() => {
            scrapeVisibleResults();
            lastResultCount = scrapedData.length;
          }, 1500);
        }
      }
    }, 3000); // Check every 3 seconds
  }

  // Scrape visible results from DOM
  function scrapeVisibleResults() {
    addLog('🔍 Scanning visible results...');

    // Find all result items in the feed
    const resultElements = document.querySelectorAll('[role="feed"] > div > div > a');

    let newCount = 0;
    const newPlaces = [];

    resultElements.forEach(element => {
      try {
        const placeData = extractPlaceFromElement(element);
        if (placeData && !scrapedPlaceIds.has(placeData.placeId)) {
          scrapedData.push(placeData);
          scrapedPlaceIds.add(placeData.placeId);
          newPlaces.push({ element, placeId: placeData.placeId });
          newCount++;
        }
      } catch (error) {
        console.error('Error extracting place:', error);
      }
    });

    if (newCount > 0) {
      addLog(`✅ Found ${newCount} new businesses`);
      updateCount();
      enableExportButtons();

      // If detailed extraction is enabled, process each new place
      if (document.getElementById('extract-details').checked) {
        addLog(`🔄 Starting detailed extraction for ${newPlaces.length} businesses...`);
        processDetailsQueue(newPlaces, 0);
      }
    }
  }

  // Process detail extraction queue one by one
  function processDetailsQueue(places, index) {
    if (!isScaping || index >= places.length) {
      if (index >= places.length) {
        addLog('✅ Detailed extraction complete!');
      }
      return;
    }

    const { element, placeId } = places[index];

    addLog(`📍 Processing ${index + 1}/${places.length}...`);

    // Click and extract details
    clickForDetails(element, placeId);

    // Wait before processing next item (5.5 seconds total per business)
    setTimeout(() => {
      processDetailsQueue(places, index + 1);
    }, 5500);
  }

  // Click on a business to extract detailed information
  function clickForDetails(element, placeId) {
    try {
      // Click the business link
      element.click();
      addLog(`🔍 Opening details...`);

      // Wait longer for the detail panel to fully load (increased to 4 seconds)
      setTimeout(() => {
        extractDetailedInfo(placeId);

        // After extracting, go back to the list
        setTimeout(() => {
          const backButton = document.querySelector('button[aria-label*="Back"], button[aria-label*="back"]');
          if (backButton) {
            backButton.click();
          } else {
            // Alternative: press ESC key
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27 }));
          }
        }, 1000);
      }, 4000); // Increased from 3 to 4 seconds
    } catch (error) {
      console.error('Error clicking for details:', error);
    }
  }

  // Extract detailed information from the details panel
  function extractDetailedInfo(placeId) {
    try {
      const place = scrapedData.find(p => p.placeId === placeId);
      if (!place) {
        console.log('Place not found:', placeId);
        return;
      }

      console.log('Extracting details for:', place.name);

      // Wait a bit more for dynamic content
      setTimeout(() => {
        performExtraction(place);
      }, 500);
    } catch (error) {
      console.error('Error extracting detailed info:', error);
    }
  }

  function performExtraction(place) {
    try {
      // Get all text content from the page for fallback extraction
      const bodyText = document.body.textContent;

      // === PHONE NUMBER EXTRACTION ===
      let phone = '';

      // Method 1: Look for phone button with specific aria-label pattern
      const phoneButtons = document.querySelectorAll('button[aria-label*="Phone"], button[data-tooltip*="Phone"]');
      for (const btn of phoneButtons) {
        const ariaLabel = btn.getAttribute('aria-label') || '';
        const tooltip = btn.getAttribute('data-tooltip') || '';
        const combined = ariaLabel + ' ' + tooltip;

        // Look for phone pattern in aria-label
        const phoneMatch = combined.match(/[\+\(]?[\d\s\-\(\)]{10,}/);
        if (phoneMatch) {
          const cleaned = phoneMatch[0].replace(/\D/g, '');
          if (cleaned.length >= 10) {
            phone = phoneMatch[0].trim();
            break;
          }
        }
      }

      // Method 2: Look for any clickable element with phone number
      if (!phone) {
        const allClickable = document.querySelectorAll('button, a, div[role="button"]');
        for (const el of allClickable) {
          const text = el.textContent || '';
          const aria = el.getAttribute('aria-label') || '';
          const combined = text + ' ' + aria;

          // Match US phone patterns: +1 XXX-XXX-XXXX, (XXX) XXX-XXXX, XXX-XXX-XXXX
          const phoneMatch = combined.match(/(?:\+1\s?)?\(?([0-9]{3})\)?[\s\-]?([0-9]{3})[\s\-]?([0-9]{4})/);
          if (phoneMatch) {
            phone = phoneMatch[0].trim();
            break;
          }
        }
      }

      // Method 3: Search entire page text for phone pattern
      if (!phone) {
        const phonePatterns = [
          /\+1\s?\d{3}[\s\-]?\d{3}[\s\-]?\d{4}/,
          /\(\d{3}\)\s?\d{3}[\s\-]?\d{4}/,
          /\d{3}[\s\-]\d{3}[\s\-]\d{4}/
        ];

        for (const pattern of phonePatterns) {
          const match = bodyText.match(pattern);
          if (match) {
            phone = match[0].trim();
            break;
          }
        }
      }

      if (phone) {
        place.phone = phone;
        place.phones = phone;
        console.log('✓ Found phone:', phone);
      } else {
        console.log('✗ No phone found');
      }

      // === WEBSITE EXTRACTION ===
      let website = '';

      // Method 1: Look for website link - avoid Google's internal links
      const websiteLinks = document.querySelectorAll('a[href^="http"]');
      for (const link of websiteLinks) {
        const href = link.getAttribute('href') || '';

        // Skip Google internal links and booking links
        if (href &&
          !href.includes('google.com') &&
          !href.includes('goo.gl') &&
          !href.includes('flexbook.me') &&
          !href.includes('booking') &&
          !href.includes('rwg_token')) {

          // Check if this looks like a real business website
          const linkText = link.textContent.toLowerCase();
          const hasWebsiteIndicator = linkText.includes('website') ||
            linkText.includes('site') ||
            link.getAttribute('aria-label')?.toLowerCase().includes('website');

          // If it has website indicator OR it's a domain link
          if (hasWebsiteIndicator || /^https?:\/\/[a-z0-9\-]+\.[a-z]{2,}/i.test(href)) {
            website = href;
            break;
          }
        }
      }

      // Method 2: Look specifically for "Website" button
      if (!website) {
        const websiteButtons = document.querySelectorAll('button[aria-label*="Website"], a[aria-label*="Website"]');
        for (const btn of websiteButtons) {
          const link = btn.querySelector('a') || btn;
          const href = link.getAttribute('href') || '';
          if (href && !href.includes('google.com') && !href.includes('flexbook')) {
            website = href;
            break;
          }
        }
      }

      // Method 3: Look for data-item-id="authority"
      if (!website) {
        const authorityLink = document.querySelector('a[data-item-id="authority"]');
        if (authorityLink) {
          const href = authorityLink.getAttribute('href') || '';
          if (href && !href.includes('google.com') && !href.includes('flexbook')) {
            website = href;
          }
        }
      }

      // Method 4: Search for URL patterns in text (last resort)
      if (!website) {
        const urlMatch = bodyText.match(/https?:\/\/(?!.*google\.com)(?!.*flexbook)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/);
        if (urlMatch) {
          website = urlMatch[0];
        }
      }

      if (website) {
        // Clean up the URL
        website = website.split('?')[0]; // Remove query params
        place.website = website;
        try {
          const url = new URL(website);
          place.domain = url.hostname.replace('www.', '');
        } catch (e) {
          place.domain = website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
        }
        console.log('✓ Found website:', website);
      } else {
        console.log('✗ No website found');
      }

      // === ADDRESS EXTRACTION ===
      const addressButtons = document.querySelectorAll('button[data-item-id="address"], button[aria-label*="Address"]');
      for (const btn of addressButtons) {
        const aria = btn.getAttribute('aria-label') || '';
        if (aria) {
          place.fullAddress = aria.replace(/^Address:\s*/i, '').trim();

          // Parse address components
          const parts = place.fullAddress.split(',');
          if (parts.length >= 2) {
            place.street = parts[0].trim();
            place.municipality = parts.slice(1).join(',').trim();
          }
          break;
        }
      }

      // === CATEGORY EXTRACTION ===
      const categoryButtons = document.querySelectorAll('button[jsaction*="category"]');
      if (categoryButtons.length > 0) {
        place.categories = Array.from(categoryButtons)
          .map(b => b.textContent.trim())
          .filter(t => t)
          .join(', ');
      }

      // === RATING & REVIEWS ===
      const ratingSpans = document.querySelectorAll('span[role="img"][aria-label*="star"]');
      for (const span of ratingSpans) {
        const aria = span.getAttribute('aria-label') || '';
        const ratingMatch = aria.match(/([\d\.]+)\s*star/i);
        const reviewMatch = aria.match(/(\d+)\s*review/i);

        if (ratingMatch) place.averageRating = ratingMatch[1];
        if (reviewMatch) place.reviewCount = reviewMatch[1];
      }

      // === HOURS ===
      const hoursButtons = document.querySelectorAll('button[aria-label*="Hours"], button[data-item-id*="oh"]');
      for (const btn of hoursButtons) {
        const aria = btn.getAttribute('aria-label') || '';
        if (aria && aria.length > 10) {
          place.openingHours = aria;
          break;
        }
      }

      // === COORDINATES ===
      const urlMatch = window.location.href.match(/@([-\d\.]+),([-\d\.]+)/);
      if (urlMatch) {
        place.latitude = urlMatch[1];
        place.longitude = urlMatch[2];
      }

      // === IMAGES ===
      const mainImages = document.querySelectorAll('img[src*="googleusercontent"]');
      if (mainImages.length > 0) {
        place.featuredImage = mainImages[0].src;
      }

      // === CID ===
      const cidMatch = window.location.href.match(/!1s0x[0-9a-f]+:0x([0-9a-f]+)/i);
      if (cidMatch) {
        place.cid = parseInt(cidMatch[1], 16).toString();
      }

      // Generate review URL
      if (place.placeId) {
        place.reviewUrl = `https://search.google.com/local/reviews?placeid=${place.placeId}`;
      }

      const summary = [];
      if (phone) summary.push('✓ phone');
      if (website) summary.push('✓ website');
      if (place.fullAddress) summary.push('✓ address');

      addLog(`✅ ${place.name}${summary.length > 0 ? ' (' + summary.join(', ') + ')' : ''}`);
      updateCount();

    } catch (error) {
      console.error('Error in performExtraction:', error);
    }
  }

  // Extract place data from a result element
  function extractPlaceFromElement(element) {
    try {
      // Get the aria-label which contains basic info
      const ariaLabel = element.getAttribute('aria-label');
      if (!ariaLabel) return null;

      // Extract place ID from href
      const href = element.getAttribute('href') || '';
      const placeIdMatch = href.match(/!1s([^!]+)/);
      const placeId = placeIdMatch ? placeIdMatch[1] : '';

      // Try to get more details from nested elements
      const nameElement = element.querySelector('[class*="fontHeadlineSmall"]');
      const ratingElement = element.querySelector('[role="img"][aria-label*="stars"]');
      const addressElement = element.querySelector('[class*="fontBodyMedium"] > div:nth-child(2)');

      const name = nameElement ? nameElement.textContent.trim() : '';
      const rating = ratingElement ? ratingElement.getAttribute('aria-label') : '';
      const address = addressElement ? addressElement.textContent.trim() : '';

      // Parse rating
      let stars = '';
      let reviewCount = '';
      if (rating) {
        const ratingMatch = rating.match(/([\d.]+)\s*stars/);
        const reviewMatch = rating.match(/([\d,]+)\s*reviews/);
        stars = ratingMatch ? ratingMatch[1] : '';
        reviewCount = reviewMatch ? reviewMatch[1].replace(/,/g, '') : '';
      }

      // Extract category if visible in list
      const categoryElement = element.querySelector('[class*="fontBodyMedium"] > div:first-child');
      const categories = categoryElement ? categoryElement.textContent.trim() : '';

      return {
        name: name || ariaLabel.split('.')[0],
        description: '',
        fullAddress: address,
        street: '',
        municipality: '',
        categories: categories,
        timeZone: 'America/Chicago',
        amenities: '',
        phone: '',
        phones: '',
        claimed: '',
        reviewCount: reviewCount,
        averageRating: stars,
        reviewUrl: '',
        googleMapsUrl: `https://www.google.com/maps${href}`,
        latitude: '',
        longitude: '',
        website: '',
        domain: '',
        openingHours: '',
        featuredImage: '',
        cid: '',
        fid: '',
        placeId: placeId,
        scrapedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in extractPlaceFromElement:', error);
      return null;
    }
  }

  // Handle search response data
  function handleSearchData(event) {
    if (!isScaping) return;

    addLog('📥 Received search API response');

    // The response might contain additional data
    // For now, we'll rely on DOM scraping
    // In future, can parse the API response for more details

    setTimeout(() => scrapeVisibleResults(), 500);
  }

  // Handle details response data
  function handleDetailsData(event) {
    if (!isScaping) return;

    addLog('📥 Received details API response');

    // Check if we have parsed place details
    if (event.detail && event.detail.placeDetails) {
      const apiDetails = event.detail.placeDetails;

      // Try to match this with a recently added place
      // Use the most recent place without full details
      const recentPlace = scrapedData
        .slice()
        .reverse()
        .find(p => !p.phone || !p.website);

      if (recentPlace) {
        // Enrich the place data with API details
        if (apiDetails.phone && !recentPlace.phone) {
          recentPlace.phone = apiDetails.phone;
          recentPlace.phones = apiDetails.phone;
        }
        if (apiDetails.website && !recentPlace.website) {
          recentPlace.website = apiDetails.website;
          try {
            const domain = new URL(apiDetails.website).hostname.replace('www.', '');
            recentPlace.domain = domain;
          } catch (e) { }
        }

        addLog(`✨ Enhanced data with API details for: ${recentPlace.name}`);
      }
    }
  }

  // Export data to CSV
  function exportToCSV() {
    if (scrapedData.length === 0) {
      addLog('⚠️ No data to export');
      return;
    }

    addLog('💾 Preparing CSV export...');

    // Define CSV headers matching the sample format
    const headers = [
      'Name',
      'Description',
      'Fulladdress',
      'Street',
      'Municipality',
      'Categories',
      'Time Zone',
      'Amenities',
      'Phone',
      'Phones',
      'Claimed',
      'Review Count',
      'Average Rating',
      'Review URL',
      'Google Maps URL',
      'Latitude',
      'Longitude',
      'Website',
      'Domain',
      'Opening Hours',
      'Featured Image',
      'Cid',
      'Fid',
      'Place Id'
    ];

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    scrapedData.forEach(place => {
      const row = [
        escapeCsvValue(place.name),
        escapeCsvValue(place.description),
        escapeCsvValue(place.fullAddress),
        escapeCsvValue(place.street),
        escapeCsvValue(place.municipality),
        escapeCsvValue(place.categories),
        place.timeZone || 'America/Chicago',
        escapeCsvValue(place.amenities),
        place.phone || '',
        place.phones || place.phone || '',
        place.claimed || '',
        place.reviewCount || '',
        place.averageRating || '',
        place.reviewUrl || '',
        place.googleMapsUrl || '',
        place.latitude || '',
        place.longitude || '',
        place.website || '',
        place.domain || '',
        escapeCsvValue(place.openingHours),
        place.featuredImage || '',
        place.cid || '',
        place.fid || '',
        place.placeId || ''
      ];
      csvContent += row.join(',') + '\n';
    });

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `google-maps-data-${Date.now()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addLog(`✅ Exported ${scrapedData.length} businesses to CSV`);
  }

  // Escape CSV values
  function escapeCsvValue(value) {
    if (!value) return '';

    value = String(value);

    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      value = '"' + value.replace(/"/g, '""') + '"';
    }

    return value;
  }

  // Clear all data
  function clearData() {
    if (confirm('Are you sure you want to clear all scraped data?')) {
      scrapedData = [];
      scrapedPlaceIds.clear();
      updateCount();
      addLog('🗑️ All data cleared');
      disableExportButtons();
    }
  }

  // Update scraped count
  function updateCount() {
    document.getElementById('scraped-count').textContent = scrapedData.length;
  }

  // Update status
  function updateStatus(status) {
    document.getElementById('scraper-status').textContent = status;
  }

  // Add log message
  function addLog(message) {
    const logContainer = document.getElementById('scraper-log');
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    logItem.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

    logContainer.appendChild(logItem);
    logContainer.scrollTop = logContainer.scrollHeight;

    // Keep only last 50 logs
    while (logContainer.children.length > 50) {
      logContainer.removeChild(logContainer.firstChild);
    }
  }

  // Enable export buttons
  function enableExportButtons() {
    document.getElementById('export-csv').disabled = false;
    document.getElementById('clear-data').disabled = false;
  }

  // Disable export buttons
  function disableExportButtons() {
    document.getElementById('export-csv').disabled = true;
    document.getElementById('clear-data').disabled = true;
  }

  // Initialize
  function init() {
    console.log('Mr. G-Map Scrapper: Initializing...');
    console.log('Current URL:', window.location.href);
    console.log('Document ready state:', document.readyState);

    // Check if we're on a Google Maps page
    if (!window.location.href.includes('/maps')) {
      console.log('Mr. G-Map Scrapper: Not on a maps page, skipping...');
      return;
    }

    console.log('Mr. G-Map Scrapper: On maps page, proceeding with init...');

    // Inject API interceptor
    injectInterceptor();
    console.log('Mr. G-Map Scrapper: Interceptor injected');

    // Create UI with multiple retry attempts
    let attempts = 0;
    const maxAttempts = 10;

    const tryCreateUI = () => {
      attempts++;
      console.log(`Mr. G-Map Scrapper: UI creation attempt ${attempts}/${maxAttempts}`);

      try {
        createUI();
        console.log('Mr. G-Map Scrapper: UI created successfully!');
      } catch (error) {
        console.error('Mr. G-Map Scrapper: Error creating UI:', error);

        if (attempts < maxAttempts) {
          setTimeout(tryCreateUI, 1000);
        } else {
          console.error('Mr. G-Map Scrapper: Failed to create UI after max attempts');
        }
      }
    };

    // Start UI creation after a delay
    setTimeout(tryCreateUI, 2000);
  }

  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also listen for URL changes (for single-page app navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      console.log('Mr. G-Map Scrapper: URL changed to', url);
      if (url.includes('/maps') && !document.getElementById('gmaps-scraper-panel')) {
        setTimeout(init, 2000);
      }
    }
  }).observe(document, { subtree: true, childList: true });
})();
