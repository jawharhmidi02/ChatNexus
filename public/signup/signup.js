function checkIfNumber(event) {
    const regex = new RegExp(/^\d*$/);
    
    if (
        event.key === 'Backspace' || 
        event.key === 'Tab' || 
        event.key === 'Delete' || 
        event.key === 'ArrowLeft' || 
        event.key === 'ArrowRight' ||
        event.key === 'Home' || 
        event.key === 'End' ||
        (event.ctrlKey && (event.key === 'a' || event.key === 'A')) ||
        (event.ctrlKey && (event.key === 'c' || event.key === 'C')) ||
        (event.ctrlKey && (event.key === 'v' || event.key === 'V')) ||
        (event.ctrlKey && (event.key === 'x' || event.key === 'X')) ||
        (event.ctrlKey && (event.key === 'z' || event.key === 'Z'))
    ){
        return;
    }

    if (!regex.test(event.key)) {
        event.preventDefault();
    }
}
function checkConfirmPassword() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmpassword');
    const errorSpan = document.getElementById('confirmpassworderror');
    
    if (password.value !== confirmPassword.value) {
        confirmPassword.parentElement.classList.add("empty")
        errorSpan.style = "display: flex !important";
    } else {
        confirmPassword.parentElement.classList.remove("empty")
        errorSpan.style = "display: none !important";
    }
}
const Mycode = (async function () {
    function showToast() {
        var x = document.getElementById("toast");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length > 0;
    }
    function isValidText(text) {
        const textRegex = /^[a-zA-Z]+$/;
        return textRegex.test(text) && text.length > 0;
    }
    function isValidPassword(password) {
        if (password.length === 0) {
            return "cannot be empty.";
        }
        if (!/[A-Z]/.test(password)) {
            return "must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(password)) {
            return "must contain at least one lowercase letter.";
        }
        if (!/\d/.test(password)) {
            return "must contain at least one number.";
        }
        if (password.length < 8) {
            return "must be at least 8 characters long.";
        }
        return 1;
    }
    const error = document.querySelectorAll(".error");
    const keepme = document.querySelector(".checkbox-wrapper-4 .inp-cbx");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const first_name = document.getElementById("first_name");
    const last_name = document.getElementById("last_name");
    const email = document.getElementById("email");
    const phonenumber = document.getElementById("phonenumber");
    const confirmPassword = document.getElementById('confirmpassword');
    const profile_picture = "../photos/default.png";
    let test = false;
    // First Name
    if (!isValidText(first_name.value)) {
        first_name.parentElement.classList.add("empty");
        error[0].style = "display: flex !important";
        test = true;
    }
    else{
        first_name.parentElement.classList.remove("empty");
        error[0].style = "display: none !important";
    }
    // Last Name
    if(!isValidText(last_name.value)){
        last_name.parentElement.classList.add("empty");
        error[1].style = "display: flex !important";
        test = true;
    }
    else{
        last_name.parentElement.classList.remove("empty");
        error[1].style = "display: none !important";
    }
    // Email
    if(!isValidEmail(email.value)){
        email.parentElement.classList.add("empty");
        error[2].style = "display: flex !important";
        test = true;
    }
    else{
        email.parentElement.classList.remove("empty");
        error[2].style = "display: none !important";
    }
    // Username
    if (username.value.length < 6 || username.value.includes(' ')) {
        username.parentElement.classList.add("empty");
        error[3].style = "display: flex !important";
        test = true;
    }
    else{
        username.parentElement.classList.remove("empty");
        error[3].style = "display: none !important";
    }
    // Phone Number
    if (phonenumber.value.length < 6) {
        phonenumber.parentElement.classList.add("empty");
        error[4].style = "display: flex !important"
        test = true;
    }
    else{
        phonenumber.parentElement.classList.remove("empty");
        error[4].style = "display: none !important"
    }
    // Password
    if (isValidPassword(password.value) != 1) {
        password.parentElement.classList.add("empty");
        error[5].style = "display: flex !important"
        error[5].innerHTML = isValidPassword(password.value);
        test = true;
    }
    else{
        password.parentElement.classList.remove("empty");
        error[5].style = "display: none  !important"
    }
    // Confirm Password
    if (password.value !== confirmPassword.value) {
        confirmPassword.parentElement.classList.add("empty")
        error[6].style = "display: flex !important";
    } else {
        confirmPassword.parentElement.classList.remove("empty")
        error[6].style = "display: none !important";
    }
    if(test){
        return;
    }
    const verifybyusernamedata = await axios.get("/api/users/byusername/"+username.value);
    if(verifybyusernamedata.data != null){
        username.parentElement.classList.add("empty");
        error[3].style = "display: flex !important";
        error[3].innerHTML = "Username Already Exists!";
        test = true;
    }
    else{
        username.parentElement.classList.remove("empty");
        error[3].style = "display: none !important";
        error[3].innerHTML = "Please write a Valid Username!";
    }
    const verifybyemaildata = await axios.get("/api/users/byemail/"+email.value);
    if(verifybyemaildata.data != null){
        email.parentElement.classList.add("empty");
        error[2].style = "display: flex !important";
        error[2].innerHTML = "Email Already Exists!";
        test = true;
    }
    else{
        email.parentElement.classList.remove("empty");
        error[2].style = "display: none !important";
        error[2].innerHTML = "Please write a Valid Email!";
    }
    const verifybyphonenumberdata = await axios.get("/api/users/byphonenumber/"+phonenumber.value);
    if(verifybyphonenumberdata.data != null){
        phonenumber.parentElement.classList.add("empty");
        error[4].innerHTML = "Phone Number Already Exists!";
        error[4].style = "display: flex !important"
        test = true;
    }
    else{
        phonenumber.parentElement.classList.remove("empty");
        error[4].style = "display: none !important";
        error[4].innerHTML = "Please write a Valid Phone!";
    }
    if(!keepme.checked){
        error[7].innerHTML = "Please agree to the terms!";
        error[7].style = "display: flex !important;z-index: -9;";
        test = true;
    }
    else{
        error[7].style = "display: none !important;z-index: -9;";
    }

    if(test){
        return;
    }
    try {

        const body = {
            username: username.value, 
            password: password.value,
            first_name: first_name.value,
            last_name: last_name.value,
            email: email.value,
            phonenumber: phonenumber.value,
            profile_picture: profile_picture,
            is_active: false,
            conversations: []
        };


        await axios.post("/api/accounts/",body);

        document.cookie = "username=; path=/; ";
        document.cookie = "password=; path=/; ";
        var currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        var expires = "expires=" + currentDate.toUTCString();

        document.cookie = "username=" + encodeURIComponent(username.value) + "; path=/; " + expires;
        document.cookie = "password=" + encodeURIComponent(password.value) + "; path=/; " + expires;
    
        showToast();

        setTimeout(function() {
            window.location.href = "./profilepicture.html";
        }, 3000);
    } catch (err) {
        console.log(err);
        error[7].innerHTML = "Error, Please try again!";
        error[7].style = "display: flex !important;z-index: -9;";
    }
})