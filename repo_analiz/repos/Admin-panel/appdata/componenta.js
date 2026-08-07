

// Asosiy buttonlar
const new_user = document.getElementsByClassName('btn-success')[0]
const search_input = document.getElementsByClassName('form-control')[0]
const save_change = document.getElementsByClassName('btn-primary')[0]
const full_name_input = document.getElementsByClassName('form-control')[1]
let radio_list = document.querySelectorAll('.custom-radio .custom-control-input')

// Qo'shimcha o'zgaruvchilar
let btn_test = false


let row_index = 1
let maxId = parseInt(window.localStorage.getItem('maxId')) || 1
let emptyIdlist = JSON.parse(window.localStorage.getItem('emptyIdlist')) || []
let users = JSON.parse(window.localStorage.getItem('users')) || []
let index_user = 1
let current_li = 1;
let page_user;
const all_count = document.getElementById('all-count')
const active_count = document.getElementById('active-count')
const checked_count = document.getElementById('check-count')

function tablerun(tr,id){
    tr.children[0].children[0].children[0].addEventListener('click',(event) =>{
        if(tr.children[0].children[0].children[0].checked){
            checked_count.innerHTML = `/&nbsp${Number(checked_count.innerText.slice(2)) + 1}`
        }else{
            if(Number(checked_count.innerText.slice(2))> 0){
                checked_count.innerHTML = `/&nbsp${Number(checked_count.innerText.slice(2)) - 1}` 
            }
        }
    })

    tr.children[4].children[0].children[0].addEventListener('click',(event) =>{
        row_index = id
        const user = JSON.parse(window.localStorage.getItem(`user_${id}`))
        let inputlar = get.getFormInputs()
        inputlar[0].value = user.full_name
        inputlar[1].value = user.user_name
        inputlar[2].value = user.email
        inputlar[3].value = user.bio
        inputlar[4].value = user.password
        
        const blog_notf = document.querySelector('#notifications-blog')
        const news_notf = document.querySelector('#notifications-news')
        const offer_notf = document.querySelector('#notifications-offers')
        
        blog_notf.checked = user.notification.posts
        news_notf.checked = user.notification.newsletter
        offer_notf.checked = user.notification.personalOffer
        btn_test = true
        setLabel('','Current Password')
    })
    tr.children[4].children[0].children[1].addEventListener('click',(event) =>{
        if(!emptyIdlist.includes(id)){
            emptyIdlist.push(id)
            window.localStorage.setItem('emptyIdlist',JSON.stringify(emptyIdlist))
        }
        all_count.innerHTML = `/&nbsp;${parseInt(all_count.innerText.slice(2)) - 1}`
        
        if(JSON.parse(window.localStorage.getItem(`user_${id}`)).status) active_count.innerHTML = `/&nbsp;${Number(active_count.innerText.slice(2)) - 1}`
        localStorage.setItem('all_count',all_count.innerText.slice(2))
        localStorage.removeItem(`user_${id}`)
        users = JSON.parse(localStorage.getItem('users'))
        users.splice(users.indexOf(id),1)
        localStorage.setItem('users',JSON.stringify(users))
        tr.remove()
    })

    tr.children[3].children[0].addEventListener('click',(event) =>{
        let arr = Array.from(tr.children[3].children[0].classList)
        const user = JSON.parse(window.localStorage.getItem(`user_${id}`))
        let status ;
        if(arr.at(-1) == 'fa-toggle-off'){
            status = true
            active_count.innerHTML = `/&nbsp;${Number(active_count.innerText.slice(2)) + 1}`
            tr.children[3].children[0].classList.remove('fa-toggle-off')
            tr.children[3].children[0].classList.add('fa-toggle-on')
        }
        else{
            status = false
            tr.children[3].children[0].classList.remove('fa-toggle-on')
            tr.children[3].children[0].classList.add('fa-toggle-off')
            active_count.innerHTML = `/&nbsp;${Number(active_count.innerText.slice(2)) - 1}`
        }
        user.status = status
        window.localStorage.setItem(`user_${id}`,JSON.stringify(user))
    })
}
