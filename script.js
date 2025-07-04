const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const form = document.getElementById("uploadForm");
const successMsg = document.getElementById("successMsg");

let selectedFiles = [];

fileInput.addEventListener("change", () => {
  const files = Array.from(fileInput.files);
  preview.innerHTML = "";
  selectedFiles = [];

  files.forEach((file) => {
    if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
      selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!selectedFiles.length) return alert("Please select a file");

  const formData = new FormData();
  for (const file of selectedFiles) {
    formData.append("file", file);
  }

  try {
    const res = await fetch("https://backend-2-f0bx.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    console.log("Uploaded File ID:", data.file_id || data);
    successMsg.textContent = "Upload successful!";
    successMsg.style.display = "block";
  } catch (err) {
    console.error("Error:", err);
    successMsg.textContent = "Upload failed.";
    successMsg.style.color = "red";
    successMsg.style.display = "block";
  }
});