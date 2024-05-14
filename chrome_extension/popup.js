document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/visited_sites')
        .then(response => response.json())
        .then(data => {
            var visitedSitesList = document.getElementById('visited-sites'); // Define visitedSitesList here
            data.forEach(function(site) {
                var listItem = document.createElement('li');
                listItem.textContent = `${site.url} - Visits: ${site.visit_count} and Duration: ${site.total_duration}`;
                visitedSitesList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching visited sites:', error);
        });
});
