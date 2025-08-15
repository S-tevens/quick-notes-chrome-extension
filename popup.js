const note = document.getElementById("note");
const saveBtn = document.getElementById("save");
const status = document.getElementById("status");
const downloadBtn = document.getElementById("download");

// Load saved note
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["quickNote"], (result) => {
    if (result.quickNote) note.value = result.quickNote;
  });
});

// Save note (manual button click)
saveBtn.addEventListener("click", saveNote);

// Auto-save while typing (debounce to avoid spam saving)
let saveTimeout;
note.addEventListener("input", () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(savedNote, 500);
});

// Save note
function saveNote() {
  chrome.storage.local.set({ quickNote: note.value }, () => {
    status.textContent = "✅ Saved!";
    console.log("saved");
    setTimeout(() => (status.textContent = ""), 1500);
  });
}

//Download as .txt

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([note.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "QuickNote.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  status.textContent = "📥 Downloaded!";
  setTimeout(() => (status.textContent = ""), 1500);
});
