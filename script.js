document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("upload-form");
  const input = document.getElementById("media");
  const preview = document.getElementById("file-preview");
  const message = document.getElementById("upload-message");

  input.addEventListener("change", () => {
    preview.innerHTML = "";
    for (const file of input.files) {
      const row = document.createElement("div");
      row.className = "file-row";

      const inner = document.createElement("div");
      inner.className = "file-row-inner";
      inner.innerHTML = `<span>${file.name}</span>`;

      const del = document.createElement("button");
      del.className = "delete-button";
      del.innerHTML = "&times;";
      del.onclick = () => {
        const dt = new DataTransfer();
        for (const f of input.files) {
          if (f !== file) dt.items.add(f);
        }
        input.files = dt.files;
        row.remove();
      };

      inner.appendChild(del);
      row.appendChild(inner);
      preview.appendChild(row);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const res = await fetch("https://backend-2-f0bx.onrender.com/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Upload failed");

      message.style.display = "block";
      input.value = "";
      preview.innerHTML = "";
    } catch (err) {
      alert("There was an error uploading your files.");
      console.error(err);
    }
  });
});
