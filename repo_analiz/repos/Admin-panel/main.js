console.log(active_count.textContent.slice(2));

if (!!window.localStorage.getItem(`users`)) {
    console.log('main if');
    page_user = JSON.parse(localStorage.getItem('users')).splice(0,10)
    get.getLokalStorage()
}
else{
    get.setDefaultUsers()
    emptyIdlist = []
    window.localStorage.setItem('emptyIdlist',JSON.stringify(emptyIdlist))
}

get.setPagecount()
all_count.innerHTML = `/&nbsp;${window.localStorage.getItem('all_count')}`; 
