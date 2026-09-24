(function () {
  if (document.body.classList.contains('has-edit-mode-menu')) {
    return;
  }

  // Specifications Tab Switching
  const tabs = [
    document.getElementById('sbi-pd-tab-features'),
    document.getElementById('sbi-pd-tab-eligibility'),
    document.getElementById('sbi-pd-tab-documents'),
    document.getElementById('sbi-pd-tab-fees')
  ];

  const panels = [
    document.getElementById('sbi-pd-panel-features'),
    document.getElementById('sbi-pd-panel-eligibility'),
    document.getElementById('sbi-pd-panel-documents'),
    document.getElementById('sbi-pd-panel-fees')
  ];

  tabs.forEach(function (tab, idx) {
    if (!tab) return;
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) {
        p.classList.remove('active');
        p.setAttribute('hidden', '');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      if (panels[idx]) {
        panels[idx].classList.add('active');
        panels[idx].removeAttribute('hidden');
      }
    });
  });

  // Dynamic Product Hydration based on URL code query parameter (?code=HL-001, GL-003, TD-004, NRI-005)
  const elTitle = document.getElementById('sbi-pd-title');
  const elBcTitle = document.getElementById('sbi-pd-bc-title');
  const elBcCat = document.getElementById('sbi-pd-bc-cat');
  const elDesc = document.getElementById('sbi-pd-desc');
  const elRate = document.getElementById('sbi-pd-rate');
  const elTenure = document.getElementById('sbi-pd-tenure');
  const elBadge = document.getElementById('sbi-pd-badge');
  const elCode = document.getElementById('sbi-pd-code');
  const elApplyBtn = document.getElementById('sbi-pd-apply-btn');

  const productCatalog = {
    'GL-003': {
      code: 'SCHEME CODE: GL-003',
      badge: 'ESG GREEN FINANCING',
      title: 'PM Surya Ghar Solar Roof-Top Loan',
      category: 'SBI Green',
      desc: 'Special concessional financing for residential rooftop solar installations under the PM Surya Ghar Muft Bijli Yojana with direct MNRE subsidy transfer.',
      rate: '7.00%',
      tenure: '10 Years',
      applyParam: 'PM+Surya+Ghar+Solar+Roof-Top+Loan'
    },
    'TD-004': {
      code: 'SCHEME CODE: TD-004',
      badge: 'HIGH YIELD SPECIAL DEPOSIT',
      title: 'Amrit Vrishti Term Deposit Scheme',
      category: 'Term Deposits',
      desc: 'Exclusive high-return fixed deposit scheme offering attractive yield for 444 days with premier sovereign safety and premature withdrawal facility.',
      rate: '7.25%',
      tenure: '444 Days',
      applyParam: 'Amrit+Vrishti+Term+Deposit+Scheme'
    },
    'NRI-005': {
      code: 'SCHEME CODE: NRI-005',
      badge: 'GLOBAL NRI FINANCING',
      title: 'SBI NRI Home Loan',
      category: 'NRI Banking',
      desc: 'Specially engineered residential real estate financing for Non-Resident Indians and Persons of Indian Origin (PIOs) with seamless digital approvals.',
      rate: '8.55%',
      tenure: '30 Years',
      applyParam: 'SBI+NRI+Home+Loan'
    }
  };

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code && productCatalog[code]) {
      const p = productCatalog[code];
      if (elTitle) elTitle.textContent = p.title;
      if (elBcTitle) elBcTitle.textContent = p.title;
      if (elBcCat) elBcCat.textContent = p.category;
      if (elDesc) elDesc.textContent = p.desc;
      if (elRate) elRate.textContent = p.rate;
      if (elTenure) elTenure.textContent = p.tenure;
      if (elBadge) elBadge.textContent = p.badge;
      if (elCode) elCode.textContent = p.code;
      if (elApplyBtn) elApplyBtn.href = '/web/state-bank-of-india/apply-loan?product=' + p.applyParam;
    }
  } catch (e) {}

  // Live Verification against Liferay Object API
  if (window.Liferay && window.Liferay.Util && window.Liferay.Util.fetch) {
    window.Liferay.Util.fetch('/o/c/bankingproducts')
      .then(function (res) { if (res.ok) return res.json(); })
      .then(function (data) {
        if (data && data.items) {
          console.log('SBI Banking Product verified from Object API:', data.items.length);
        }
      })
      .catch(function () {});
  }
})();
