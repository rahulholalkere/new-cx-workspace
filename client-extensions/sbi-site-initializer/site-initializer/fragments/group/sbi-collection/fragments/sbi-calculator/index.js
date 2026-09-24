(function () {
  if (document.body.classList.contains('has-edit-mode-menu')) {
    return;
  }

  const rangeAmount = document.getElementById('sbi-range-amount');
  const valAmount = document.getElementById('sbi-val-amount');
  const rangeRate = document.getElementById('sbi-range-rate');
  const valRate = document.getElementById('sbi-val-rate');
  const rangeTenure = document.getElementById('sbi-range-tenure');
  const valTenure = document.getElementById('sbi-val-tenure');

  const resEmi = document.getElementById('sbi-res-emi');
  const resPrincipal = document.getElementById('sbi-res-principal');
  const resInterest = document.getElementById('sbi-res-interest');
  const resTotal = document.getElementById('sbi-res-total');

  const barPrincipal = document.getElementById('sbi-bar-principal');
  const barInterest = document.getElementById('sbi-bar-interest');
  const pctPrincipal = document.getElementById('sbi-pct-principal');
  const pctInterest = document.getElementById('sbi-pct-interest');
  const calcApplyCta = document.getElementById('sbi-calc-apply');

  const presetBtns = document.querySelectorAll('.sbi-preset-btn');

  function formatIndianCurrency(num) {
    const x = Math.round(num).toString();
    const lastThree = x.substring(x.length - 3);
    const otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== '') {
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    return lastThree;
  }

  function calculateEMI() {
    if (!rangeAmount || !rangeRate || !rangeTenure) return;

    const principal = parseFloat(rangeAmount.value) || 0;
    const annualRate = parseFloat(rangeRate.value) || 0;
    const years = parseFloat(rangeTenure.value) || 0;

    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;

    if (principal > 0 && monthlyRate > 0 && totalMonths > 0) {
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      const totalAmount = emi * totalMonths;
      const totalInterest = totalAmount - principal;

      if (resEmi) resEmi.textContent = formatIndianCurrency(emi);
      if (resPrincipal) resPrincipal.textContent = formatIndianCurrency(principal);
      if (resInterest) resInterest.textContent = formatIndianCurrency(totalInterest);
      if (resTotal) resTotal.textContent = formatIndianCurrency(totalAmount);

      // Amortization Ratio Bar
      const pRatio = Math.round((principal / totalAmount) * 100);
      const iRatio = 100 - pRatio;

      if (barPrincipal) barPrincipal.style.width = pRatio + '%';
      if (barInterest) barInterest.style.width = iRatio + '%';
      if (pctPrincipal) pctPrincipal.textContent = pRatio;
      if (pctInterest) pctInterest.textContent = iRatio;

      // Update CTA with chosen parameters
      if (calcApplyCta) {
        calcApplyCta.href = '/web/state-bank-of-india/apply-loan?amount=' + principal + '&tenure=' + years;
      }
    }
  }

  function syncInputs(slider, input) {
    if (!slider || !input) return;
    slider.addEventListener('input', function () {
      input.value = slider.value;
      calculateEMI();
    });
    input.addEventListener('input', function () {
      slider.value = input.value;
      calculateEMI();
    });
  }

  syncInputs(rangeAmount, valAmount);
  syncInputs(rangeRate, valRate);
  syncInputs(rangeTenure, valTenure);

  // Preset Buttons Handling
  if (presetBtns) {
    presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        presetBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const amt = btn.getAttribute('data-amt');
        const rate = btn.getAttribute('data-rate');
        const tenure = btn.getAttribute('data-tenure');

        if (rangeAmount && valAmount) {
          rangeAmount.value = amt;
          valAmount.value = amt;
        }
        if (rangeRate && valRate) {
          rangeRate.value = rate;
          valRate.value = rate;
        }
        if (rangeTenure && valTenure) {
          rangeTenure.value = tenure;
          valTenure.value = tenure;
        }

        calculateEMI();
      });
    });
  }

  // Initial calculation
  calculateEMI();
})();
