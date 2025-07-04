const input = document.getElementById('media');
const preview = document.getElementById('file-preview');
const form = document.getElementById("upload-form");
const successMsg = document.getElementById("upload-message");

const MAX_MB = 25;
let selectedFiles = [];

input.addEventListener('change', () => {
  const newFiles = Array.from(input.files);
  for (const f of newFiles) {
    const isDuplicate = selectedFiles.some(existing => existing.name === f.name && existing.size === f.size);
    if (!isDuplicate) selectedFiles.push(f);
  }
  renderPreview();
});

function renderPreview() {
  preview.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const isTooBig = file.size > MAX_MB * 1024 * 1024;

    const row = document.createElement('div');
    row.className = 'file-row';

    const inner = document.createElement('div');
    inner.className = 'file-row-inner';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `${file.name} (${sizeMB} MB)`;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-button';
    deleteBtn.textContent = '❌';
    deleteBtn.setAttribute('data-index', index);
    deleteBtn.setAttribute('aria-label', 'Remove file');
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      selectedFiles.splice(index, 1);
      renderPreview();
    });

    inner.appendChild(nameSpan);
    inner.appendChild(deleteBtn);
    row.appendChild(inner);

    if (isTooBig) {
      const warning = document.createElement('span');
      warning.textContent = 'Too large';
      warning.style.color = 'red';
      warning.style.fontSize = '0.85em';
      row.appendChild(warning);
    }

    preview.appendChild(row);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const hasOversized = selectedFiles.some(file => file.size > MAX_MB * 1024 * 1024);
  if (hasOversized) {
    alert("One or more files are too large. Please remove them before submitting.");
    return;
  }

  const data = new FormData();
  selectedFiles.forEach(file => data.append('media', file));

  fetch('https://backend-2-f0bx.onrender.com/upload', {
    method: 'POST',
    body: data
  })
  .then(response => {
    if (!response.ok) throw new Error("Upload failed");
    successMsg.style.display = 'block';
    selectedFiles = [];
    renderPreview();
  })
  .catch(err => {
    alert("Error uploading files.");
    console.error(err);
  });
});
