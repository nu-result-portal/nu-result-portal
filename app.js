'use strict';

const $ = (s) => document.querySelector(s);

let lang = 'bn';
let rowCount = 0;

const OFFICIAL_URL = 'https://results.nu.ac.bd/';

const portalUrls = {
  honours: OFFICIAL_URL,
  degree: OFFICIAL_URL,
  masters: OFFICIAL_URL,
  professional: OFFICIAL_URL
};

const messages = {
  bn: {
    portalInfo: 'অফিসিয়াল ফলাফল দেখতে জাতীয় বিশ্ববিদ্যালয়ের মূল ওয়েবসাইট ব্যবহার করুন। ফলাফল এই ওয়েবসাইটে স্বয়ংক্রিয়ভাবে সংগ্রহ করা হয় না।',
    submitted: 'আপনার নির্বাচিত কোর্স অনুযায়ী অফিসিয়াল NU ফলাফল পোর্টাল খুলুন। সেখানে প্রয়োজনীয় তথ্য ও CAPTCHA দিয়ে ফলাফল অনুসন্ধান করুন।',
    invalid: 'সঠিক GPA (০–৪.০০) এবং শূন্যের বেশি ক্রেডিট লিখুন।',
    empty: 'GPA ও ক্রেডিট লিখে হিসাব করুন।',
    calculated: 'মোট ক্রেডিট-ওয়েটেড CGPA',
    credits: 'মোট গণনাকৃত ক্রেডিট',
    close: 'প্রিভিউ বন্ধ করুন',
    demo: 'এটি শুধুমাত্র নমুনা ফলাফল। এটি জাতীয় বিশ্ববিদ্যালয়ের আসল ফলাফল নয়।',
    popup: 'অফিসিয়াল NU ফলাফল পোর্টাল খুলুন'
  },
  en: {
    portalInfo: 'Use the official National University website to check results. Results are not automatically retrieved by this website.',
    submitted: 'Open the official NU results portal for your selected course. Enter the required details and CAPTCHA there.',
    invalid: 'Enter a valid GPA (0–4.00) and positive credits.',
    empty: 'Enter GPA and credits to calculate.',
    calculated: 'Total credit-weighted CGPA',
    credits: 'Total credits counted',
    close: 'Close preview',
    demo: 'This is demonstration data only. It is not an actual National University result.',
    popup: 'Open official NU results portal'
  }
};

function setPortal(course) {
  const url = portalUrls[course] || OFFICIAL_URL;
  const frame = $('#officialFrame');
  const fallback = $('#portalFallback');
  const message = $('#portalMessage');

  // The official portal may block iframe embedding.
  // The external link remains the reliable fallback.
  if (frame) {
    frame.src = 'about:blank';
    frame.title = 'Official NU result portal is available through the external link';
  }

  if (fallback) {
    fallback.href = url;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.textContent = messages[lang].popup;
  }

  if (message) {
    message.textContent = messages[lang].portalInfo;
  }
}

function switchLanguage() {
  lang = lang === 'bn' ? 'en' : 'bn';
  document.documentElement.lang = lang;

  const toggle = $('#langToggle');
  if (toggle) {
    toggle.textContent = lang === 'bn' ? 'English' : 'বাংলা';
  }

  document.querySelectorAll('[data-bn][data-en]').forEach((el) => {
    el.textContent = el.dataset[lang];
  });

  setPortal($('#course')?.value || 'honours');
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((item) => {
        item.classList.toggle('active', item === btn);
      });

      document.querySelectorAll('main > .panel').forEach((panel) => {
        panel.classList.add('hidden');
      });

      const target = $('#' + btn.dataset.panel);
      if (target) target.classList.remove('hidden');
    });
  });
}

function setupResultForm() {
  const form = $('#resultForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const course = $('#course')?.value || 'honours';
    setPortal(course);

    const message = $('#formMessage');
    if (message) {
      message.textContent = messages[lang].submitted;
    }

    const officialTab = document.querySelector(
      '.tab[data-panel="officialPanel"]'
    );

    if (officialTab) officialTab.click();
  });
}

function setupPortalControls() {
  $('#loadPortal')?.addEventListener('click', () => {
    setPortal($('#portalCourse')?.value || 'honours');
  });

  $('#portalCourse')?.addEventListener('change', () => {
    setPortal($('#portalCourse').value);
  });
}

function makeDemo(data) {
  const names = {
    honours: 'Bachelor of Arts (Honours)',
    degree: 'Bachelor Degree (Pass)',
    masters: 'Master’s Programme',
    professional: 'Professional Programme'
  };

  return {
    name: 'DEMO STUDENT — NOT REAL',
    college: 'Sample Affiliated College (Demo)',
    course: names[data.course] || 'Demonstration Programme',
    exam: data.exam || 'Sample Examination',
    year: data.year || '2024',
    roll: data.roll || 'DEMO-0000',
    reg: data.reg || 'DEMO-REGISTRATION',
    subjects: [
      { code: 'DEMO-101', name: 'Sample Subject One', grade: 'A', point: 3.75 },
      { code: 'DEMO-102', name: 'Sample Subject Two', grade: 'A-', point: 3.50 },
      { code: 'DEMO-103', name: 'Sample Subject Three', grade: 'B+', point: 3.25 },
      { code: 'DEMO-104', name: 'Sample Subject Four', grade: 'A', point: 3.75 }
    ],
    gpa: 3.56,
    status: 'DEMO ONLY'
  };
}

function setupDemo() {
  $('#showDemo')?.addEventListener('click', () => {
    const data = {
      course: $('#course')?.value || 'honours',
      exam: $('#exam')?.value || 'Sample Examination',
      year: $('#year')?.value || '2024',
      roll: $('#roll')?.value || 'DEMO-0000',
      reg: $('#reg')?.value || 'DEMO-REGISTRATION'
    };

    renderTranscript(makeDemo(data), true);
  });
}

function renderTranscript(result, demo = true) {
  const area = $('#resultArea');
  if (!area) return;

  area.classList.remove('hidden');

  const subjects = (result.subjects || []).map((subject) => `
    <tr>
      <td>${esc(subject.code || '—')}</td>
      <td>${esc(subject.name || '—')}</td>
      <td>${esc(subject.grade || '—')}</td>
      <td>${Number(subject.point || 0).toFixed(2)}</td>
    </tr>
  `).join('');

  area.innerHTML = `
    <div class="demo-banner">
      ${demo
        ? 'DEMONSTRATION ONLY · NOT AN OFFICIAL RESULT · নমুনা ফলাফল'
        : 'UNOFFICIAL PREVIEW · VERIFY WITH NATIONAL UNIVERSITY'}
    </div>

    <article class="transcript" id="transcript">
      <header class="transcript-header">
        <div class="crest">NU</div>
        <p>NATIONAL UNIVERSITY · BANGLADESH</p>
        <h2>${esc(result.college || 'Affiliated College')}</h2>
        <p>ACADEMIC RECORDS &amp; EXAMINATIONS</p>
        <div class="transcript-title">ACADEMIC TRANSCRIPT / MARKSHEET</div>
      </header>

      <section class="student-meta">
        <div><span>Student Name</span><b>${esc(result.name || '—')}</b></div>
        <div><span>Programme</span><b>${esc(result.course || '—')}</b></div>
        <div><span>Examination</span><b>${esc(result.exam || '—')}</b></div>
        <div><span>Exam Year</span><b>${esc(result.year || '—')}</b></div>
        <div><span>Roll Number</span><b>${esc(result.roll || '—')}</b></div>
        <div><span>Registration</span><b>${esc(result.reg || '—')}</b></div>
      </section>

      <table class="marks-table">
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject / Course</th>
            <th>Letter Grade</th>
            <th>Grade Point</th>
          </tr>
        </thead>
        <tbody>${subjects}</tbody>
      </table>

      <div class="result-summary">
        <div class="summary-card">
          <small>GRADE POINT AVERAGE</small>
          <strong>${Number(result.gpa || 0).toFixed(2)}</strong>
        </div>
        <div class="summary-card">
          <small>RESULT STATUS</small>
          <strong>${esc(result.status || '—')}</strong>
        </div>
      </div>

      <p class="small-note">
        ${demo
          ? 'This sample transcript uses fictional demonstration data. It is not a National University record and must not be used as proof of academic results.'
          : 'This is an unofficial preview. Verify all information with National University.'}
      </p>

      <div class="transcript-footer">
        <span>Generated by independent NU Result &amp; CGPA Portal</span>
        <span>Not an official university-issued document</span>
      </div>
    </article>

    <div class="transcript-actions">
      <button class="primary" id="downloadPdf">Download PDF / Save PDF</button>
      <button class="outline" id="printResult">Print transcript</button>
      <button class="quiet" id="newSearch">${messages[lang].close}</button>
    </div>
  `;

  $('#downloadPdf').onclick = () => window.print();
  $('#printResult').onclick = () => window.print();
  $('#newSearch').onclick = () => area.classList.add('hidden');

  area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function addYear(gpa = '', credits = '') {
  rowCount++;

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>Year ${rowCount}</td>
    <td>
      <input class="gpa" type="number" min="0" max="4" step="0.01"
        placeholder="e.g. 3.50" aria-label="GPA for year ${rowCount}">
    </td>
    <td>
      <input class="credits" type="number" min="0.01" step="0.01"
        placeholder="e.g. 30" aria-label="Credits for year ${rowCount}">
    </td>
  `;

  row.querySelector('.gpa').value = gpa;
  row.querySelector('.credits').value = credits;

  $('#yearRows')?.appendChild(row);
}

function setupCalculator() {
  const yearRows = $('#yearRows');
  if (!yearRows) return;

  for (let i = 0; i < 4; i++) addYear();

  $('#addYear')?.addEventListener('click', () => addYear());

  $('#calculate')?.addEventListener('click', () => {
    const rows = [...yearRows.querySelectorAll('tr')];
    let weightedSum = 0;
    let totalCredits = 0;

    for (const row of rows) {
      const gpaText = row.querySelector('.gpa').value.trim();
      const creditText = row.querySelector('.credits').value.trim();

      if (gpaText === '' && creditText === '') continue;

      const gpa = Number(gpaText);
      const credits = Number(creditText);

      if (
        gpaText === '' ||
        creditText === '' ||
        !Number.isFinite(gpa) ||
        !Number.isFinite(credits) ||
        gpa < 0 ||
        gpa > 4 ||
        credits <= 0
      ) {
        showCalculatorMessage(messages[lang].invalid);
        return;
      }

      weightedSum += gpa * credits;
      totalCredits += credits;
    }

    const output = $('#calcOutput');
    if (!output) return;

    output.classList.remove('hidden');

    if (totalCredits === 0) {
      output.textContent = messages[lang].empty;
      return;
    }

    const cgpa = weightedSum / totalCredits;

    output.innerHTML = `
      <small>${messages[lang].calculated.toUpperCase()}</small>
      <br>
      <strong>${cgpa.toFixed(2)}</strong>
      <p class="muted">
        ${messages[lang].credits}: ${totalCredits.toFixed(2)}
        <br>
        Formula: Σ(GPA × credits) / Σ credits
      </p>
      <button class="outline" id="printCgpa">Print / Save PDF</button>
    `;

    $('#printCgpa').onclick = () => window.print();
  });

  $('#clearCalc')?.addEventListener('click', () => {
    yearRows.innerHTML = '';
    rowCount = 0;

    for (let i = 0; i < 4; i++) addYear();

    $('#calcOutput')?.classList.add('hidden');
  });
}

function showCalculatorMessage(message) {
  const output = $('#calcOutput');
  if (!output) return;

  output.classList.remove('hidden');
  output.textContent = message;
}

function initialize() {
  const currentYear = $('#currentYear');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  $('#langToggle')?.addEventListener('click', switchLanguage);

  setupTabs();
  setupResultForm();
  setupPortalControls();
  setupDemo();
  setupCalculator();

  setPortal('honours');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
