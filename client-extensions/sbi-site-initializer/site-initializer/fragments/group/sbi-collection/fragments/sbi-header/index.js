(function () {
  if (document.body.classList.contains('has-edit-mode-menu')) {
    return;
  }

  // Toggle Login Dropdown
  const loginToggle = document.getElementById('sbi-login-toggle');
  const loginDropdown = loginToggle ? loginToggle.closest('.sbi-login-dropdown') : null;

  if (loginToggle && loginDropdown) {
    loginToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = loginDropdown.classList.contains('open');
      loginDropdown.classList.toggle('open');
      loginToggle.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('click', function (e) {
      if (!loginDropdown.contains(e.target)) {
        loginDropdown.classList.remove('open');
        loginToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Toggle Mobile Menu
  const mobileToggle = document.getElementById('sbi-mobile-toggle');
  const mobileDrawer = document.getElementById('sbi-mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', !isOpen);
      mobileDrawer.setAttribute('aria-hidden', isOpen);
    });
  }

  // Bilingual (English / हिन्दी) Dynamic Language Switcher
  const langBtns = document.querySelectorAll('.sbi-lang-btn');
  const brandTitle = document.querySelector('.sbi-brand-title');
  const brandSubtitle = document.querySelector('.sbi-brand-subtitle');
  const navPersonal = document.getElementById('sbi-nav-personal');
  const navNri = document.getElementById('sbi-nav-nri');
  const navBusiness = document.getElementById('sbi-nav-business');
  const navWealth = document.getElementById('sbi-nav-wealth');
  const applyPill = document.querySelector('.sbi-fast-apply-btn span:last-child');
  const tickerText = document.querySelector('.sbi-ticker-content span');

  const enTexts = {
    title: 'State Bank of India',
    subtitle: 'The Banker to Every Indian',
    personal: 'Personal',
    nri: 'NRI',
    business: 'Business',
    wealth: 'Wealth',
    apply: 'Apply Loan',
    ticker: 'Special 7.25% p.a. on 444-day Amrit Vrishti Scheme | Zero processing fee on PM Surya Ghar Solar Rooftop Loans'
  };

  const hiTexts = {
    title: 'भारतीय स्टेट बैंक',
    subtitle: 'हर भारतीय का बैंक',
    personal: 'व्यक्तिगत बैंकिंग',
    nri: 'एनआरआई सेवाएं',
    business: 'व्यापार एवं एमएसएमई',
    wealth: 'वेल्थ',
    apply: 'ऋण आवेदन',
    ticker: 'विशेष 7.25% वार्षिक दर 444-दिवसीय अमृत वृष्टि योजना पर | पीएम सूर्य घर सोलर योजना पर शून्य प्रोसेसिंग शुल्क'
  };

  if (langBtns) {
    langBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        langBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const isHindi = (btn.textContent.indexOf('हिन्दी') !== -1);
        const dict = isHindi ? hiTexts : enTexts;

        if (brandTitle) brandTitle.textContent = dict.title;
        if (brandSubtitle) brandSubtitle.textContent = dict.subtitle;
        if (navPersonal) navPersonal.textContent = dict.personal;
        if (navNri) navNri.textContent = dict.nri;
        if (navBusiness) navBusiness.textContent = dict.business;
        if (navWealth) navWealth.textContent = dict.wealth;
        if (applyPill) applyPill.textContent = dict.apply;
        if (tickerText) tickerText.innerHTML = dict.ticker;
      });
    });
  }
})();
