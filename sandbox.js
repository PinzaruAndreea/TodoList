let todoitem = document.querySelectorAll(".flex-item");
const newItem = document.querySelector(".new_list");
const list = document.querySelector(".list-items");
const search = document.querySelector(".search_button");
const button = document.querySelector("button");

var firebaseConfig = {
    apiKey: "AIzaSyCVC1981N0Zoqaq0k0qDh8AxsA1QfiQa6M",
    authDomain: "javascript-cbb73.firebaseapp.com",
    projectId: "javascript-cbb73",
    storageBucket: "javascript-cbb73.appspot.com",
    messagingSenderId: "746364085870",
    appId: "1:746364085870:web:cd9982b7999653b56d287f",
    measurementId: "G-G9MFDXZ79H"
  };
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


const addItem = (item, id) => {
    let html = `
        <li class= flex-item data-id="${id}">
            <span>${item.Today}</span>
            <i class="far fa-trash-alt delete"></i>
        </li>
    `;
    list.innerHTML += html;

};


const deleteItem = (id) => {    
    const childrenofList = list.children;
    if(childrenofList.length === 0){
        return;
    }else{
            let i = 0;
            while(i<childrenofList.length){
                if (childrenofList[i].getAttribute("data-id") === id){
                    childrenofList[i].remove();
                }
                i += 1;
            }
        }
    }

const unsub = db.collection('TodoList').onSnapshot(snapshot => {
    console.log(snapshot.docChanges());
      snapshot.docChanges().forEach(change => {
          const doc = change.doc;
          if(change.type === "added") {
              addItem(doc.data(), doc.id);   
          } else if (change.type === "removed"){
                deleteItem(doc.id);
          }
      })
  });



newItem.addEventListener("submit", e=> {
    e.preventDefault();

    const TodoList = {
         Today: newItem.add.value
    };

    db.collection("TodoList").add(TodoList).then(() =>{
        console.log("recipe added");
    }).catch(err => {
        console.log(err);
    });

    newItem.reset();
});


list.addEventListener("click", e => {
    if(e.target.classList.contains("delete")){
        const id = e.target.parentElement.getAttribute("data-id");
        db.collection("TodoList").doc(id).delete().then(() =>{
            console.log("recipe deleted");
        }).catch(err => {
            console.log(err);
        });
    }
});

const filterTodos = (term) => {
    Array.from(list.children)
    .filter((todo) => !todo.textContent.toLowerCase().includes(term))
    .forEach((todo) =>todo.classList.add("filtered"))

    Array.from(list.children)
    .filter((todo) => todo.textContent.toLowerCase().includes(term))
    .forEach((todo) =>todo.classList.remove("filtered"))
};

search.addEventListener("keyup", () => {
    const term = search.value.trim().toLowerCase();
    filterTodos(term);
});

button.addEventListener("click", ()=>{
    unsub();
    console.log("unsubscribed from collection changes");
});


