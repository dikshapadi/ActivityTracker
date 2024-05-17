document.addEventListener('DOMContentLoaded', function() {
    fetchVisitedSites();
    fetchBlacklistedSites();

    document.getElementById('blacklist-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const url = document.getElementById('blacklist-url').value;
        blacklistSite(url);
    });

    document.getElementById('unblacklist-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const url = document.getElementById('unblacklist-url').value;
        unblacklistSite(url);
    });
});

function fetchVisitedSites() {
    fetch('http://localhost:3000/visited_sites')
        .then(response => response.json())
        .then(data => {
            var visitedSitesList = document.getElementById('visited-sites');
            visitedSitesList.innerHTML = '';
            data.forEach(function(site) {
                var listItem = document.createElement('li');
                listItem.textContent = `${site.url} - Visits: ${site.visit_count} and Duration: ${site.total_duration}`;
                visitedSitesList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching visited sites:', error);
        });
}

function fetchBlacklistedSites() {
    fetch('http://localhost:3000/blacklisted_sites')
        .then(response => response.json())
        .then(data => {
            var blacklistedSitesList = document.getElementById('blacklisted-sites');
            blacklistedSitesList.innerHTML = '';
            data.forEach(function(site) {
                var listItem = document.createElement('li');
                listItem.textContent = site.url;
                blacklistedSitesList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching blacklisted sites:', error);
        });
}

function blacklistSite(url) {
    fetch('http://localhost:3000/blacklisted_sites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blacklisted_site: { url: url } }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.errors.join(', ')); });
        }
        return response.json();
    })
    .then(() => {
        fetchBlacklistedSites();
        alert('Site blacklisted successfully');
    })
    .catch(error => {
        console.error('Error blacklisting site:', error);
    });
}

function unblacklistSite(url) {
    fetch(`http://localhost:3000/blacklisted_sites/delete_by_url`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error); });
        }
        fetchBlacklistedSites();
        alert('Site unblacklisted successfully');
    })
    .catch(error => {
        console.error('Error unblacklisting site:', error);
    });
}
