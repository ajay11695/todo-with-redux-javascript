let inputText = document.querySelector(`input[type='text']`);
let searchItem = document.querySelector(`input[type='search']`);
let root = document.querySelector(".todosList");
let store = Redux.createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
let allTodos=store.getState()
let actionbtn='All'


function handleBtn(value){
    switch(true){
        case value==='All':
           actionbtn='All'
        return store.dispatch({type:'handleAll'})
        case value==='Active':
           actionbtn='Active'
        return store.dispatch({type:'handleActive'})
        case value==='Completed':
           actionbtn='Completed'
        return store.dispatch({type:'handleCompleted'})
        case value==='Clear completed':
        return store.dispatch({type:'handleClear'})
   }
}

function handleToggle(state,event) {
    let id = event.target.dataset.id;
    state=JSON.parse(localStorage.getItem('allTodos'))
    state = state.map((todo) =>
        todo.id === Number(id) ? { ...todo, isDone: !todo.isDone } : todo
    );
    localStorage.setItem("allTodos", JSON.stringify(state));
    if(actionbtn==='All'){
        return state
    }
    if(actionbtn==='Active'){
        state = state.filter((todo) => todo.isDone===false);
        return state
    }
    if(actionbtn==='Completed'){
        state = state.filter((todo) => todo.isDone===true);
        return state
    }
}

function handleDelete(state,event) {

    let id = event.target.dataset.id;
    state=JSON.parse(localStorage.getItem('allTodos'))
    state = state.filter((todo) =>{
    if(todo.id === Number(id) ){return}
    return todo
    });
    
    localStorage.setItem("allTodos", JSON.stringify(state));
    if(actionbtn==='All'){
        return state
    }
    if(actionbtn==='Active'){
        state = state.filter((todo) => todo.isDone===false);
        return state
    }
    if(actionbtn==='Completed'){
        state = state.filter((todo) => todo.isDone===true);
        return state
    }
}

function handleActive(state) {
    state=JSON.parse(localStorage.getItem('allTodos'))
    state = state.filter((todo) => todo.isDone===false);
    console.log(state)

    return state
}
function handleAll(state) {
    state=JSON.parse(localStorage.getItem('allTodos'))
    return state
}
function handleCompleted(state) {
    state=JSON.parse(localStorage.getItem('allTodos'))
    state = state.filter((todo) => todo.isDone===true);
    return state
}

function handleClear(state){
    state=JSON.parse(localStorage.getItem('allTodos'))
    state = state.filter((todo) =>{
    if(todo.isDone === true ){return}
    return todo
    });
    localStorage.setItem("allTodos", JSON.stringify(state));
    actionbtn='All'
    return state
}


function handleSearch(state,event) {
    console.log(event.target.value);
    let value = event.target.value;
    if (event.keyCode === 13 && value !== "") {
        state = state.filter(todo => todo.name.includes(value))
        event.target.value = '';  
        return state                                                                                                                                                                                  
    }
}

if (allTodos.length > 0) {
    searchItem.addEventListener('keyup',(e)=>{
        store.dispatch({ type: 'handleSearch',event:e })
    })
}

function handleInput(state,event) {
    let value = event.target.value;
    if (event.keyCode === 13 && value !== "") {
        let todo = {
            id: Math.floor(Math.random() * 100),
            name: value,
            isDone: false,
        };
        state.push(todo);
        localStorage.setItem("allTodos", JSON.stringify(state));
        event.target.value = "";
        return state
    }
}

function footerUI(){
    let btnStyle=[ 'text-base','py-1', 'px-4','rounded', 'border-0','font-semibold',
        'bg-violet-300', 'text-violet-700',
        'hover:bg-violet-100']
    let footer = document.createElement("div");
    footer.classList.add("p-2",'flex','justify-between','border');

    let all = document.createElement("button");
    all.innerText = "All";
    all.classList.add(...btnStyle,actionbtn==='All'?'bg-violet-50':'bg-violet-300');

    let active = document.createElement("button");
    active.innerText = "Active";
    active.classList.add(...btnStyle,actionbtn==='Active'?'bg-violet-50':'bg-violet-300');

    let completed = document.createElement("button");
    completed.innerText = "Completed";
    completed.classList.add(...btnStyle,actionbtn==='Completed'?'bg-violet-50':'bg-violet-300');

    footer.append(all, active, completed);
    let allTodo=JSON.parse(localStorage.getItem('allTodos'))
    if (allTodo.find((e) => e.isDone === true)) {
        let clear = document.createElement("button");
        clear.innerText = "Clear completed";
        clear.classList.add(...btnStyle);
        footer.append(clear);
    }
    
    footer.addEventListener('click',(e)=>{
        let value=e.target.outerText
        handleBtn(value)      
    })

    root.append(footer)
}

function createUI(data=allTodos ,rootElm=root){
    root.innerHTML=''
    data.forEach((todo,index)=>{
        let div = document.createElement("div");
        div.classList.add("flex",'px-4','py-2','justify-between');
        let checkbox = document.createElement("input");
        checkbox.classList.add("w-4");
        checkbox.type = "checkbox";
        checkbox.checked = todo.isDone;
        checkbox.addEventListener("input", (e) => {
            store.dispatch({ type: 'handleToggle', event: e })
        });
        checkbox.setAttribute("data-id", todo.id);

        let p = document.createElement("p");
        p.classList.add("text-xl",'font-bold');
        p.innerText = todo.name;
        let div2 = document.createElement("div");
        div2.append(checkbox, p);
        div2.classList.add("flex",'justify-between','w-[40%]');
        let small = document.createElement("small");
        small.innerText = "❌";
        small.setAttribute("data-id", todo.id);
        small.addEventListener("click", (e) => {
            store.dispatch({ type: 'handleDelete', event: e })
        });

        div.append(div2, small);
        rootElm.append(div,document.createElement('hr'));
    })
    if(JSON.parse(localStorage.getItem('allTodos')).length>0){
        footerUI()
    }
}

store.subscribe(()=>{
    allTodos=store.getState()
    createUI(allTodos,root)
})

function reducer(state =JSON.parse(localStorage.getItem('allTodos')) || [], action) {
    switch (action.type) {
        case 'handleSearch':
            return handleSearch(state,action.event);

        case 'handleInput':
           return handleInput(state,action.event);

        case 'handleToggle':
           return handleToggle(state,action.event);

           case 'handleDelete':
              return handleDelete(state,action.event);

        case 'handleAll':
           return handleAll(state);

        case 'handleActive':
           return  handleActive(state);

        case 'handleCompleted':
           return  handleCompleted(state);

        case 'handleClear':
           return  handleClear(state);

        default:
            return state
    }
}

inputText.addEventListener("keyup", (e) => {
    store.dispatch({ type: 'handleInput',event:e })
});

createUI(allTodos,root)
