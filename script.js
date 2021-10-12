const alert = document.getElementById('alert');
const form = document.querySelector('.general-form');
const enteredInput = document.getElementById('entered-input');
const submitBtn = document.getElementById('submit-button');
const enteredProductText = document.getElementById('entered-product-text');
const editBtn = document.getElementById('edit-button');
const allDeleteBtn = document.getElementById('all-delete-button');
const lists = document.querySelector('.lists');
const listContainer = document.querySelector('.list-container');




// edit options
let editElements;
let editFlag = false;
let editID = "";

//***** EVENT LİSTENERS ******/

// submit form
form.addEventListener("submit",addItem);
allDeleteBtn.addEventListener("click",allDeleteItems);

//load items-1
window.addEventListener("DOMContentLoaded",setupItems);

//***** FUNCTİONS ******/
function addItem(e){
e.preventDefault();
const value = enteredInput.value;
const id = new Date().getTime().toString();

if (value && !editFlag) {
    createListItem(id,value);
    displayAlert("item added to list","success");
    //local storage
    addToLocalStorage(id,value);
    //set back to default
    setBackToDefault();

}else if (value && editFlag) {
    editElements.innerHTML = value;
    displayAlert("value changed","success");
    //edit local storage
    editLocalStorage(editID,value);
    setBackToDefault();
}else{
    displayAlert("empty value", "danger")
}

}

// display alert
function displayAlert(text,action){
    alert.textContent = text;
    alert.classList.add(action)

//remove alert   
setTimeout(function(){
    alert.textContent = "";
    alert.classList.remove(action)
},1000)
}

function setBackToDefault(){
    enteredInput.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent="Submit";

}
//all delete function
function allDeleteItems(){
    const items = document.querySelectorAll(".list");
    if (items.length > 0) {
        items.forEach(item => {
        lists.removeChild(item);
        });  

        displayAlert("empty list","danger");
        listContainer.classList.remove('show');
        
    }
    setBackToDefault();
    localStorage.removeItem("list");
}
//selected delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    lists.removeChild(element);

    if (lists.children.length === 0) {
        listContainer.classList.remove('show');
        displayAlert("empty list","danger");
    }else{
        displayAlert("item successfully deleted","success");
    }
    setBackToDefault();
    //remove from local storage
    removeFromLocalStorage(id);

    
}
//edit item function
function editItem(e) {
    debugger
    const element = e.currentTarget.parentElement.parentElement;
    editElements = e.currentTarget.parentElement.previousElementSibling;
    enteredInput.value = editElements.innerHTML;
    editID = element.dataset.id;
    editFlag = true;
    submitBtn.textContent = "Edit";
}

//***** LOCAL STOREGE ******/
function addToLocalStorage(id,value) {
    const groceryList = {id, value};
    let items = getLocalStorage();
    items.push(groceryList);
    localStorage.setItem("list",JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage(); //filter Del
    items = items.filter(function(item){
        if (item.id !== id) {
            return item;
        }
    })
    localStorage.setItem("list",JSON.stringify(items));
}

function editLocalStorage(id,value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if (item.id === id) {
            item.value = value;
        }
        return item;
    })
    localStorage.setItem("list",JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [] ;
}

//***** SETUP İTEMS ******/

function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function(item) {
            createListItem(item.id,item.value);
        });
    }
   
}

function createListItem(id,value) {
    const element = document.createElement('div');
    //add class
    element.classList.add('list');
    //add id
    const attr = document.createAttribute('data-id');
    attr.value=id;
    element.setAttributeNode(attr);
    element.innerHTML = ` 
    <p id="entered-product">${value}</p>
    <div class="button-container">
        <button class="edit-button"><i class="fas fa-edit"></i></button>
        <button class="delete-button"><i class="fas fa-trash-alt"></i></button>
    </div>
    `
    const deleteBtn = element.querySelector('.delete-button');
    const editBtn = element.querySelector('.edit-button');
    editBtn.addEventListener('click',editItem);
    deleteBtn.addEventListener("click",deleteItem)
    
    //append child
    lists.appendChild(element);
    //show listContainer
    listContainer.classList.add('show');
   
}