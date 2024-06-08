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
  const username = getCookie('username');
  const password = getCookie('password');

  if(username==null || username=="" || password==null || password==""){
      showToast("Authentication error, Try Again!");
      setTimeout(logout(), 3000);
      return;
  }

  const useraccountdata = await axios.get("/api/accounts/byusername/"+username+"&"+password);
  const useraccount = useraccountdata.data;

  if(useraccount==null){
      showToast("Authentication Error, Going Back...");
      setTimeout(logout(), 3000);
      return;
  }

  username_input.value = useraccount.username;
  first_name.value = useraccount.first_name;
  last_name.value = useraccount.last_name;
  email.value = useraccount.email;
  phonenumber.value = useraccount.phonenumber;
  photocontainer.src = useraccount.profile_picture;
  current_password.value = "";
  password_input.value = "";
  confirmPassword.value = "";
})

const profile_container = document.querySelector(".profile-container");
const change_container = document.querySelector(".change-container");
const delete_container = document.querySelector(".delete-container");
const menucontainer = document.querySelector(".menucontainer");
const error = document.querySelectorAll(".error");
const username_input = document.getElementById("username");
const first_name = document.getElementById("first_name");
const last_name = document.getElementById("last_name");
const email = document.getElementById("email");
const phonenumber = document.getElementById("phonenumber");
const current_password = document.getElementById("current_password");
const password_input = document.getElementById("password");
const confirmPassword = document.getElementById('confirmpassword');
const fileinput = document.getElementById('fileinput');
const photocontainer = document.getElementById('photocontainer');

function showToast(text) {
  var x = document.getElementById("toast");
  x.innerHTML = text;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

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

const logout = (function(){
  document.cookie = "username=; path=/; ";
  document.cookie = "password=; path=/; ";

  window.location.href = "../";
})

const profile = (function(){
  if(window.innerWidth < 644){
    menucontainer.style.display = "none";
  }
  change_container.style.display = "none";
  delete_container.style.display = "none";
  profile_container.style.display = "flex";
})

const deleteaccount = (function(){
  if(window.innerWidth < 644){
    menucontainer.style.display = "none";
  }
  profile_container.style.display = "none";
  change_container.style.display = "none";
  delete_container.style.display = "flex";
})

const change = (function(){
  if(window.innerWidth < 644){
    menucontainer.style.display = "none";
  }
  profile_container.style.display = "none";
  delete_container.style.display = "none";
  change_container.style.display = "flex";
})

const showmenu = (function(){
  profile_container.style.display = "none";
  delete_container.style.display = "none";
  change_container.style.display = "none";
  menucontainer.style.display = "flex";
})

const uploadchange = (function(){
  const file = fileinput.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener('load', function(){
      photocontainer.src = reader.result;
  });
})

const clickupload = ( function(){
  fileinput.click();
})

const saveprofile = (async function(){
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
    error[2].innerHTML = "Please write a valid Email!"
    error[2].style = "display: flex !important";
    test = true;
  }
  else{
    email.parentElement.classList.remove("empty");
    error[2].style = "display: none !important";
  }
  // Username
  if (username_input.value.length < 6 || username_input.value.includes(' ')) {
    username_input.parentElement.classList.add("empty");
    error[3].innerHTML = "Please write a Valid Username!"
    error[3].style = "display: flex !important";
    test = true;
  }
  else{
    username_input.parentElement.classList.remove("empty");
    error[3].style = "display: none !important";
  }
  // Phone Number
  if (phonenumber.value.length < 6) {
    phonenumber.parentElement.classList.add("empty");
    error[4].innerHTML = "Please write a valid Phone!"
    error[4].style = "display: flex !important"
    test = true;
  }
  else{
    phonenumber.parentElement.classList.remove("empty");
    error[4].style = "display: none !important"
  }
  if(test){
    return;
  }

  const username = getCookie('username');
  const password = getCookie('password');

  if(username==null || username=="" || password==null || password==""){
    showToast("Authentication error, Try Again!");
    setTimeout(logout(), 3000);
    return;
  }

  const useraccountdata = await axios.get("/api/accounts/byusername/"+username+"&"+password);
  const useraccount = useraccountdata.data;

  if(useraccount==null){
    showToast("Authentication Error, Going Back...");
    setTimeout(logout(), 3000);
    return;
  }

  if(useraccount.username != username_input.value){
    const verifybyusernamedata = await axios.get("/api/users/byusername/"+username_input.value);
    if(verifybyusernamedata.data != null){
      username_input.parentElement.classList.add("empty");
      error[3].style = "display: flex !important";
      error[3].innerHTML = "Username Already Exists!";
      test = true;
    }
    else{
      username_input.parentElement.classList.remove("empty");
      error[3].style = "display: none !important";
      error[3].innerHTML = "Please write a Valid Username!";
    }
  }

  if(useraccount.email != email.value){
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
  }
  
  if(useraccount.phonenumber != phonenumber.value){
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
  }
  if(test){
    return;
  }
  showToast("Saving, Please wait...");
  try {
    const body = {
      username: username_input.value, 
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      phonenumber: phonenumber.value,
      is_active: true,
    };

    await axios.patch(`/api/accounts/byusername/${username}&${password}`,body);
    error[5].style = "display: none !important;z-index: -9;justify-content: center;";

    var currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    var expires = "expires=" + currentDate.toUTCString();
    
    document.cookie = "username=" + encodeURIComponent(username_input.value) + "; path=/; " + expires;
    
    if(fileinput.files.length > 0){
      await doneupload();
    }
    if(useraccount.username != username_input.value){
      for(let id_conv of useraccount.conversations){
        const conversation = await axios.get("/api/conversations/byid/"+id_conv);
        const conversation_data = conversation.data;
        const conv_members = conversation_data.members;
        const conv_nicknames = conversation_data.nicknames;
        const newArray = conv_members.filter(function (letter) {
          return letter !== username;
        });
        newArray.push(username_input.value);
        if (username in conv_nicknames) {
          conv_nicknames[username_input.value] = conv_nicknames[username]; // Add new key with the same value
          delete conv_nicknames[username];          // Remove the old key
        }
        await axios.patch(`/api/conversations/byid/${id_conv}`, {
          members: newArray,
          nicknames: conv_nicknames
        });
      }
      const data = await axios.get(`/api/messages/bysender/${username}`);
      const msgs = data.data;
      for(let msg of msgs){
        await axios.patch(`/api/messages/byid/${msg._id}`,{sender: username_input.value});
      }
    }

    showToast("Done!");
  } 
  catch (err) {
    console.log(err);
    error[5].innerHTML = "Error, Please try again!";
    error[5].style = "display: flex !important;z-index: -9;justify-content: center;";
  }
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

  const formData = new FormData();
  formData.append('profilePicture', fileinput.files[0]);
  showToast('Profile picture uploading, Wait...');

  try {
    const response = await axios.post(`/api/accounts/uploadprofilepicture/${username}&${password}`, formData);
    showToast('Profile picture uploaded successfully!');
    fileinput.value = '';
  } 
  catch (error) {
    console.error('Error:', error);
    showToast('An error occurred while uploading the profile picture.Try Again!');
  }
})

const change_password = (async function(){
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

  var test = false;

  // Password
  if (isValidPassword(password_input.value) != 1) {
    password_input.parentElement.classList.add("empty");
    error[7].style = "display: flex !important"
    error[7].innerHTML = isValidPassword(password_input.value);
    test = true;
  }
  else{
    password_input.parentElement.classList.remove("empty");
    error[7].style = "display: none  !important"
  }

  // Confirm Password
  if (password_input.value !== confirmPassword.value) {
    confirmPassword.parentElement.classList.add("empty")
    error[8].style = "display: flex !important";
    test = true;
  } else {
    confirmPassword.parentElement.classList.remove("empty")
    error[8].style = "display: none !important";
  } 

  if(test){
    return;
  }

  if(current_password.value != password){
    current_password.parentElement.classList.add("empty");
    error[6].innerHTML = "Password is Wrong!"
    error[6].style = "display: flex !important"
    test = true;
  }
  else{
    current_password.parentElement.classList.remove("empty");
    error[6].style = "display: none !important"
  }

  if(test){
    return;
  }

  showToast("Saving, Please wait...");
  const body = {
    password: password_input.value
  }
  try{
    await axios.patch(`/api/accounts/byusername/${username}&${password}`,body);
    error[9].style = "display: none !important;z-index: -9;justify-content: center;";
    var currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    var expires = "expires=" + currentDate.toUTCString();    
    document.cookie = "password=" + encodeURIComponent(password_input.value) + "; path=/; " + expires;

    showToast("Save Done!");
  }
  catch(err){
    console.log(err);
    error[9].innerHTML = "Error, Please try again!";
    error[9].style = "display: flex !important;z-index: -9;justify-content: center;";
  }
})

const confirm_delete = (async function(){
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
  const username = getCookie('username');
  const password = getCookie('password');

  if(username==null || username=="" || password==null || password==""){
      showToast("Authentication error, Try Again!");
      setTimeout(logout(), 3000);
      return;
  }

  const useraccountdata = await axios.get("/api/accounts/byusername/"+username+"&"+password);
  const useraccount = useraccountdata.data;

  if(useraccount==null){
      showToast("Authentication Error, Going Back...");
      setTimeout(logout(), 3000);
      return;
  }

  showToast("Deleting, Please wait...");
  
  for(let id_conv of useraccount.conversations){
    const conversation = await axios.get("/api/conversations/byid/"+id_conv);
    const conversation_data = conversation.data;
    const conv_nicknames = conversation_data.nicknames;
    
    if (username in conv_nicknames) {
      conv_nicknames[username] = "Deleted User";
    }
    await axios.patch(`/api/conversations/byid/${id_conv}`, {
      nicknames: conv_nicknames
    });
  }
  const data = await axios.get(`/api/messages/bysender/${username}`);
  const msgs = data.data;
  
  for(let msg of msgs){
    await axios.patch(`/api/messages/byid/${msg._id}`,{content: "Deleted", deleted: true});
  }

  const body = {
    profile_picture: '../photos/default.png',
    phonenumber: 'xxxxxxxx', 
    password: 'xx', 
    first_name: 'Deleted', 
    last_name: 'User', 
    email:'xxx',
    conversations: [],
    is_active: false,
    last_time_active: new Date()
  }
  await axios.patch(`/api/accounts/byusername/${username}&${password}`,body);

  showToast("Account Deleted!, Loging out...");
  setTimeout(logout(), 1000);
})