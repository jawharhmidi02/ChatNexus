const uploadchange = (function(){
    const fileinput = document.getElementById('fileinput');
    const photocontainer = document.getElementById('photocontainer');
    const file = fileinput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', function(){
        photocontainer.src = reader.result;
    });
})

const clickupload = ( function(){
    const fileinput = document.getElementById('fileinput');
    fileinput.click();
})

const doneupload = (async function(){
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
    function showToast(text) {
        var x = document.getElementById("toast");
        x.innerHTML = text;
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
    const username = getCookie('username');
    const password = getCookie('password');

    if(username==null || username=="" || password==null || password==""){
        showToast("Authentication Error, Going Back...");
        setTimeout(function(){ window.location.href = "../"; }, 3000);
        return;
    }

    const useraccountdata = await axios.get("/api/accounts/byusername/"+username+"&"+password);
    const useraccount = useraccountdata.data;

    if(useraccount==null){
        showToast("Authentication Error, Going Back...");
        setTimeout(function(){ window.location.href = "../"; }, 3000);
        return;
    }
    showToast('Uploading...');

    const fileinput = document.getElementById('fileinput');
    const formData = new FormData();
    formData.append('profilePicture', fileinput.files[0]);

    try {
        const response = await axios.post(`/api/accounts/uploadprofilepicture/${username}&${password}`, formData);
        showToast('uploaded successfully!, Redirecting...');
        setTimeout(function(){ window.location.href = "../chat/"; }, 3000);
    } 
    catch (error) {
        console.error('Error:', error);
        showToast('An error occurred while uploading the profile picture.Try Again!');
    }
})

const myCode = (async function(){
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
    function showToast(text) {
        var x = document.getElementById("toast");
        x.innerHTML = text;
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
    const username = getCookie('username');
    const password = getCookie('password');

    if(username==null || username=="" || password==null || password==""){
        showToast("Authentication error, Try Again!");
        setTimeout(function(){ window.location.href = "../"; }, 3000);
        return;
    }

    const useraccountdata = await axios.get("/api/accounts/byusername/"+username+"&"+password);
    const useraccount = useraccountdata.data;

    if(useraccount==null){
        showToast("Authentication Error, Going Back...");
        setTimeout(function(){ window.location.href = "../"; }, 3000);
        return;
    }
})
