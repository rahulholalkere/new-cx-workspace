(function () {
  if (document.body.classList.contains('has-edit-mode-menu')) {
    return;
  }

  const tbody = document.getElementById('sbi-dash-tbody');
  const searchInput = document.getElementById('sbi-dash-search-input');
  const selectProd = document.getElementById('sbi-dash-prod-select');
  const btnRefresh = document.getElementById('sbi-dash-btn-refresh');

  const kpiTotal = document.getElementById('sbi-kpi-total');
  const kpiApproved = document.getElementById('sbi-kpi-approved');
  const kpiPending = document.getElementById('sbi-kpi-pending');
  const kpiValue = document.getElementById('sbi-kpi-value');

  function formatIndianCurrency(num) {
    const x = Math.round(num).toString();
    const lastThree = x.substring(x.length - 3);
    const otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== '') {
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    return lastThree;
  }

  function fetchApplications() {
    if (!window.Liferay || !window.Liferay.Util || !window.Liferay.Util.fetch) return;

    window.Liferay.Util.fetch('/o/c/loanapplications')
      .then(function (res) { if (res.ok) return res.json(); })
      .then(function (data) {
        if (!data || !data.items || !tbody) return;

        let totalAmt = 0;
        let approvedCount = 0;
        let pendingCount = 0;

        tbody.innerHTML = '';

        data.items.forEach(function (app) {
          const amt = parseFloat(app.loanAmount) || 0;
          totalAmt += amt;
          const status = app.sanctionStatus || 'In-Principle Approved';

          if (status.indexOf('Approved') !== -1 || status.indexOf('Disbursed') !== -1) {
            approvedCount++;
          } else {
            pendingCount++;
          }

          let pillClass = 'sbi-pill-approved';
          if (status.indexOf('Verification') !== -1) pillClass = 'sbi-pill-pending';
          if (status.indexOf('Disbursed') !== -1) pillClass = 'sbi-pill-disbursed';

          const tr = document.createElement('tr');
          tr.setAttribute('data-id', app.id);
          tr.setAttribute('data-product', app.selectedProduct || '');
          tr.innerHTML =
            '<td><span class="sbi-ref-badge-sm">' + (app.applicationRefNumber || 'SBI-APP-2026') + '</span></td>' +
            '<td><strong>' + (app.applicantName || 'Applicant') + '</strong><span class="sbi-contact-sub">Tel: ' + (app.applicantMobile || '') + '</span></td>' +
            '<td><span class="sbi-scheme-tag">' + (app.selectedProduct || 'Home Loan') + '</span></td>' +
            '<td><strong class="sbi-amt">₹ ' + formatIndianCurrency(amt) + '</strong></td>' +
            '<td>₹ ' + formatIndianCurrency(app.monthlyIncome || 0) + '</td>' +
            '<td>' + (app.city || '') + '</td>' +
            '<td><span class="sbi-status-pill ' + pillClass + '">' + status + '</span></td>' +
            '<td>' +
              '<div class="sbi-row-actions">' +
                '<button type="button" class="sbi-action-btn sbi-btn-verify" data-id="' + app.id + '">Verify</button>' +
                '<button type="button" class="sbi-action-btn sbi-btn-disburse" data-id="' + app.id + '">Disburse</button>' +
              '</div>' +
            '</td>';

          tbody.appendChild(tr);
        });

        if (kpiTotal) kpiTotal.textContent = data.items.length;
        if (kpiApproved) kpiApproved.textContent = approvedCount;
        if (kpiPending) kpiPending.textContent = pendingCount;
        if (kpiValue) {
          const inLakhs = (totalAmt / 100000).toFixed(1);
          kpiValue.textContent = '₹ ' + inLakhs + ' L';
        }
      })
      .catch(function (err) {
        console.warn('Dashboard fetch notice:', err);
      });
  }

  function filterTable() {
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const prod = selectProd ? selectProd.value : 'ALL';

    rows.forEach(function (row) {
      const text = row.textContent.toLowerCase();
      const rowProd = row.getAttribute('data-product') || '';

      const matchQ = (!q || text.indexOf(q) !== -1);
      const matchProd = (prod === 'ALL' || rowProd.indexOf(prod) !== -1);

      if (matchQ && matchProd) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (selectProd) selectProd.addEventListener('change', filterTable);
  if (btnRefresh) btnRefresh.addEventListener('click', fetchApplications);

  // Row Action buttons handling (PATCH to Liferay Object API)
  if (tbody) {
    tbody.addEventListener('click', function (e) {
      const btn = e.target.closest('.sbi-action-btn');
      if (!btn) return;

      const appId = btn.getAttribute('data-id');
      if (!appId) return;

      let newStatus = 'Under Field Verification';
      if (btn.classList.contains('sbi-btn-disburse')) {
        newStatus = 'Sanctioned & Disbursed';
      }

      if (window.Liferay && window.Liferay.Util && window.Liferay.Util.fetch) {
        window.Liferay.Util.fetch('/o/c/loanapplications/' + appId, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sanctionStatus: newStatus })
        })
          .then(function () {
            fetchApplications();
          })
          .catch(function () {});
      }
    });
  }

  // Initial fetch
  fetchApplications();
})();
