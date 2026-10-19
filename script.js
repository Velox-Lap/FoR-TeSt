
const memoryList = document.querySelector("#memory-list");
const memoryForm = document.querySelector("#memory-form");
const noteButton = document.querySelector("#note-button");
const noteText = document.querySelector("#note-text");

const STORAGE_KEY = "our-little-world-memories";

const notes = [
  "You make ordinary days feel special. ♡",
  "My favorite memories are the ones we share.",
  "Thank you for being part of my story. ♡",
  "No perfect day is needed when we can enjoy the little things.",
  "Here's to more laughter, adventures, and memories together."
];

function loadMemories() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter(
          (item) =>
            item &&
            typeof item.title === "string" &&
            typeof item.description === "string"
        )
      : [];
  } catch {
    return [];
  }
}

let memories = loadMemories();

function saveMemories() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    return true;
  } catch {
    alert("Unable to save memories in this browser.");
    return false;
  }
}

function renderMemories() {
  memoryList.replaceChildren();

  if (memories.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Your memory box is waiting for its first story. ♡";
    memoryList.append(empty);
    return;
  }

  memories.forEach((memory, index) => {
    const card = document.createElement("article");
    card.className = "memory-card";

    const title = document.createElement("h3");
    title.textContent = memory.title;

    const description = document.createElement("p");
    description.textContent = memory.description;

    const removeButton = document.createElement("button");
    removeButton.className = "primary-button";
    removeButton.type = "button";
    removeButton.textContent = "Delete memory";

    removeButton.addEventListener("click", () => {
      const previous = memories;
      memories = memories.filter((_, i) => i !== index);

      if (saveMemories()) {
        renderMemories();
      } else {
        memories = previous;
      }
    });

    card.append(title, description, removeButton);
    memoryList.append(card);
  });
}

memoryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const titleInput = document.querySelector("#memory-title");
  const descriptionInput = document.querySelector("#memory-description");

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title || !description) return;

  const previous = memories;
  memories = [...memories, { title, description }];

  if (saveMemories()) {
    renderMemories();
    memoryForm.reset();
  } else {
    memories = previous;
  }
});

noteButton.addEventListener("click", () => {
  const currentNote = noteText.textContent;
  const options = notes.filter((note) => note !== currentNote);
  const nextNote = options[Math.floor(Math.random() * options.length)];

  noteText.textContent = nextNote;
  document.querySelector("#note-heart").textContent = "♥";
  noteButton.textContent = "Open another note ♡";
});

renderMemories();
