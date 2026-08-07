const tester = new Validadtion()
const get = new Getter()

for(let key of radio_list){
    key.addEventListener('click',(event) =>{
        search_input.value = ''
        const get = new Getter()
        let res = key.id.split('-').at(-1)
        switch (res) {
            case 'any':
                get.filterRun('status','any')
                break;
            case 'active':
                get.filterRun('status',true)
                break;
            case 'disabled':
                get.filterRun('status',false)
                break;
            default:

                break;
        }
    })
}
function createUser(...data) {
    const user = new User(...data)
    table.addRow(data[1],data.at(-1),data[5],data[0])
}

function testSave(event) {
    event.preventDefault();

    notif = get.getNotif()
    creation_date = get.getNewDate()
    if(btn_test){
        updateUser()
    }else{
        maxId = JSON.parse(window.localStorage.getItem('maxId')) + 1
        let [full_name, user_name, email, bio, password, new_password, check_password] = get.getTextAll()

        if(!(tester.testEmail(email) && 
        tester.testPassword(password))){
            return 
        }
        if(emptyIdlist.length > 0) {
            emptyIdlist.sort((a,b) => b - a)
            createUser( emptyIdlist.pop(), full_name, user_name, email, password, false,bio, notif, creation_date)
            localStorage.setItem('emptyIdlist',JSON.stringify(emptyIdlist))
        }else{
            createUser( maxId, full_name, user_name, email, password, false,bio, notif, creation_date)
        }
        // id, f_name, user_name, email, password, status, bio, notification, creation_date
        clearMOdal()
        closeModal()
    }

}


function updateUser() {
    let notif = get.getNotif()
    let [full_name, user_name, email, bio, password, new_password, check_password] = get.getTextAll(true)
    let old_user = JSON.parse(window.localStorage.getItem(`user_${row_index}`))

    if(tester.testEmail(email) && 
       tester.testTwoPass(password, old_user.password))
       {
        if(new_password !== check_password || new_password.length < 6){
            return alert('New Password valid 1')
        }
        try {
            let tr = table.getRows()[row_index - 1]
        
            old_user.full_name = full_name
            old_user.user_name = user_name
            old_user.bio = bio
            old_user.password = new_password
            old_user.notification = notif

            window.localStorage.setItem(`user_${row_index}`,JSON.stringify(old_user))
            tr.children[1].textContent = full_name
            clearMOdal() 
            closeModal()

        } catch (error) {
        }
    }
    else{
        alert('Xatolik')
    }
}

new_user.addEventListener('click',(event) =>{
    btn_test = false
    clearMOdal()
    setLabel('none', 'Password')
})

function clearMOdal() {
    try {
        let inputs = get.getFormInputs();
        inputs.forEach((input) => {
            if (input.type === "checkbox" || input.type === "radio") {
                input.checked = false; 
            } else {
                input.value = '';
            }
        });

    } catch (error) {
    }    
}

function closeModal() {
    var modal = document.getElementById('user-form-modal');
    $(modal).modal('hide');
}


