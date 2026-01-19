const input = document.getElementById('liveSearch');
const resultsBox = document.getElementById('searchResults');

let debounceTimer;

input.addEventListener('keyup', () => {
	clearTimeout(debounceTimer);

	const query = input.value.trim();

	if (query.length < 2) {
		resultsBox.style.display = 'none';
		resultsBox.innerHTML = '';
		return;
	}

	debounceTimer = setTimeout(async () => {
		try {
			const res = await fetch(`/listings/api/search?q=${query}`);
			const data = await res.json();

			resultsBox.innerHTML = '';

			if (data.length === 0) {
				resultsBox.style.display = 'none';
				return;
			}

			data.forEach((listing) => {
				resultsBox.innerHTML += `
          <a href="/listings/${listing._id}" class="live-search-item">
            <img src="${listing.image.url}" />
            <div>
              <strong>${listing.title}</strong>
              <p style="margin:0;font-size:0.85rem;color:#666">
                ${listing.location}, ${listing.country}
              </p>
            </div>
          </a>
        `;
			});

			resultsBox.style.display = 'block';
		} catch (err) {
			console.error(err);
		}
	}, 300); // debounce
});

// hide dropdown on outside click
document.addEventListener('click', (e) => {
	if (!e.target.closest('.search-inp')) {
		resultsBox.style.display = 'none';
	}
});
