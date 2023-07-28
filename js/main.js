// vars

let todoItems = [];
const todoInput = document.querySelector('.todo-input');
const completedTodosDiv = document.querySelector('.completed');
const uncompletedTodosDiv = document.querySelector('.uncompleted')


// Get Todo list on first boot
window.onload = () => {
    let storageTodoItems = localStorage.getItem('todo');
    if(storageTodoItems !== null){
        todoItems = JSON.parse(storageTodoItems)
    };

    render();
};


// Get the content typed into the input
todoInput.onkeyup = ((e) => {
    let value = e.target.value.replace(/^\s+/,"") //Clear the spaces from beginnign
    if(value && e.keyCode === 13){//Enter
        add(value);

        todoInput.value = '';
        todoInput.focus();
    }
});

// Add Todo
function add(text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
        });

    saveAndRender();
}
// Remove todo
function removeTodo(id){
    todoItems = todoItems.filter(todo => todo.id !== Number(id));
    saveAndRender(); 
};

// Mark as completed
function markAsCompleted(id){
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = true;
        };

        return todo
    })

    saveAndRender();
};

// Mark as uncompleted
function markAsUncompleted(id){
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = false;
        }
    return todo;
    })
};
        
    

// Save in localstorage
function save() {
    localStorage.setItem('todo', JSON.stringify(todoItems));
};

// Render 
function render() { 
    let uncompletedTodos = todoItems.filter(item => !item.completed);
    let completedTodos = todoItems.filter(item => item.completed);

    completedTodosDiv.innerHTML = ''
    uncompletedTodosDiv.innerHTML = ''

    if(uncompletedTodos.length > 0){
        uncompletedTodos.forEach(todo =>{
            uncompletedTodosDiv.append(createTodoElement(todo))
        });} else{
             uncompletedTodosDiv.innerHTML = ` <div class='empty'> Nenhuma tafera pendente. </div>`
        };

        if(completedTodos.length > 0){
            completedTodosDiv.innerHTML = `<div class='completed-title'> Completas (${completedTodos.length} / ${todoItems.length}) </div>`
        };

        completedTodos.forEach(todo => {
            completedTodosDiv.append(createTodoElement(todo));
        });


    };

// Save and render
function saveAndRender() {
    save();
    render(); 
}

// Create todo list item
function createTodoElement(todo){
    // Create todo list container
    const todoDiv = document.createElement('div');
    todoDiv.setAttribute('data-id', todo.id);
    todoDiv.className = 'todo-item';

    // Create todo item text
    const todoTextSpan = document.createElement('span');
    todoTextSpan.innerHTML = todo.text;

    //  Checkbox for list
    const todoInputCheckbox = document.createElement('input');
    todoInputCheckbox.type = 'checkbox';
    todoInputCheckbox.checked = todo.completed;
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id);
    }

    // Delete button for list
    const todoRemoveBtn = document.createElement('a');
    todoRemoveBtn.innerHTML = `<i class='bx bxs-trash'></i>`
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id;
        removeTodo(id);
    }

    todoTextSpan.prepend(todoInputCheckbox);
    todoDiv.appendChild(todoTextSpan);
    todoDiv.appendChild(todoRemoveBtn);

    return todoDiv;
}