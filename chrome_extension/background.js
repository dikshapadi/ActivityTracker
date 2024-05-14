// Track visited sites when their page loading is complete
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        // Check if the URL is valid
        if (tab && tab.url) {
            // Track the visited site
            trackVisitedSite(tabId, tab.url);
        }
    }
});

// Function to track visited sites
function trackVisitedSite(tabId, url) {
    // Make a POST request to your backend endpoint to track the visited site
    fetch('http://localhost:3000/visited_sites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visited_site: { url: url } }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to track visited site');
        }
    })
    .catch(error => {
        console.error('Error tracking visited site:', error);
    });
}
