// This script intercepts XMLHttpRequest calls to Google Maps APIs
// and extracts business data from the responses

(function() {
  'use strict';

  // Store original XMLHttpRequest methods
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  // Override XMLHttpRequest.open to track the URL
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._url = url;
    this._method = method;
    return originalOpen.call(this, method, url, ...rest);
  };

  // Override XMLHttpRequest.send to intercept responses
  XMLHttpRequest.prototype.send = function(body) {
    this._requestBody = body;

    // Add load event listener to capture response
    this.addEventListener('load', function() {
      const url = this._url || '';
      
      // Check if this is a Google Maps search API call
      // These endpoints contain business listing data
      if (url.includes('/search?') && url.includes('tbm=map')) {
        handleSearchResponse(this.responseText, url);
      }
      // Places details API
      else if (url.includes('batchexecute') && this.responseText) {
        handleBatchExecuteResponse(this.responseText, url);
      }
    });

    return originalSend.call(this, body);
  };

  // Handle search results (list of businesses)
  function handleSearchResponse(responseText, url) {
    try {
      // Send the raw response to content script for parsing
      window.dispatchEvent(new CustomEvent('gmaps_search_response', {
        detail: {
          response: responseText,
          url: url,
          timestamp: Date.now()
        }
      }));
    } catch (error) {
      console.error('Error handling search response:', error);
    }
  }

  // Handle batch execute responses (detailed place data)
  function handleBatchExecuteResponse(responseText, url) {
    try {
      // Parse the response - Google uses a special format
      // Remove the first line (security prefix) and parse JSON
      const lines = responseText.split('\n');
      let jsonData = null;
      
      for (let line of lines) {
        if (line.trim().startsWith('[') || line.trim().startsWith('{')) {
          try {
            jsonData = JSON.parse(line);
            break;
          } catch (e) {
            continue;
          }
        }
      }

      if (jsonData) {
        // Extract place details from the parsed data
        const placeDetails = extractPlaceDetailsFromJson(jsonData);
        
        if (placeDetails) {
          window.dispatchEvent(new CustomEvent('gmaps_details_response', {
            detail: {
              response: responseText,
              url: url,
              timestamp: Date.now(),
              placeDetails: placeDetails
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error handling batch response:', error);
    }
  }

  // Extract place details from the JSON response
  function extractPlaceDetailsFromJson(data) {
    try {
      // Google's responses are nested arrays - need to traverse them
      // This is a simplified parser - actual structure varies
      const details = {};
      
      // Recursively search for place data
      function traverse(obj) {
        if (Array.isArray(obj)) {
          obj.forEach(traverse);
        } else if (obj && typeof obj === 'object') {
          Object.values(obj).forEach(traverse);
        } else if (typeof obj === 'string') {
          // Look for phone numbers
          if (/^\+?\d[\d\s\-\(\)]{8,}$/.test(obj)) {
            details.phone = obj;
          }
          // Look for URLs
          if (obj.startsWith('http') && obj.includes('://')) {
            if (!details.website && !obj.includes('google.com')) {
              details.website = obj;
            }
          }
        }
      }
      
      traverse(data);
      
      return Object.keys(details).length > 0 ? details : null;
    } catch (error) {
      console.error('Error extracting place details:', error);
      return null;
    }
  }

  console.log('Google Maps API interceptor injected');
})();
