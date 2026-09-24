(function () {
  if (document.body.classList.contains('has-edit-mode-menu')) {
    return;
  }

  const tabDeposits = document.getElementById('sbi-tab-deposits');
  const tabLoans = document.getElementById('sbi-tab-loans');
  const panelDeposits = document.getElementById('sbi-panel-deposits');
  const panelLoans = document.getElementById('sbi-panel-loans');

  if (tabDeposits && tabLoans && panelDeposits && panelLoans) {
    tabDeposits.addEventListener('click', function () {
      tabDeposits.classList.add('active');
      tabDeposits.setAttribute('aria-selected', 'true');
      tabLoans.classList.remove('active');
      tabLoans.setAttribute('aria-selected', 'false');

      panelDeposits.classList.add('active');
      panelDeposits.removeAttribute('hidden');
      panelLoans.classList.remove('active');
      panelLoans.setAttribute('hidden', '');
    });

    tabLoans.addEventListener('click', function () {
      tabLoans.classList.add('active');
      tabLoans.setAttribute('aria-selected', 'true');
      tabDeposits.classList.remove('active');
      tabDeposits.setAttribute('aria-selected', 'false');

      panelLoans.classList.add('active');
      panelLoans.removeAttribute('hidden');
      panelDeposits.classList.remove('active');
      panelDeposits.setAttribute('hidden', '');
    });
  }

  // Attempt dynamic hydration from Liferay Object API if reachable
  if (window.Liferay && window.Liferay.Util && window.Liferay.Util.fetch) {
    window.Liferay.Util.fetch('/o/c/interestrates')
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (data) {
        if (data && data.items && data.items.length > 0) {
          console.log('SBI Interest Rates hydrated from Liferay Object:', data.items.length, 'entries');
        }
      })
      .catch(function (err) {
        // Fallback static data is already visible, non-blocking
      });
  }
})();
