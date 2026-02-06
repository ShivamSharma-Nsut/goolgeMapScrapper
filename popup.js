document.getElementById('open-maps').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.google.com/maps' });
});
