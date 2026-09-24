(function () {
  if (document.body.classList.contains('has-edit-mode-menu')) {
    return;
  }

  const selectCity = document.getElementById('sbi-loc-city-select');
  const selectType = document.getElementById('sbi-loc-type-select');
  const inputQuery = document.getElementById('sbi-loc-query-input');
  const countDisplay = document.getElementById('sbi-results-count');
  const cardsContainer = document.getElementById('sbi-branch-cards-container');

  const focusLabel = document.getElementById('sbi-map-focus-label');
  const coordsLabel = document.getElementById('sbi-map-coords');
  const popoverTitle = document.getElementById('sbi-popover-title');
  const popoverAddress = document.getElementById('sbi-popover-address');
  const popoverType = document.getElementById('sbi-popover-type');
  const popoverCode = document.getElementById('sbi-popover-code');
  const popoverDir = document.getElementById('sbi-popover-dir');

  function filterCards() {
    if (!cardsContainer) return;
    const cards = cardsContainer.querySelectorAll('.sbi-branch-card');
    const selectedCity = selectCity ? selectCity.value : 'ALL';
    const selectedType = selectType ? selectType.value : 'ALL';
    const query = inputQuery ? inputQuery.value.trim().toLowerCase() : '';

    let visibleCount = 0;

    cards.forEach(function (card) {
      const city = card.getAttribute('data-city') || '';
      const type = card.getAttribute('data-type') || '';
      const text = card.textContent.toLowerCase();

      const cityMatch = (selectedCity === 'ALL' || city === selectedCity);
      const typeMatch = (selectedType === 'ALL' || type === selectedType);
      const queryMatch = (!query || text.indexOf(query) !== -1);

      if (cityMatch && typeMatch && queryMatch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = visibleCount;
    }
  }

  if (selectCity) selectCity.addEventListener('change', filterCards);
  if (selectType) selectType.addEventListener('change', filterCards);
  if (inputQuery) inputQuery.addEventListener('input', filterCards);

  // Card click to focus map
  if (cardsContainer) {
    cardsContainer.addEventListener('click', function (e) {
      const card = e.target.closest('.sbi-branch-card');
      if (!card) return;

      cardsContainer.querySelectorAll('.sbi-branch-card').forEach(function (c) {
        c.classList.remove('active');
      });
      card.classList.add('active');

      const name = card.querySelector('.sbi-bc-name') ? card.querySelector('.sbi-bc-name').textContent : '';
      const addr = card.querySelector('.sbi-bc-address') ? card.querySelector('.sbi-bc-address').textContent : '';
      const code = card.querySelector('.sbi-bc-code') ? card.querySelector('.sbi-bc-code').textContent : '';
      const type = card.getAttribute('data-type') || 'Branch';
      const lat = card.getAttribute('data-lat') || '18.9322';
      const lng = card.getAttribute('data-lng') || '72.8336';

      if (focusLabel) focusLabel.textContent = 'Focus: ' + name;
      if (coordsLabel) coordsLabel.textContent = lat + '° N, ' + lng + '° E';
      if (popoverTitle) popoverTitle.textContent = name;
      if (popoverAddress) popoverAddress.textContent = addr;
      if (popoverType) popoverType.textContent = type.toUpperCase();
      if (popoverCode) popoverCode.textContent = code;
      if (popoverDir) popoverDir.href = 'https://maps.google.com/?q=' + lat + ',' + lng;
    });
  }

  // Live Hydration from Liferay Object API
  if (window.Liferay && window.Liferay.Util && window.Liferay.Util.fetch) {
    window.Liferay.Util.fetch('/o/c/branchlocations')
      .then(function (res) { if (res.ok) return res.json(); })
      .then(function (data) {
        if (data && data.items && data.items.length > 0) {
          console.log('SBI Branch Locations verified from Liferay Object API:', data.items.length);
        }
      })
      .catch(function () {});
  }
})();
