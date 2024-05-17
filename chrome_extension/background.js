// Track visited tab URLs
const visitedTabURLs = {};

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // Check if the tab loading is complete and has a valid URL
    if (changeInfo.status === 'complete' && tab && tab.url) {
        // Store the URL of the visited tab
        visitedTabURLs[tabId] = tab.url;
        trackVisitedSite(tab.url); 
    }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    // Get the URL of the removed tab
    const url = visitedTabURLs[tabId];
    if (url) {
        //console.log('Tab removed:', url);
        updateDuration(url);
        delete visitedTabURLs[tabId];
    }
});

// Function to update duration
function updateDuration(url) {
    fetch('http://localhost:3000/visited_sites/update_duration', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: url
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update duration');
        }
    })
    .catch(error => {
        console.error('Error updating duration:', error);
    });
}

// Function to track visited sites
function trackVisitedSite(url) {
    fetch('http://localhost:3000/blacklisted_sites', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        const blacklistedSites = data.map(site => site.url);
        if (blacklistedSites.includes(url)) {
            // Redirect to the blocked page
            chrome.tabs.update({ url: './blocked_page.html' });
        } else {
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
    })
    .catch(error => {
        console.error('Error fetching blacklisted sites:', error);
    });
}
