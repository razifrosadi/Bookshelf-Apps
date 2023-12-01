document.addEventListener('DOMContentLoaded', function(){
    // const checkBox = document.getElementById('inputBookIsComplete');
    // const submitButton = document.getElementById('bookSubmit');

    // submitButton.add
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBookShelf();
        
    });
    if (isStorageExist()) {
        loadDataFromStorage();
      }
});

function addBookShelf(){
    const judulBookShelf = document.getElementById('inputBookTitle').value;
    const penulisBookShelf = document.getElementById('inputBookAuthor').value;
    const timestamp = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;
    const generatedID = generateId();
    const bookObject = generatedBookObject(generatedID, judulBookShelf, penulisBookShelf, timestamp,isCompleted, false);
    incompleteBookshelfList.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId(){
    return +new Date();
}

function generatedBookObject(id, task1, task2, timestamp, isCompleted){
    return{
        id,
        task1,
        task2,
        timestamp,
        isCompleted
    }
}

const incompleteBookshelfList = [];
const RENDER_EVENT = 'render-bookShelf';

document.addEventListener(RENDER_EVENT, function(){
    // console.log(incompleteBookshelfList);
    const uncompletedBOOKSHELFList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKSHELFList.innerHTML = '';

    for (const bookshelfItem of incompleteBookshelfList){
        const bookshelfElement = makeBookShelf(bookshelfItem);
        uncompletedBOOKSHELFList.append(bookshelfElement);
    }
});

function makeBookShelf(bookObject){
    const textBookTitle = document.createElement('h3');
    textBookTitle.innerText = bookObject.task1;
    
    const textBookAuthor = document.createElement('p');
    textBookAuthor.innerText = bookObject.task2;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = bookObject.timestamp;
    
    

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textBookTitle, textBookAuthor, textTimestamp);
    container.setAttribute('id', `book shelf ${bookObject.id}`);

    

  
    // return container;
    
    if (bookObject.isCompleted){
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Belum selesai dibaca!'
    

    checkButton.addEventListener('click', function(){
        checkTaskFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = 'Hapus buku!'

    trashButton.addEventListener('click', function(){
        removeTaskFromCompleted(bookObject.id);
    });

    const containerColor = document.createElement('div');
    containerColor.classList.add('action');
    containerColor.append(checkButton, trashButton);

    
    
    // textContainer.append(checkButton, trashButton);
    container.append(containerColor);
}else{
    const checkButton = document.createElement('button');
    checkButton.classList.add('green');
    checkButton.innerText = 'Selesai dibaca!'

    checkButton.addEventListener('click', function(){
        addTaskToCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = 'Hapus buku!'

    trashButton.addEventListener('click', function(){
        removeTaskFromCompleted(bookObject.id);
    });

    const containerColor = document.createElement('div');
    containerColor.classList.add('action');
    containerColor.append(checkButton, trashButton);

    
    
    // textContainer.append(checkButton, trashButton);
    container.append(containerColor);
}
    return container;
}

function addTaskToCompleted (bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    incompleteBookshelfList.splice(bookTarget,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for (const index in incompleteBookshelfList){
        if (incompleteBookshelfList[index].id === bookId){
            return index;
        }
    }

    return -1;
}

function checkTaskFromCompleted(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget === null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function saveData(){
    if (isStorageExist()){
        const parsed = JSON.stringify(incompleteBookshelfList);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF-APP';

function isStorageExist(){
    if (typeof (Storage) === undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null){
        for (const book of data){
            incompleteBookshelfList.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId){
    for(const bookshelfItem of incompleteBookshelfList){
        if (bookshelfItem.id === bookId){
            return bookshelfItem;
        }
    }
    return null;
}

document.addEventListener(RENDER_EVENT, function(){
    const uncompletedBOOKSHELFList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKSHELFList.innerHTML = '';

    const completedBOOKSHELFList = document.getElementById('completeBookshelfList');
    completedBOOKSHELFList.innerHTML = '';

    for (const bookshelfItem of incompleteBookshelfList){
        const bookshelfElement = makeBookShelf(bookshelfItem);
        if(!bookshelfItem.isCompleted)
            uncompletedBOOKSHELFList.append(bookshelfElement);
        
        else 
            completedBOOKSHELFList.append(bookshelfElement);
    }
});

