import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { collection, addDoc, getFirestore, onSnapshot, deleteDoc, doc, updateDoc,query,orderBy,limit,where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDuRKkLMTKOxdYJ9QIfDRHZsB36KbrsCqE",
    authDomain: "fir-assigment-e923c.firebaseapp.com",
    projectId: "fir-assigment-e923c",
    storageBucket: "fir-assigment-e923c.appspot.com",
    messagingSenderId: "97178963752",
    appId: "1:97178963752:web:83d5f2ec0d7312e139ca1d",
    measurementId: "G-TD856XT58T"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const ids = [];

const getTodos = () => {
    onSnapshot(query(collection(db, "todos"),where('status','==','inactive'),orderBy('time','asc'),limit(8)), (data) => {
        data.docChanges().forEach((todo) => {
            console.log('todo-->',todo.doc.id)
            ids.push(todo.doc.id)
            if (todo.type === 'removed') {
                let dtodo = document.getElementById(todo.doc.id);
                if (dtodo) {
                    dtodo.remove()
                }
            } else if (todo.type === 'added') {
                var list = document.getElementById("list");
                list.innerHTML += `
                <li id='${todo.doc.id}'>
                <input class='todo-input' type='text' value='${todo.doc.data().value}' disabled/>
                ${todo.doc.data().time}
                <button onclick='delTodo("${todo.doc.id}")'>Delete</button> 
                <button onclick='editTodo(this,"${todo.doc.id}")'>Edit</button>
                </li>
                `
            }
        })
    });
}

getTodos()


const addTodo = async () => {
    try {
        var todo = document.getElementById("todo");
        var date = new Date()
        const docRef = await addDoc(collection(db, "todos"), {
            value: todo.value,
            time: date.toLocaleString(),
            status: 'active',
        });
        todo.value = ""
    } catch (err) {
        console.log(err)
    }

}

let delTodo = async(id) => {
    await deleteDoc(doc(db, "todos", id));
    console.log("Todo deleted")
}
var edit = false;
async function editTodo(e, id) {

    if (edit) {
        await updateDoc(doc(db, "todos", id), {
            value: e.parentNode.childNodes[1].value
        });
        e.parentNode.childNodes[1].disabled = true;
        e.parentNode.childNodes[1].blur()
        e.parentNode.childNodes[5].innerHTML = "Edit"
        edit = false;
    } else {
        e.parentNode.childNodes[1].disabled = false;
        e.parentNode.childNodes[1].focus()
        e.parentNode.childNodes[5].innerHTML = "Update"
        edit = true;
    }
}


async function deleteAll() {
    var list = document.getElementById("list");
    list.innerHTML = ""
    let arr = []
    for (var i = 0; i < ids.length; i++) {
        arr.push(await deleteDoc(doc(db, "todos", ids[i])))
    }
    Promise.all(arr)
        .then((res) => {
            console.log("All data has been deleted")
        })
        .catch(err => {
            console.log("err")
        })
}



window.addTodo = addTodo;
window.delTodo = delTodo;
window.editTodo = editTodo;
window.deleteAll = deleteAll;