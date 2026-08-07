search_input.addEventListener('keyup',(event) =>{
    if (event.key == 'Enter') {
        get.filterRun(5,search_input.value)
    }
})


function setLabel(disp,text) {
    Array.from(document.getElementsByClassName('form-group')).forEach((div, i) =>{
        if(i > 5){
            div.children[0].style.display = disp
            div.children[1].style.display = disp
        }
        if(i == 5){
            div.children[0].innerHTML = text
        }
    })
}

class Validadtion {
    constructor(parameters) {
        this.params = parameters
    }
    testTwoPass(password,currentPassword){
        if(password == currentPassword){
            return true
        }
        else{
            alert('TestTwoPass ; ', true);
            return false
        }
    }
    testName(name = ''){
        if(/^[a-zA-Z]{6,25}$/.test(name.split(' ')) && 
            name.split(' ')[0][0] == name.split(' ')[0][0].toUpperCase() && 
            name.split(' ')[1][0] == name.split(' ')[1][0].toUpperCase()){
            return true
        }
        else{
            alert('Test fullname false')
            return false
        }
    }
    testEmail(email = '') {
        if(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(email)){
            return true
        }
        else{
            alert('Test Email false');
            return false
        }        
    }
    testPassword(password = ''){
        if(/^[\w\W]{8,16}$/.test(password)){
            return true
        }else{
            alert('TestPasssword false');
            return false
        }
    }
    
}
class User {
    #user_name; 
    #password;  

    constructor(id, full_name, user_name,email,  password, status, bio, notification,creation_date) {

        this.id = id
        this.full_name = full_name;
        this.#user_name = user_name;
        this.email = email;
        this.#password = password;
        this.status = status;
        this.bio = bio;
        this.notification = notification;
        this.creation_date = creation_date
        try {
            if(+window.localStorage.getItem('maxId') < id){
                window.localStorage.setItem('maxId',JSON.stringify(id))
            }
            window.localStorage.setItem(`user_${id}`,
            JSON.stringify({id, full_name,  user_name, email,   password,  status,  bio,  notification, creation_date}))

            all_count.innerHTML = `/&nbsp;${Number(all_count.innerText.slice(2)) + 1}`
            users.push(id)
            window.localStorage.setItem('all_count',all_count.innerText.slice(2))
            window.localStorage.setItem('users',JSON.stringify(users.sort((a,b) => a - b)))

        } catch (error) {
        }
    }

    getUserName() {
        return this.#user_name;
    }

    getPassword() {
        return this.#password;
    }

    setPassword(newPassword) {
        this.#password = newPassword;
    }
}

class Table {
    constructor() {
        this.tbody = document.getElementsByTagName('tbody')[0];
    }

    getRows() {
        return Array.from(this.tbody.children);
    }

    getChekIdlist() {
        if (!this.getRows()) {
            return [0];
        }
        return this.getRows().map((tr) => {
            return parseInt(tr.children[0].children[0].children[0].id.split('-').at(-1));
        });
    }

    getChekedlist() {
        if (!this.getRows()) {
            return [0];
        }
        return this.getRows().filter((tr) => {
            return (tr.children[0].children[0].children[0].checked) ? 1 : 0
        });
    }

    createTr(name, date, isActive, id) {
        const tr = document.createElement('tr');
        
        const tdCheckbox = this.createTd('align-middle');
        const divCheckbox = this.createDiv(['custom-control', 'custom-control-inline', 'custom-checkbox', 'custom-control-nameless', 'm-0', 'align-top']);
        const inputCheckbox = this.createInputCheckBox(id);
        const labelCheckbox = document.createElement('label');
        labelCheckbox.classList.add('custom-control-label');
        labelCheckbox.setAttribute('for', `item-${id}`);
        
        divCheckbox.appendChild(inputCheckbox);
        divCheckbox.appendChild(labelCheckbox);
        tdCheckbox.appendChild(divCheckbox);
        tr.appendChild(tdCheckbox);

        tr.appendChild(this.createTd('text-nowrap align-middle', name));

        const tdDate = this.createTd('text-nowrap align-middle');
        const spanDate = document.createElement('span');
        spanDate.textContent = date;
        tdDate.appendChild(spanDate);
        tr.appendChild(tdDate);

        const tdStatus = this.createTd('text-center align-middle');
        this.statusIcon = document.createElement('i'); // `this.statusIcon`ga tayinlash
        this.statusIcon.classList.add('fa', 'fa-fw', 'text-secondary', 'cursor-pointer', isActive ? 'fa-toggle-on' : 'fa-toggle-off');
        tdStatus.appendChild(this.statusIcon);
        tr.appendChild(tdStatus);

        const tdActions = this.createTd('text-center align-middle');
        const divBtnGroup = this.createDiv(['href-group', 'align-top']);
        
        this.editBtn = this.createButton('Edit', ['edit_btn','href', 'href-sm', 'edit-href', 'href-outline-secondary', 'badge'], {
            'data-toggle': 'modal',
            'data-target': '#user-form-modal'
        });
        
        this.deleteBtn = this.createButton('', ['href', 'href-sm', 'href-outline-secondary', 'badge']);
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa', 'fa-trash');
        deleteIcon.textContent = ''
        this.deleteBtn.appendChild(deleteIcon);
        
        divBtnGroup.appendChild(this.editBtn);
        divBtnGroup.appendChild(this.deleteBtn);
        tdActions.appendChild(divBtnGroup);
        tr.appendChild(tdActions);
        
        if(isActive) active_count.innerHTML = `/&nbsp;${Number(active_count.innerText.slice(2))+1}`

        return tr;
    }

    createTd(className, textContent = '') {
        const td = document.createElement('td');
        td.className = className;
        td.textContent = textContent;
        return td;
    }

    createDiv(classList) {
        const div = document.createElement('div');
        div.classList.add(...classList);
        return div;
    }

    createInputCheckBox(id) {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.classList.add('custom-control-input');
        input.id = `item-${id}`;
        return input;
    }

    createButton(text, classList, attributes = {}) {
        const button = document.createElement('button');
        button.classList.add(...classList);
        button.textContent = text;
        for (const key in attributes) {
            button.setAttribute(key, attributes[key]);
        }
        return button;
    }

    addRow(name, date, isActive, id) {
        try {
            const tr = this.createTr(name, date, isActive, id);
            this.tbody.appendChild(tr);
            tablerun(tr, id);
            return tr;
        } catch (error) {
        }
    }


}
"<i class=\"fa fa-fw text-secondary cursor-pointer fa-toggle-off\">…</i>"
const table = new Table()
class Getter {
    constructor() {
        
    }
    setDefaultUsers(){
        if(this.getTbody().length == 0){
    
            let default_users = [
                new User(1, "Ali Valiyev",       "ali_01",     "ali@example.com",      "pass123",    true,  "Developer",  
            
                        { posts: true, newsletter: false, personalOffer: true }, this.getNewDate("2024-04-02")),
                
                new User(2, "Zarina Karimova",   "zarina_k",   "zarina@example.com",   "securePass", false, "Designer",           
                        { posts: false, newsletter: true, personalOffer: false }, this.getNewDate("2024-03-25")),
                
                new User(3, "Bekzod Ergashev",   "bek_ergash", "bekzod@example.com",   "qwerty",     true,  "QA Engineer",        
                        { posts: true, newsletter: true, personalOffer: true }, this.getNewDate("2024-03-15")),
                
                new User(4, "Muhammad Yusuf",    "yusuf_04",   "yusuf@example.com",    "hello123",   false, "Data Scientist",     
                        { posts: false, newsletter: true, personalOffer: true }, this.getNewDate("2024-02-28")),
            
                new User(5, "Shahnoza Qodirova", "shahnoza_q", "shahnoza@example.com", "myPassword", true,  "HR Manager",         
                        { posts: true, newsletter: false, personalOffer: false }, this.getNewDate("2024-02-20")),
            
                new User(6, "Rustam Nabiev",     "rustam_n",   "rustam@example.com",   "admin123",   false, "Cybersecurity Expert", 
                        { posts: false, newsletter: false, personalOffer: true },this.getNewDate("2024-01-10")),
            
                new User(7, "Kamila Ismoilova",  "kamila_ism", "kamila@example.com",   "letMeIn",    true,  "Product Manager",    
                        { posts: true, newsletter: true, personalOffer: false }, this.getNewDate("2024-01-05")),
            
                new User(8, "Jasur Akhmedov",    "jasur_ak",   "jasur@example.com",    "welcome1",   false, "Software Engineer",  
                        { posts: false, newsletter: true, personalOffer: true }, this.getNewDate("2023-12-30")),
            
                new User(9, "Dilnoza Toxtayeva", "dilnoza_t",  "dilnoza@example.com",  "pass456",    true,  "UX/UI Designer",     
                        { posts: true, newsletter: false, personalOffer: true }, this.getNewDate("2023-12-25")),
            
                new User(10, "Sarvar Muminov",   "sarvar_m",   "sarvar@example.com",   "test123",    false, "Marketing Specialist", 
                        { posts: true, newsletter: true, personalOffer: false }, this.getNewDate("2023-12-10")),
                        ...Array.from({ length: 90 }, (_, i) => {
                            const id = i + 11;
                            return new User(
                              id,
                              `User ${id}`,
                              `user_${id}`,
                              `user${id}@example.com`,
                              `password${id}`,
                              id % 2 === 0,
                              `Role ${id}`,
                              {
                                posts: id % 3 === 0,
                                newsletter: id % 4 === 0,
                                personalOffer: id % 5 === 0
                              },
                              this.getNewDate(`2024-01-${(id % 28 + 1).toString().padStart(2, '0')}`)
                            );
                          })     
            ];
            page_user = JSON.parse(localStorage.getItem('users')).splice(0,10)
            this.getLokalStorage()
            }
    }

    getFormInputs() {
        return Array.from(document.getElementsByClassName('form-control')).slice(1);
    }
    getNewDate(date) {
        let newDate = (date) ? new Date(date) : new Date();
        return newDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    getLokalStorage() {
        for(let index of page_user) {
            const user  = JSON.parse(window.localStorage.getItem(`user_${index}`))
            if(user){
                table.addRow(user.full_name,user.creation_date,user.status,user.id)
            }
        } 
    }
    
    getTbody() {
        return  Array.from(document.querySelector('tbody').children)
    }
    getNotif(){
        const blog_notf = document.querySelector('#notifications-blog')
        const news_notf = document.querySelector('#notifications-news')
        const offer_notf = document.querySelector('#notifications-offers')

        return {
            posts:blog_notf.checked,
            newsletter:news_notf.checked,
            personalOffer:offer_notf.checked  
            }
    }
    getTextAll(target = 0){
        let inputs = get.getFormInputs()
        const full_name = inputs[0].value.trim()
        const user_name = inputs[1].value.trim()
        const email =     inputs[2].value.trim()
        const bio =       inputs[3].value.trim()
        const password =  inputs[4].value.trim()
        const new_password =  inputs[5].value.trim()
        const check_password =  inputs[6].value.trim()
        if(target){
            return [full_name, user_name, email, bio, password, new_password, check_password]
        }else{
            return [full_name, user_name, email, bio, password]
        }
    }
    filterRun(key, value) {
        
        const tbody = document.getElementsByTagName('tbody')[0];
        const table = new Table();
        tbody.innerHTML = '';
        checked_count.innerHTML = '/&nbsp0'
        active_count.innerHTML = `/&nbsp;0`

        for (let i of page_user) {
            const user = JSON.parse(window.localStorage.getItem(`user_${i}`));
            if (user) {
                if (key == 5) {
                    if (user.full_name.toUpperCase().includes(value.toUpperCase())) {
                        table.addRow(user.full_name, user.creation_date, user.status, user.id);
                    }
                    continue
                }
                if (value == 'any') {
                    table.addRow(user.full_name, user.creation_date, user.status, user.id);
                    continue
                }                
                if (user[key] == value) {
                    table.addRow(user.full_name, user.creation_date, user.status, user.id);
                }
            }
        }
    }
    setPagecount(){
        all_count.innerHTML = `/&nbsp;${window.localStorage.getItem('all_count')}`; 
        const ul = document.getElementsByClassName('pagination')[0]
        ul.innerHTML = `<li class="prev page-item"><a href="#" class="page-link">‹</a></li>`

        let page_count = Math.ceil(Number(all_count.innerText.slice(2)) / 10)

        for(let i = 1; i <= page_count; i++){
            ul.innerHTML += `<li onclick="get.setpage(event,this)" class="${(i == 1) ? "active": ""} page-item"><a href="#" class="page-link">${i}</a></li>`
        }        
        ul.innerHTML += `<li class="next page-item"><a href="#" class="page-link">›</a></li>`

    }
    setpage(event,li){
        active_count.innerHTML = `/&nbsp;0`

        li.classList.add('active')
        const ul = document.getElementsByClassName('pagination')[0]
        let index = Number(li.lastElementChild.textContent) - 1
        
        ul.children[current_li].classList.remove('active')
        current_li = index + 1
        
        page_user = JSON.parse(localStorage.getItem('users')).splice(index*10, 10)
        document.getElementsByTagName('tbody')[0].innerHTML = ''
        get.getLokalStorage()
        let any = document.getElementById('users-status-any')
        any.checked = true
        search_input.value = ''
    }
}
