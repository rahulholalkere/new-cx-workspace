(function () {
  if (document.body.classList.contains('has-edit-mode-menu')) {
    return;
  }

  // DOM Elements
  const stepIndicators = [
    document.getElementById('sbi-step-ind-1'),
    document.getElementById('sbi-step-ind-2'),
    document.getElementById('sbi-step-ind-3'),
    document.getElementById('sbi-step-ind-4')
  ];

  const panels = [
    document.getElementById('sbi-panel-step-1'),
    document.getElementById('sbi-panel-step-2'),
    document.getElementById('sbi-panel-step-3'),
    document.getElementById('sbi-panel-step-4')
  ];

  // Inputs
  const selectProduct = document.getElementById('sbi-wiz-product');
  const inputAmount = document.getElementById('sbi-wiz-amount');
  const inputTenure = document.getElementById('sbi-wiz-tenure');
  const dispRate = document.getElementById('sbi-wiz-rate-disp');
  const dispEmi = document.getElementById('sbi-wiz-emi-disp');

  const inputName = document.getElementById('sbi-wiz-name');
  const inputPan = document.getElementById('sbi-wiz-pan');
  const inputMobile = document.getElementById('sbi-wiz-mobile');
  const inputEmail = document.getElementById('sbi-wiz-email');
  const errorBoxStep2 = document.getElementById('sbi-step2-error');

  const selectEmployment = document.getElementById('sbi-wiz-employment');
  const inputIncome = document.getElementById('sbi-wiz-income');
  const inputCity = document.getElementById('sbi-wiz-city');
  const checkConsent = document.getElementById('sbi-wiz-consent');
  const errorBoxStep3 = document.getElementById('sbi-step3-error');

  // Buttons
  const btnGoto2 = document.getElementById('sbi-btn-goto-step-2');
  const btnBack1 = document.getElementById('sbi-btn-back-step-1');
  const btnGoto3 = document.getElementById('sbi-btn-goto-step-3');
  const btnBack2 = document.getElementById('sbi-btn-back-step-2');
  const btnSubmit = document.getElementById('sbi-btn-submit-sanction');

  function formatCurrency(num) {
    const x = Math.round(num).toString();
    const lastThree = x.substring(x.length - 3);
    const otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== '') {
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    return lastThree;
  }

  function getSelectedRate() {
    if (!selectProduct) return 8.5;
    const opt = selectProduct.options[selectProduct.selectedIndex];
    return parseFloat(opt.getAttribute('data-rate')) || 8.5;
  }

  function calculateStep1Emi() {
    if (!inputAmount || !inputTenure || !dispEmi) return;

    const p = parseFloat(inputAmount.value) || 0;
    const rate = getSelectedRate();
    const yrs = parseFloat(inputTenure.value) || 1;

    if (dispRate) {
      dispRate.textContent = rate.toFixed(2) + '% p.a.';
    }

    const r = rate / 12 / 100;
    const n = yrs * 12;

    if (p > 0 && r > 0 && n > 0) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      dispEmi.textContent = '₹ ' + formatCurrency(emi);
    }
  }

  function setStep(stepNum) {
    for (let i = 0; i < panels.length; i++) {
      if (i + 1 === stepNum) {
        panels[i].classList.add('active');
        panels[i].removeAttribute('hidden');
        stepIndicators[i].classList.add('active');
        stepIndicators[i].setAttribute('aria-current', 'step');
      } else if (i + 1 < stepNum) {
        panels[i].classList.remove('active');
        panels[i].setAttribute('hidden', '');
        stepIndicators[i].classList.remove('active');
        stepIndicators[i].classList.add('completed');
        stepIndicators[i].removeAttribute('aria-current');
      } else {
        panels[i].classList.remove('active');
        panels[i].setAttribute('hidden', '');
        stepIndicators[i].classList.remove('active', 'completed');
        stepIndicators[i].removeAttribute('aria-current');
      }
    }
    window.scrollTo({ top: document.querySelector('.sbi-wizard-card').offsetTop - 80, behavior: 'smooth' });
  }

  // Preselect product, amount, tenure from URL parameter if present
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const prodParam = urlParams.get('product');
    const amtParam = urlParams.get('amount');
    const tenureParam = urlParams.get('tenure');

    if (prodParam && selectProduct) {
      for (let i = 0; i < selectProduct.options.length; i++) {
        if (selectProduct.options[i].value.toLowerCase().includes(prodParam.toLowerCase())) {
          selectProduct.selectedIndex = i;
          break;
        }
      }
    }

    if (amtParam && inputAmount) {
      inputAmount.value = amtParam;
    }

    if (tenureParam && inputTenure) {
      inputTenure.value = tenureParam;
    }
  } catch (e) {}

  if (selectProduct) selectProduct.addEventListener('change', calculateStep1Emi);
  if (inputAmount) inputAmount.addEventListener('input', calculateStep1Emi);
  if (inputTenure) inputTenure.addEventListener('input', calculateStep1Emi);

  // Initial Calculation
  calculateStep1Emi();

  // Navigation handlers
  if (btnGoto2) {
    btnGoto2.addEventListener('click', function () {
      setStep(2);
    });
  }

  if (btnBack1) {
    btnBack1.addEventListener('click', function () {
      setStep(1);
    });
  }

  if (btnGoto3) {
    btnGoto3.addEventListener('click', function () {
      // Step 2 Validations
      const name = (inputName ? inputName.value.trim() : '');
      const pan = (inputPan ? inputPan.value.trim().toUpperCase() : '');
      const mobile = (inputMobile ? inputMobile.value.trim() : '');
      const email = (inputEmail ? inputEmail.value.trim() : '');

      if (!name) {
        showError(errorBoxStep2, 'Please enter your Full Name as per PAN card.');
        return;
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        showError(errorBoxStep2, 'Invalid PAN format. Must be 10 characters (e.g. ABCDE1234F).');
        return;
      }

      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(mobile)) {
        showError(errorBoxStep2, 'Please enter a valid 10-digit Indian Mobile Number.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showError(errorBoxStep2, 'Please enter a valid Email Address.');
        return;
      }

      hideError(errorBoxStep2);
      setStep(3);
    });
  }

  if (btnBack2) {
    btnBack2.addEventListener('click', function () {
      setStep(2);
    });
  }

  if (btnSubmit) {
    btnSubmit.addEventListener('click', function () {
      const income = parseFloat(inputIncome ? inputIncome.value : 0) || 0;
      const city = (inputCity ? inputCity.value.trim() : '');
      const consent = checkConsent ? checkConsent.checked : false;

      if (income < 15000) {
        showError(errorBoxStep3, 'Minimum net monthly take-home income required is ₹ 15,000.');
        return;
      }

      if (!city) {
        showError(errorBoxStep3, 'Please enter your current city.');
        return;
      }

      if (!consent) {
        showError(errorBoxStep3, 'Please accept the consent terms to proceed with credit assessment.');
        return;
      }

      hideError(errorBoxStep3);

      // Submit Application
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const refNumber = 'SBI-APP-2026-' + randomSuffix;
      const productName = selectProduct ? selectProduct.value : 'SBI Regular Home Loan';
      const requestedAmt = parseFloat(inputAmount.value) || 3500000;
      const tenureYrs = parseInt(inputTenure.value) || 20;
      const applicantName = inputName.value.trim();
      const applicantEmail = inputEmail.value.trim();
      const applicantMobile = inputMobile.value.trim();
      const applicantPan = inputPan.value.trim().toUpperCase();
      const rate = getSelectedRate();

      // Recalculate final EMI
      const r = rate / 12 / 100;
      const n = tenureYrs * 12;
      const finalEmi = (requestedAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

      // Populate Sanction Result Letter
      const elRefNum = document.getElementById('sbi-res-ref-num');
      const elName = document.getElementById('sbi-res-name');
      const elProduct = document.getElementById('sbi-res-product');
      const elSanctioned = document.getElementById('sbi-res-sanctioned-amt');
      const elRate = document.getElementById('sbi-res-rate');
      const elTenure = document.getElementById('sbi-res-tenure');
      const elEmi = document.getElementById('sbi-res-emi');

      if (elRefNum) elRefNum.textContent = refNumber;
      if (elName) elName.textContent = applicantName;
      if (elProduct) elProduct.textContent = productName;
      if (elSanctioned) elSanctioned.textContent = '₹ ' + formatCurrency(requestedAmt);
      if (elRate) elRate.textContent = rate.toFixed(2) + '% p.a. (EBLR Linked)';
      if (elTenure) elTenure.textContent = tenureYrs + ' Years (' + n + ' Months)';
      if (elEmi) elEmi.textContent = '₹ ' + formatCurrency(finalEmi);

      // Persist to Liferay Custom Object via Headless API
      if (window.Liferay && window.Liferay.Util && window.Liferay.Util.fetch) {
        window.Liferay.Util.fetch('/o/c/loanapplications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            applicationRefNumber: refNumber,
            applicantName: applicantName,
            applicantEmail: applicantEmail,
            applicantMobile: applicantMobile,
            selectedProduct: productName,
            loanAmount: requestedAmt,
            tenureYears: tenureYrs,
            monthlyIncome: income,
            city: city,
            panNumber: applicantPan,
            sanctionStatus: 'In-Principle Approved'
          })
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            console.log('SBI Loan Application successfully registered in Liferay Object:', data);
          })
          .catch(function (err) {
            console.warn('Note: Application displayed locally; object submission notice:', err);
          });
      }

      setStep(4);
    });
  }

  function showError(box, msg) {
    if (!box) return;
    box.textContent = msg;
    box.removeAttribute('hidden');
  }

  function hideError(box) {
    if (!box) return;
    box.setAttribute('hidden', '');
  }
})();
