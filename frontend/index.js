const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector("#browseBtn");

const bgProgress = document.querySelector(".bg-progress");
const progressPercent = document.querySelector("#progressPercent");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
const status = document.querySelector(".status");

const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL");
const emailForm = document.querySelector("#emailForm");

const toast = document.querySelector(".toast");

const uploadURL = `/api/files`;
const emailURL = `/api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024; // 100mb

browseBtn.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  if (files.length === 1) {
    if (files[0].size < maxAllowedSize) {
      fileInput.files = files;
      uploadFile();
    } else {
      showToast("Max file size is 100MB");
    }
  } else if (files.length > 1) {
    showToast("You can't upload multiple files");
  }
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragged");
});

dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragged"));

fileInput.addEventListener("change", () => {
  if (!fileInput.files.length) return;
  if (fileInput.files[0].size > maxAllowedSize) {
    showToast("Max file size is 100MB");
    fileInput.value = "";
    return;
  }
  uploadFile();
});

copyURLBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
  showToast("Copied to clipboard");
});

fileURL.addEventListener("click", () => fileURL.select());

const uploadFile = () => {
  const formData = new FormData();
  formData.append("myfile", fileInput.files[0]);

  progressContainer.style.display = "block";

  const xhr = new XMLHttpRequest();

  xhr.upload.onprogress = function (event) {
    const percent = Math.round((100 * event.loaded) / event.total);
    progressPercent.innerText = percent;
    const scaleX = `scaleX(${percent / 100})`;
    bgProgress.style.transform = scaleX;
    progressBar.style.transform = scaleX;
  };

  xhr.upload.onerror = function () {
    showToast(`Error in upload: ${xhr.status}.`);
    fileInput.value = "";
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      onFileUploadSuccess(xhr.responseText);
    }
  };

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const onFileUploadSuccess = (res) => {
  fileInput.value = "";
  status.innerText = "Uploaded";
  const submitBtn = emailForm.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.removeAttribute("disabled");
    submitBtn.innerText = "Send";
  }
  progressContainer.style.display = "none";

  const { file: url } = JSON.parse(res);
  sharingContainer.style.display = "block";
  fileURL.value = url;
};

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const submitBtn = emailForm.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.setAttribute("disabled", "true");
    submitBtn.innerText = "Sending";
  }

  const url = fileURL.value;
  const formData = {
    uuid: url.split("/").pop(),
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };

  fetch(emailURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        showToast("Email Sent");
        sharingContainer.style.display = "none";
      } else {
        showToast(data.error || "Failed to send email");
        if (submitBtn) {
          submitBtn.removeAttribute("disabled");
          submitBtn.innerText = "Send";
        }
      }
    })
    .catch(() => {
      showToast("Failed to send email");
      if (submitBtn) {
        submitBtn.removeAttribute("disabled");
        submitBtn.innerText = "Send";
      }
    });
});

let toastTimer;
const showToast = (msg) => {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
};
