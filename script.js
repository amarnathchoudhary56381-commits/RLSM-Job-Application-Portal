// ===========================
// MULTI-STEP FORM LOGIC
// ===========================

const fieldsets = Array.from(document.querySelectorAll("fieldset"));
const nextBtns = document.querySelectorAll(".next");
const prevBtns = document.querySelectorAll(".previous");
const progressbar = document.querySelectorAll("#progressbar li");
const applicationForm = document.getElementById("multiStepForm");
let currentStep = 0;

fieldsets[currentStep].classList.add("active");

nextBtns.forEach((button) => {
  button.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;
    changeStep(1);
  });
});

prevBtns.forEach((button) => {
  button.addEventListener("click", () => changeStep(-1));
});

function changeStep(direction) {
  fieldsets[currentStep].classList.remove("active");
  progressbar[currentStep].classList.remove("active");
  currentStep += direction;
  fieldsets[currentStep].classList.add("active");
  progressbar[currentStep].classList.add("active");
}

function validateStep(step) {
  const inputs = fieldsets[step].querySelectorAll("input, select");
  for (const input of inputs) {
    if (input.hasAttribute("required")) {
      if (input.type === "radio") {
        const radios = fieldsets[step].querySelectorAll(
          `input[name="${input.name}"]`
        );
        if (![...radios].some((r) => r.checked)) {
          alert(`Please select an option for "${input.name}"`);
          return false;
        }
      } else if (!input.value.trim()) {
        alert(`Please fill out the "${input.placeholder}" field`);
        return false;
      }

      if (input.name === "email") {
        const gmailPattern = /^[a-zA-Z0-9._%+\-]+@gmail\.com$/;
        if (!gmailPattern.test(input.value.trim())) {
          alert("❌ Please enter a valid Gmail address (e.g. abc@gmail.com)");
          return false;
        }
      }

      if (input.name === "contact") {
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(input.value.trim())) {
          alert("❌ Please enter a valid 10-digit phone number");
          return false;
        }
      }
    }
  }
  return true;
}

// ===========================
// SUBMIT FORM TO GOOGLE SCRIPT
// ===========================

applicationForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(applicationForm);

  fetch(applicationForm.action, {
    method: "POST",
    mode: "no-cors",
    body: formData,
  })
    .then(() => {
      // Replace fieldset content with success message (no submit button)
      fieldsets[currentStep].innerHTML = `
        <h2 class="fs-title">Success!</h2>
        <div class="success-message">
          <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true" focusable="false">
            <circle cx="30" cy="30" r="28" stroke="#37d67a" stroke-width="4" fill="none"></circle>
            <path d="M18 32 L27 41 L43 23" stroke="#37d67a" stroke-width="4" fill="none"></path>
          </svg>
          <p>
            Your form is submitted and our team will connect you shortly.<br />
            Thank you for applying!<br />
            If you need any kind of help, please contact our support.
          </p>
        </div>
      `;
    })
    .catch(() => alert("❌ Failed to submit the form. Please try again."));
});

// ===========================
// DARK/LIGHT MODE TOGGLE
// ===========================

const modeToggle = document.getElementById("modeToggle");

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.body.classList.add("dark");
}

function updateToggleIcon() {
  modeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
}

updateToggleIcon();

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  updateToggleIcon();
});
