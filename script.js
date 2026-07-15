// ---- State ----
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editingId = null;

// ---- DOM Elements ----
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const addBtn = document.getElementById('addBtn');
const notesGrid = document.getElementById('notesGrid');
const searchInput = document.getElementById('searchInput');
const noteCount = document.getElementById('noteCount');
const emptyState = document.getElementById('emptyState');

// ---- Save to LocalStorage ----
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// ---- Render Notes ----
function renderNotes(filter = '') {
  notesGrid.innerHTML = '';

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(filter.toLowerCase()) ||
    n.content.toLowerCase().includes(filter.toLowerCase())
  );

  noteCount.textContent = `${notes.length} note${notes.length !== 1 ? 's' : ''}`;
  emptyState.style.display = notes.length === 0 ? 'block' : 'none';

  filtered.forEach(note => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.content)}</p>
      <span class="meta">${note.date}</span>
      <div class="note-actions">
        <button class="edit-btn" onclick="editNote(${note.id})">✏️ Edit</button>
        <button class="delete-btn" onclick="deleteNote(${note.id})">🗑️ Delete</button>
      </div>
    `;
    notesGrid.appendChild(card);
  });
}

// ---- Add or Update Note ----
addBtn.addEventListener('click', () => {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();

  if (!title || !content) {
    alert('Please fill in both title and note content.');
    return;
  }

  if (editingId) {
    // Update existing note
    const note = notes.find(n => n.id === editingId);
    note.title = title;
    note.content = content;
    note.date = 'Edited: ' + new Date().toLocaleString();
    editingId = null;
    addBtn.textContent = '➕ Add Note';
  } else {
    // Create new note
    notes.unshift({
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleString()
    });
  }

  saveNotes();
  renderNotes(searchInput.value);
  noteTitle.value = '';
  noteContent.value = '';
});

// ---- Edit Note ----
function editNote(id) {
  const note = notes.find(n => n.id === id);
  noteTitle.value = note.title;
  noteContent.value = note.content;
  editingId = id;
  addBtn.textContent = '💾 Update Note';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- Delete Note ----
function deleteNote(id) {
  if (confirm('Delete this note?')) {
    notes = notes.filter(n => n.id !== id);
    saveNotes();
    renderNotes(searchInput.value);
  }
}

// ---- Search ----
searchInput.addEventListener('input', () => {
  renderNotes(searchInput.value);
});

// ---- Escape HTML (basic safety) ----
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Initial Render ----
renderNotes();
