const API_URL = 'https://api.jsonbin.io/v3/b/61a5ff2801558c731ccb769f',
      API_KEY = '$2b$10$n5D6fyvlqrvS00B/Icmir.Rl7YkX6E8YTw3qjTW2ns8Mmb41EFa2a'

window.addEventListener('load', async () => {
    if('serviceWorker' in navigator){
        try {
            await navigator.serviceWorker.register('serviceworker.js');
        } catch(err) {
            console.error('Whooopsie!', err)
        }
    }
});

const App = {
    todos: [],
    el: {
        button: document.querySelector('button'),
        todos: document.querySelector('.todos'),
        input: document.querySelector('input')
    },
    async addTodo(){
        
        let text = this.el.input.value;
        if(text.length){
            
            this.todos.push({
                id: parseInt(this.todos.length +1),
                text: text,
                done: false
            })

            await this.setData();
        }
    },
    render(){
        this.el.todos.innerHTML = '';

        this.todos.forEach(todo => {
            this.el.todos.insertAdjacentHTML('beforeend', `<li>${todo.text}</li>`)
        })

    },
    async getData(){
        
        if(localStorage.getItem(['todo'])){
            this.todos = JSON.parse(localStorage.getItem('todo')).todos;
            this.render();
        }

        try {

            let resp = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json',
                    'X-Master-Key' : API_KEY
                }
            });

            let data = await resp.json();  
            this.todos = data.record.todos;

        } catch(err) {
            console.error(err)
        }
    },
    async setData(){

        // Add to localStorage
        localStorage.setItem('todo', JSON.stringify({ todos: this.todos }));

        // Put in cloud
        try {

            await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    'X-Master-Key' : API_KEY
                },
                body: JSON.stringify({ todos: this.todos})
            });

        } catch(err) {
            console.error(err);
        }
    },
    async init(){

        this.el.button.addEventListener('click', () => {
            this.addTodo();
            this.el.input.value = '';
            this.render();
        });

        await this.getData();

        this.render();
    }
};

App.init()