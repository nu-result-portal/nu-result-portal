/* =========================================
   NU RESULT & CGPA PORTAL
   Improved Application Logic
========================================= */

const $ = (selector) => document.querySelector(selector);

let lang = "bn";
let rowCount = 0;

const OFFICIAL_URL = "https://results.nu.ac.bd/";

const portalUrls = {
  honours: OFFICIAL_URL,
  degree: OFFICIAL_URL,
  masters: OFFICIAL_URL,
  professional: OFFICIAL_URL
};

/* Official portal */

function setPortal(course) {
  const url = portalUrls[course] || OFFICIAL_URL;
  const frame = $("#officialFrame");
  const fallback = $("#portalFallback");

  if (frame && frame.src !== url) {
    frame.src = url;
  }

  if (fallback) {
    fallback.href = url;
  }
}

const yearElement = $("#currentYear");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* Language switch */

const languageButton = $("#langToggle");

if (languageButton) {
  languageButton.addEventListener("click", () => {
    lang = lang === "bn" ? "en" : "bn";
    document.documentElement.lang = lang;

    languageButton.textContent =
      lang === "bn" ? "English" : "বাংলা";

    document.querySelectorAll("[data-bn][data-en]")
      .forEach((element) => {
        element.textContent = element.dataset[lang];
      });
  });
}

/* Main navigation */

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.toggle("active", tab === button);
    });

    document.querySelectorAll("main > .panel").forEach((panel) => {
      panel.classList.add("hidden");
    });

    const target = $("#" + button.dataset.panel);

    if (target) {
      target.classList.remove("hidden");
    }
  });
});

/* Result form */

const resultForm = $("#resultForm");

if (resultForm) {
  resultForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const course = $("#course").value;

    setPortal(course);

    const officialTab = document.querySelector(
      '.tab[data-panel="officialPanel"]'
    );

    if (officialTab) {
      officialTab.click();
    }

    const message = $("#formMessage");

    if (message) {
      message.textContent = lang === "bn"
        ? "এখন অফিসিয়াল NU পোর্টালে প্রয়োজনীয় তথ্য ও CAPTCHA দিয়ে ফলাফল অনুসন্ধান করুন। এই সাইট থেকে স্বয়ংক্রিয়ভাবে প্রকৃত ফলাফল সংগ্রহ করা হচ্ছে না।"
        : "Enter your details and CAPTCHA on the official NU portal to search for your result. This site does not automatically retrieve official results.";
    }
  });
}

const loadPortalButton = $("#loadPortal");
const portalCourse = $("#portalCourse");

if (loadPortalButton && portalCourse) {
  loadPortalButton.addEventListener("click", () => {
    setPortal(portalCourse.value);
  });

  portalCourse.addEventListener("change", () => {
    setPortal(portalCourse.value);
  });
}

/* Safe HTML escaping */

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

/* Clearly fictional demo marksheet */

const demoNames = {
  honours: "Bachelor of Arts (Honours)",
  degree: "Bachelor Degree (Pass)",
  masters: "Master's Programme",
  professional: "Professional Programme"
};

function makeDemo(data) {
  return {
    name: "DEMO STUDENT — NOT REAL",
    college: "Sample Affiliated College (Demo)",
    course: demoNames[data.course] || "Demo Programme",
    exam: data.exam,
    year: data.year,
    roll: data.roll,
    reg: data.reg,
    subjects: [
      {
        code: "DEMO-101",
        name: "Sample Subject One",
        grade: "A",
        point: 3.75
      },
      {
        code: "DEMO-102",
        name: "Sample Subject Two",
        grade: "A-",
        point: 3.50
      },
      {
        code: "DEMO-103",
        name: "Sample Subject Three",
        grade: "B+",
        point: 3.25
      },
      {
        code: "DEMO-104",
        name: "Sample Subject Four",
        grade: "A",
        point: 3.75
      }
    ],
    gpa: 3.56,
    status: "DEMO ONLY"
  };
}

const showDemoButton = $("#showDemo");

if (showDemoButton) {
  showDemoButton.addEventListener("click", () => {
    const data = {
      course: $("#course").value,
      exam: $("#exam").value,
      year: $("#year").value || "2024",
      roll: $("#roll").value || "DEMO-0000",
      reg: $("#reg").value || "DEMO-REGISTRATION"
    };

    renderTranscript(makeDemo(data), true);
  });
}

/* Marksheet renderer */

function renderTranscript(result, isDemo = true) {
  const area = $("#resultArea");

  if (!area) return;

  const subjects = Array.isArray(result.subjects)
    ? result.subjects
    : [];

  area.innerHTML = `
    ${isDemo
      ? `<div class="demo-banner">
          DEMONSTRATION ONLY · NOT AN OFFICIAL RESULT · নমুনা ফলাফল
        </div>`
      : ""}

    <article class="transcript" id="transcript">
      <header class="transcript-header">
        <div class="crest">NU</div>
        <p>NATIONAL UNIVERSITY · BANGLADESH</p>
        <h2>${esc(result.college || "Affiliated College")}</h2>
        <p>ACADEMIC RECORDS &amp; EXAMINATIONS</p>
        <div class="transcript-title">
          ACADEMIC TRANSCRIPT / MARKSHEET
        </div>
      </header>

      <section class="student-meta">
        <div><span>Student Name</span><b>${esc(result.name || "—")}</b></div>
        <div><span>Programme</span><b>${esc(result.course || "—")}</b></div>
        <div><span>Examination</span><b>${esc(result.exam || "—")}</b></div>
        <div><span>Exam Year</span><b>${esc(result.year || "—")}</b></div>
        <div><span>Roll Number</span><b>${esc(result.roll || "—")}</b></div>
        <div><span>Registration</span><b>${esc(result.reg || "—")}</b></div>
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
        <tbody>
          ${subjects.map((subject) => `
            <tr>
              <td>${esc(subject.code || "—")}</td>
              <td>${esc(subject.name || "—")}</td>
              <td>${esc(subject.grade || "—")}</td>
              <td>${Number(subject.point || 0).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="result-summary">
        <div class="summary-card">
          <small>GRADE POINT AVERAGE</small>
          <strong>${Number(result.gpa || 0).toFixed(2)}</strong>
        </div>
        <div class="summary-card">
          <small>RESULT STATUS</small>
          <strong>${esc(result.status || "—")}</strong>
        </div>
      </div>

      <p class="small-note">
        This is fictional demonstration data, not a National University
        academic record. It must not be used as proof of results.
      </p>

      <div class="transcript-footer">
        <span>Generated by independent NU Result &amp; CGPA Portal</span>
        <span>Not an official university-issued document</span>
      </div>
    </article>

    <div class="transcript-actions">
      <button class="primary" id="downloadPdf" type="button">
        Download PDF / Save PDF
      </button>
      <button class="outline" id="printResult" type="button">
        Print transcript
      </button>
      <button class="quiet" id="newSearch" type="button">
        Close preview
      </button>
    </div>
  `;

  area.classList.remove("hidden");

  $("#downloadPdf").addEventListener("click", () => {
    printDocument("marksheet");
  });

  $("#printResult").addEventListener("click", () => {
    printDocument("marksheet");
  });

  $("#newSearch").addEventListener("click", () => {
    area.classList.add("hidden");
  });

  area.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* Dedicated print modes */

function printDocument(mode) {
  document.body.classList.remove(
    "print-marksheet",
    "print-cgpa"
  );

  document.body.classList.add(
    mode === "cgpa" ? "print-cgpa" : "print-marksheet"
  );

  window.print();
}

window.addEventListener("afterprint", () => {
  document.body.classList.remove(
    "print-marksheet",
    "print-cgpa"
  );
});

/* Credit-weighted CGPA calculator */

const yearRows = $("#yearRows");

function addYear(gpa = "", credits = "") {
  if (!yearRows) return;

  rowCount++;

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>Year ${rowCount}</td>
    <td>
      <input
        class="gpa"
        type="number"
        min="0"
        max="4"
        step="0.01"
        inputmode="decimal"
        placeholder="e.g. 3.50"
        value="${esc(gpa)}"
        aria-label="Year ${rowCount} GPA"
      >
    </td>
    <td>
      <input
        class="credits"
        type="number"
        min="0.01"
        step="0.01"
        inputmode="decimal"
        placeholder="e.g. 30"
        value="${esc(credits)}"
        aria-label="Year ${rowCount} credits"
      >
    </td>
  `;

  yearRows.appendChild(row);
}

for (let i = 0; i < 4; i++) {
  addYear();
}

const addYearButton = $("#addYear");

if (addYearButton) {
  addYearButton.addEventListener("click", () => {
    addYear();
  });
}

const calculateButton = $("#calculate");

if (calculateButton) {
  calculateButton.addEventListener("click", () => {
    const output = $("#calcOutput");
    const rows = [...yearRows.querySelectorAll("tr")];

    let weightedTotal = 0;
    let totalCredits = 0;
    let filledRows = 0;

    for (const row of rows) {
      const gpaInput = row.querySelector(".gpa");
      const creditInput = row.querySelector(".credits");

      const gpaText = gpaInput.value.trim();
      const creditText = creditInput.value.trim();

      if (gpaText === "" && creditText === "") {
        continue;
      }

      const gpa = Number(gpaText);
      const credits = Number(creditText);

      if (
        gpaText === "" ||
        creditText === "" ||
        !Number.isFinite(gpa) ||
        !Number.isFinite(credits) ||
        gpa < 0 ||
        gpa > 4 ||
        credits <= 0
      ) {
        output.classList.remove("hidden");
        output.textContent =
          "প্রতিটি পূরণ করা বর্ষের জন্য ০–৪.০০ GPA এবং শূন্যের বেশি ক্রেডিট দিন।";
        return;
      }

      weightedTotal += gpa * credits;
      totalCredits += credits;
      filledRows++;
    }

    output.classList.remove("hidden");

    if (filledRows === 0 || totalCredits <= 0) {
      output.textContent =
        "CGPA হিসাব করতে অন্তত একটি বর্ষের GPA ও ক্রেডিট দিন।";
      return;
    }

    const cgpa = weightedTotal / totalCredits;

    output.innerHTML = `
      <small>TOTAL CREDIT-WEIGHTED CGPA</small>
      <br>
      <strong>${cgpa.toFixed(2)}</strong>
      <p class="muted">
        Total credits: ${totalCredits.toFixed(2)}
        · Formula: Σ(GPA × credits) / Σ credits
      </p>
      <button class="outline" id="printCgpa" type="button">
        Print / Save PDF
      </button>
    `;

    $("#printCgpa").addEventListener("click", () => {
      printDocument("cgpa");
    });
  });
}

const clearButton = $("#clearCalc");

if (clearButton) {
  clearButton.addEventListener("click", () => {
    yearRows.innerHTML = "";
    rowCount = 0;

    for (let i = 0; i < 4; i++) {
      addYear();
    }

    $("#calcOutput").classList.add("hidden");
    $("#calcOutput").textContent = "";
  });
}

/* Initial setup */

setPortal("honours");
