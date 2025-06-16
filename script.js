let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });


  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');


    span.textContent = task.text;

    const tag = document.createElement('span');
    tag.className = 'category-tag';
    tag.textContent = task.category;

    const color = document.querySelector(`#task-category option[value="${task.category}"]`)?.dataset.color;
    if (color) tag.style.backgroundColor = color;

    span.appendChild(tag);


    span.textContent = task.text;
    span.className = 'task-text';


    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.onclick = () => enableInlineEdit(span, index);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  updateTaskCount();
  updateFilterButtons();
}


function addTask() {
  const input = document.getElementById('task-input');
  const category = document.getElementById('task-category').value;
  const text = input.value.trim();
  if (text !== '') {
    tasks.push({ text, category, completed: false });
    input.value = '';
    saveTasks();
    renderTasks();
  }
}


function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}


function enableInlineEdit(spanEl, index) {
  const container = document.createElement('div');
  container.className = 'edit-container';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = tasks[index].text;
  input.className = 'edit-input';
  input.autofocus = true;

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'save-btn';
  saveBtn.onclick = () => {
    const newText = input.value.trim();
    if (newText !== '') {
      tasks[index].text = newText;
      saveTasks();
      renderTasks();
    }
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'cancel-btn';
  cancelBtn.onclick = () => {
    renderTasks(); // 
  };

  container.appendChild(input);
  container.appendChild(saveBtn);
  container.appendChild(cancelBtn);

  spanEl.replaceWith(container);
}



function setFilter(f) {
  filter = f;
  renderTasks();
}

function updateFilterButtons() {
  document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`filter-${filter}`).classList.add('active');
}

function updateTaskCount() {
  const count = tasks.length;
  const active = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;
  document.getElementById('task-count').textContent = 
    `All: ${count}, Active: ${active}, Completed: ${completed}`;
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}


function saveInlineEdit(inputEl, oldSpan, index) {
  const newText = inputEl.value.trim();
  if (newText !== '') {
    tasks[index].text = newText;
    saveTasks();
  }

  renderTasks(); // re-renders the list with updated span
}


const categoryTag = document.createElement('small');
categoryTag.textContent = ` [${task.category}]`;
categoryTag.style.marginLeft = '10px';
categoryTag.style.fontSize = '12px';
categoryTag.style.color = '#555';

span.appendChild(categoryTag);


renderTasks();
