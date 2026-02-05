// Simple test version - if you see an alert, the extension is working!

console.log('=== GOOGLE MAPS SCRAPER: Script loaded ===');
console.log('URL:', window.location.href);

// Show a visible test message
setTimeout(() => {
  if (window.location.href.includes('/maps')) {
    const testDiv = document.createElement('div');
    testDiv.innerHTML = `
      <div style="position: fixed; top: 100px; right: 20px; 
                  background: red; color: white; padding: 20px; 
                  z-index: 999999; font-size: 20px; font-weight: bold;
                  border: 3px solid white; border-radius: 10px;">
        ✅ EXTENSION IS WORKING!<br>
        If you see this, the extension loaded correctly.
      </div>
    `;
    document.body.appendChild(testDiv);
    console.log('=== Test div added to page ===');
  }
}, 2000);
