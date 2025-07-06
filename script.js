document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("media");
  const preview = document.getElementById("file-preview");
  const form = document.getElementById("upload-form");
  const message = document.getElementById("upload-message");

  fileInput.addEventListener("change", () => {
    preview.innerHTML = "";
    Array.from(fileInput.files).forEach((file) => {
      const row = document.createElement("div");
      row.className = "file-row";

      const rowInner = document.createElement("div");
      rowInner.className = "file-row-inner";

      const name = document.createElement("span");
      name.textContent = file.name;

      const del = document.createElement("span");
      del.className = "delete-button";
      del.innerHTML = "&times;";
      del.onclick = () => {
        const dt = new DataTransfer();
        const targetName = file.name;
        Array.from(fileInput.files).forEach(f => {
          if (f.name !== targetName) dt.items.add(f);
        });
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event("change"));
      };

      rowInner.appendChild(name);
      rowInner.appendChild(del);
      row.appendChild(rowInner);
      preview.appendChild(row);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const files = Array.from(fileInput.files);
    if (files.length === 0) return;

    message.style.display = "none";
    preview.innerHTML = "";

    for (let file of files) {
      const data = new FormData();
      data.append("media", file);

      const row = document.createElement("div");
      row.className = "file-row";
      row.innerText = `Uploading ${file.name}...`;
      preview.appendChild(row);

      try {
        const res = await fetch("https://backend-2-f0bx.onrender.com/upload", {
          method: "POST",
          body: data,
        });
        if (!res.ok) throw new Error("Upload failed");

        row.innerText = `${file.name} uploaded successfully`;
      } catch (err) {
        row.innerText = `Failed to upload ${file.name}`;
        console.error(err);
      }
    }

    fileInput.value = "";
    message.style.display = "block";
  });
});