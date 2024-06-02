const Mycode = (async function () {

    

    const singin = document.querySelector(".signin");
    const signup = document.querySelector(".signup");

    signup.onclick = function(){
        window.location.href = "../signup";
    }

    singin.onclick = async function(){
        const username = document.querySelector(".username").value;
        const password = document.querySelector(".password").value;
        if(username==""){
            alert("Write An Username");
            return;
        }
        if(password==""){
            alert("Write A Password");
            return;
        }
        const data = await axios.get("/api/accounts/byusername/"+username+"&"+password);
        const account = data.data;

        if(account==null){
            alert("Wrong authentication!");
            return;
        }

        alert("You Signed In Successfully");

        var currentDate = new Date();

        currentDate.setMonth(currentDate.getMonth() + 1);

        var expires = "expires=" + currentDate.toUTCString();

        document.cookie = "username=" + encodeURIComponent(username) + "; path=/; " + expires;
        document.cookie = "password=" + encodeURIComponent(password) + "; path=/; " + expires;
        window.location.href = "../chat/index.html";
    }
    return;
})

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

    // if(usernametest!=null && usernametest!="" && passwordtest != null && passwordtest != ""){
    //     await axios.get("/api/accounts/byusername/"+usernametest+"&"+passwordtest).then(res=>{
    //         if(res.data!=null){
    //             window.location.href = "../chat/index.html";
    //         }
    //     });
        
    // }
    }
)

Mycode();