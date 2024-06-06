const myLoad = (async function(){
    function getCookie(name) {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) == 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
            }
        }
        return null;
    }

    const usernametest = getCookie("username");
    const passwordtest = getCookie("password");

    if(usernametest!=null && usernametest!="" && passwordtest != null && passwordtest != ""){
        await axios.get("/api/accounts/byusername/"+usernametest+"&"+passwordtest).then(res=>{
            if(res.data!=null){
                window.location.href = "./chat";
            }
        });
    }
    document.body.style.display = "flex";
})
const Mycode = (async function () {
    function identifyText(text) {
        const phonePattern = /^\d+$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/; 
        const usernamePattern = /^[a-zA-Z0-9._%+-]+$/;
    
        if (phonePattern.test(text)) {
            return 'Phone number';
        } else if (emailPattern.test(text)) {
            return 'Email';
        } else if (usernamePattern.test(text)) {
            return 'Username';
        } else {
            return 'Invalid input';
        }
    }
    function showToast() {
        var x = document.getElementById("toast");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
    const login = document.getElementById("login");
    const identifier = document.getElementById("identifier");
    const password = document.getElementById("password");
    const error = document.querySelectorAll(".error");
    const keepme = document.querySelector(".checkbox-wrapper-4 .inp-cbx");
    let test = false;
    if (identifier.value === "" || identifier.value.length < 6) {
        identifier.parentElement.classList.add("empty");
        error[0].style = "display: flex !important";
        test = true;
    }
    else{
        identifier.parentElement.classList.remove("empty");
        error[0].style = "display: none !important";
        
    }

    if (password.value === "" || password.value.length < 6) {
        password.parentElement.classList.add("empty");
        error[1].style = "display: flex !important"
        test = true;
    }
    else{
        password.parentElement.classList.remove("empty");
        error[1].style = "display: none  !important"
    }
    if(test){
        return;
    }

    let data;
    let account;

    switch (identifyText(identifier.value)) {
        case 'Username':
            data = await axios.get("/api/accounts/byusername/"+identifier.value+"&"+password.value);
            account = data.data;
            break;
        case 'Email':
            data = await axios.get("/api/accounts/byemail/"+identifier.value+"&"+password.value);
            account = data.data;
            break;
        case 'Phone number':
            data = await axios.get("/api/accounts/byphonenumber/"+identifier.value+"&"+password.value);
            account = data.data;
            break;
        default:
            identifier.parentElement.classList.add("empty");
            error[0].style = "display: flex !important";    
            return;
    }
    if(account == null){
        identifier.parentElement.classList.add("empty");
        error[0].style = "display: flex !important";
        return;
    }
    var expires = "";
    if(keepme.checked){
        var currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        expires = "expires=" + currentDate.toUTCString();
    }
    document.cookie = "username=" + encodeURIComponent(account.username) + "; path=/; " + expires;
    document.cookie = "password=" + encodeURIComponent(password.value) + "; path=/; " + expires;

    showToast();

    setTimeout(function() {
        window.location.href = "./chat";
    }, 3000);
})