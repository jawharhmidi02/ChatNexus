const Mycode = (async function(){
    const signin = document.querySelector(".signin");
    const signup = document.querySelector(".signup");

    signin.onclick = function(){
        window.location.href = "../signin";
    }

    signup.onclick = async function(){
        const username = document.querySelector(".username").value;
        const password = document.querySelector(".password").value;
        const first_name = document.querySelector(".first_name").value;
        const last_name = document.querySelector(".last_name").value;
        const email = document.querySelector(".email").value;
        const phonenumber = document.querySelector(".phonenumber").value;
        const profile_picture = document.querySelector(".profile_picture").value;

        if(first_name==""){
            alert("Write A First Name");
            return;
        }
        if(last_name==""){
            alert("Write A Last Name");
            return;
        }
        if(email==""){
            alert("Write An E-mail");
            return;
        }
        if(phonenumber==""){
            alert("Write A Phone Number");
            return;
        }
        if(username==""){
            alert("Write An Username");
            return;
        }
        if(password==""){
            alert("Write A Password");
            return;
        }
        if(profile_picture==""){
            alert("Write A Profile Picture");
            return;
        }

        const verifybyusernamedata = await axios.get("/api/users/byusername/"+username);
        if(verifybyusernamedata.data != null){
            alert("Username Already Exists");
            return;
        }
        const verifybyemaildata = await axios.get("/api/users/byemail/"+email);
        if(verifybyemaildata.data != null){
            alert("Email Already Exists");
            return;
        }
        const verifybyphonenumberdata = await axios.get("/api/users/byphonenumber/"+phonenumber);
        if(verifybyphonenumberdata.data != null){
            alert("Phone Number Already Exists");
            return;
        }
        try {
            const body = {
                username: username, 
                password: password,
                first_name: first_name,
                last_name: last_name,
                email: email,
                phonenumber: phonenumber,
                profile_picture: profile_picture,
                is_active: false,
                conversations: ['']
            };


            await axios.post("/api/accounts/",body);

            alert("Signup Successfully");
            window.location.href = "../signin";
        } catch (error) {
            console.log(error);
            alert("Signup Failed");
        }
    }
})


Mycode();