document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("media");
  const preview = document.getElementById("file-preview");
  const form = document.getElementById("upload-form");
  const message = document.getElementById("upload-message");

  fileInput.addEventListener("change", () => {
    preview.innerHTML = "";
    Array.from(fileInput.files).forEach((file, i) => {
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
        const files = Array.from(fileInput.files);
        files.splice(i, 1);
        files.forEach(f => dt.items.add(f));
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
    const data = new FormData(form);
    try {
      const res = await fetch("https://backend-2-f0bx.onrender.com/upload", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Upload failed");
      message.style.display = "block";
      preview.innerHTML = "";
      fileInput.value = "";
    } catch (err) {
      console.error(err);
      alert("Something went wrong while uploading.");
    }
  });
});
