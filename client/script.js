// get elments
const main = document.querySelector('main');
const input = document.querySelector('#input');
const sendButton = document.querySelector('#sendBtn');
const listToDisplay = document.querySelector('section ul');
const modal = document.querySelector('.modal');
const inputEdit = document.querySelector('#edit');
const confirmBtn = document.querySelector('#confirmEdit');
const cancelBtn = document.querySelector('#cancelEdit');

// variables
let noteUnderEdition = null;

// functions

// create new note
async function createNote(e) {
  e.preventDefault();
  // check if note to store is at least 1 character and is not bigger than 255
  const description = { description: input.value };
  if (
    description.description.length > 0 &&
    description.description.length < 255
  ) {
    try {
      // an object must be sent {description: varchar(255)}
      const response = await fetch('http://localhost:5000/minota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(description),
      });
      await getAllNotes();
      await getAllNotes();
    } catch (error) {
      console.error(error.message);
    }

    input.value = '';
  } else {
    input.placeholder = 'The length of the note is out of limits';
    setTimeout(() => {
      input.placeholder = '';
    }, 1500);
  }
}

/////////////////////////////
/////////////////////////////
/////////////////////////////
// edit a note
async function editNote() {
  const id = noteUnderEdition.minota_id;
  const description = { description: inputEdit.value };

  const updateDescription = async () => {
    try {
      const body = description;
      const response = await fetch(`http://localhost:5000/minota/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      await getAllNotes();
    } catch (error) {
      console.error(error.message);
    }
  };
  updateDescription();
  cancelEdition();
}
///////////////////////////
///////////////////////////
///////////////////////////

// cancel editNote
function cancelEdition() {
  main.classList.remove('doNotUseThis');
  modal.classList.add('hidden');
  noteUnderEdition = null;
}
// get all notes from db, create notes and its buttons and functionality
async function getAllNotes() {
  listToDisplay.innerHTML = '';
  // open edit dialogue
  function openEditModal(note) {
    noteUnderEdition = note;
    inputEdit.value = note.description;
    main.classList.add('doNotUseThis');
    modal.classList.remove('hidden');
    inputEdit.classList.add('active');
  }

  // delete a note
  async function deleteNote({ minota_id }) {
    try {
      const deleteNote = await fetch(
        `http://localhost:5000/minota/${minota_id}`,
        {
          method: 'DELETE',
        }
      );
      getAllNotes();
    } catch (error) {
      console.error(error.message);
    }
  }
  // try to get all notes,
  try {
    const response = await fetch('http://localhost:5000/minota');
    const data = await response.json();

    data.forEach(note => {
      const li = document.createElement('li');
      li.classList.add('li-container');
      const p = document.createElement('p');
      p.textContent = note.description;
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('note-btn-container');
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.classList.add('edit-btn');
      editBtn.classList.add('note-btn');
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.classList.add('del-btn');
      delBtn.classList.add('note-btn');
      buttonContainer.append(editBtn, delBtn);
      li.append(p, buttonContainer);
      listToDisplay.append(li);
      editBtn.addEventListener('click', () => openEditModal(note));
      delBtn.addEventListener('click', () => deleteNote(note));
    });
  } catch (error) {
    console.error(error.message);
  }
}

// event listeners
confirmBtn.addEventListener('click', editNote);
sendButton.addEventListener('click', createNote);
cancelBtn.addEventListener('click', cancelEdition);

// init
getAllNotes();
