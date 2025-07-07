document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("media");
  const preview = document.getElementById("file-preview");
  const form = document.getElementById("upload-form");
  const message = document.getElementById("upload-message");
  const submitButton = form.querySelector('button[type="submit"]');

  const fileRows = new Map(); // Map filename to status element

  fileInput.addEventListener("change", () => {
    message.style.display = "none";
    preview.innerHTML = "";
    fileRows.clear();

    Array.from(fileInput.files).forEach((file) => {
      const row = document.createElement("div");
      row.className = "file-row";

      const rowInner = document.createElement("div");
      rowInner.className = "file-row-inner";

      const name = document.createElement("span");
      name.textContent = file.name;

      const status = document.createElement("span");
      status.className = "delete-button";
      status.innerHTML = "&times;";
      status.onclick = () => {
        const dt = new DataTransfer();
        const targetName = file.name;
        Array.from(fileInput.files).forEach(f => {
          if (f.name !== targetName) dt.items.add(f);
        });
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event("change"));
      };

      rowInner.appendChild(name);
      rowInner.appendChild(status);
      row.appendChild(rowInner);
      preview.appendChild(row);
      fileRows.set(file.name, status);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const files = Array.from(fileInput.files);
    if (files.length === 0) return;

    message.style.display = "none";
    submitButton.disabled = true;

    // Disable all delete buttons
    fileRows.forEach((status) => {
      status.onclick = null;
      status.style.pointerEvents = "none";
    });

    for (let file of files) {
      const data = new FormData();
      data.append("media", file);

      const status = fileRows.get(file.name);

      try {
        const res = await fetch("https://backend-2-f0bx.onrender.com/upload", {
          method: "POST",
          body: data,
        });

        if (!res.ok) throw new Error("Upload failed");

        status.textContent = "✓";
        status.style.color = "green";
      } catch (err) {
        status.textContent = "✗";
        status.style.color = "red";
        console.error(err);
      }
    }

    fileInput.value = "";
    submitButton.disabled = false;
    message.style.display = "block";
  });
});
