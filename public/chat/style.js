const myCode = (async function(){

    function timeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        
        const msInSecond = 1000;
        const msInMinute = msInSecond * 60;
        const msInHour = msInMinute * 60;
        const msInDay = msInHour * 24;
        const msInWeek = msInDay * 7;
        const msInMonth = msInDay * 30; // Approximation
        const msInYear = msInDay * 365; // Approximation
    
        const years = Math.floor(diffMs / msInYear);
        const months = Math.floor((diffMs % msInYear) / msInMonth);
        const weeks = Math.floor((diffMs % msInMonth) / msInWeek);
        const days = Math.floor((diffMs % msInWeek) / msInDay);
        const hours = Math.floor((diffMs % msInDay) / msInHour);
        const minutes = Math.floor((diffMs % msInHour) / msInMinute);
        const seconds = Math.floor((diffMs % msInMinute) / msInSecond);
    
        if (years > 0) {
            return years === 1 ? '1 year ago' : `${years} years ago`;
        } else if (months > 0) {
            return months === 1 ? '1 month ago' : `${months} months ago`;
        } else if (weeks > 0) {
            return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
        } else if (days > 0) {
            return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (hours > 0) {
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (minutes > 0) {
            return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else {
            return seconds <= 1 ? 'just now' : `${seconds} seconds ago`;
        }
    }

    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
        const timeString = `${hours}:${minutesStr}${ampm}`;
        return timeString;
    }

    async function loadconv(){
        const conversationid = getUrlParameter('convid');

        if(conversationid==null || conversationid==""){
            return;
        }

        if(conversationid == "newconvo"){
            const newusername = getUrlParameter('username');

            const newuser = await axios.get(`/api/users/byusername/${newusername}`);
            const newuserdata = newuser.data;

            if(newuserdata==null){
                return;
            }

            const conv_photo = document.querySelector(".chatcontainer .conversation .topsection .photo img");

            conv_photo.src = newuserdata.profile_picture;
            conv_photo.alt = "Profile Picture";
    
            const conv_name = document.querySelector(".chatcontainer .conversation .topsection .userdetails .name");
            conv_name.innerHTML = newuserdata.first_name+" "+newuserdata.last_name;
    
            const active = document.querySelector(".chatcontainer .conversation .topsection .userdetails .lastmessage .time");
            const moreinfoactivetime = document.querySelector(".chatcontainer .moreinfo .topsection .activetime .time");
            if(newuserdata.isactive){
                active.innerHTML = "Now";
                moreinfoactivetime.innerHTML = "Now";
            }
            else{
                active.innerHTML = timeAgo(new Date(newuserdata.last_time_active));
                moreinfoactivetime.innerHTML = timeAgo(new Date(newuserdata.last_time_active));
            }
            
            const convcontainer = document.querySelector(".chatcontainer .conversation .middlesection .convcontainer");
    
            convcontainer.innerHTML = '';
    
    
            const moreinfophoto = document.querySelector(".chatcontainer .moreinfo .topsection .photo img");
            moreinfophoto.src = newuserdata.profile_picture;
            moreinfophoto.alt = "Profile Picture";
    
            const moreinfoname = document.querySelector(".chatcontainer .moreinfo .topsection .name");
            moreinfoname.innerHTML = newuserdata.first_name+" "+newuserdata.last_name;
    
            
    
            const chatmembersbutton = document.querySelector(".chatcontainer .moreinfo .bottomsection .chatmembers");
    
            chatmembersbutton.style.display = "none";
            
            
    
            if(displayphone){
                userscontainer.style.display = "none";
            }
        
            const conversationcontainer = document.querySelector(".chatcontainer .conversation .middlesection .convcontainer");

            conversationcontainer.scrollTop = conversationcontainer.scrollHeight;
    
            conv.style.display = "flex";
            firstpage.style.display = "none";
            return ;
        }

        const convv = await axios.get(`/api/conversations/byid/${conversationid}`);
        const convdata = convv.data;

        if(convdata==null){
            return;
        }

        const messages = await axios.get(`/api/messages/byconvid/${conversationid}`)
        const messagedata = messages.data;
        var checkactive = false;
        var membersdata = {}
        var d = [];
        const memberscontainer = document.querySelector(".chatcontainer .moreinfo .bottomsection .members");
        memberscontainer.innerHTML = '';
        for (const member of convdata.members) {
            if (member == username) {
                
                const mmber = document.createElement("div");
                mmber.classList.add("member");
                
                const leftside = document.createElement("div");
                leftside.classList.add("leftside");

                const photo = document.createElement("div");
                photo.classList.add("photo");

                const img = document.createElement("img");
                img.src = useraccount.profile_picture;

                photo.appendChild(img);

                leftside.appendChild(photo);

                const details = document.createElement("div");
                details.classList.add("details");

                const nickname = document.createElement("div");
                nickname.classList.add("nickname");
                if(convdata.nicknames[member] == `${useraccount.first_name} ${useraccount.last_name}`){
                    nickname.innerHTML = "Set Nickname";
                }
                else{
                    nickname.innerHTML = convdata.nicknames[member];
                }

                details.appendChild(nickname)

                const fullname = document.createElement("div");
                fullname.classList.add("fullname");
                fullname.innerHTML = useraccount.first_name+" "+useraccount.last_name;

                details.appendChild(fullname);

                leftside.appendChild(details);
                
                mmber.appendChild(leftside);

                const rightside = document.createElement("div");
                rightside.classList.add("rightside", "target");
                rightside.setAttribute('id',username);
                rightside.innerHTML = `<span id="${username}" class="material-symbols-outlined target">border_color</span>`;

                mmber.appendChild(rightside);

                memberscontainer.appendChild(mmber);

                continue;
            }
            try {
                const res = await axios.get(`/api/users/byusername/${member}`);
                membersdata[member] = res.data;

                const mmber = document.createElement("div");
                mmber.classList.add("member");
                
                const leftside = document.createElement("div");
                leftside.classList.add("leftside");

                const photo = document.createElement("div");
                photo.classList.add("photo");

                const img = document.createElement("img");
                img.src = res.data.profile_picture;

                photo.appendChild(img);

                leftside.appendChild(photo);

                const details = document.createElement("div");
                details.classList.add("details");

                const nickname = document.createElement("div");
                nickname.classList.add("nickname");
                if(convdata.nicknames[member] == `${res.data.first_name} ${res.data.last_name}`){
                    nickname.innerHTML = "Set Nickname"
                }
                else{
                    nickname.innerHTML = convdata.nicknames[member];
                }

                details.appendChild(nickname)

                const fullname = document.createElement("div");
                fullname.classList.add("fullname");
                fullname.innerHTML = res.data.first_name+" "+res.data.last_name;

                details.appendChild(fullname);

                leftside.appendChild(details);
                
                mmber.appendChild(leftside);

                const rightside = document.createElement("div");
                rightside.classList.add("rightside", "target");
                rightside.setAttribute('id',res.data.username);
                rightside.innerHTML = `<span id="${res.data.username}" class="material-symbols-outlined target">border_color</span>`;

                mmber.appendChild(rightside);

                memberscontainer.appendChild(mmber);
                if (membersdata[member].isactive) {
                    checkactive = true;
                }
                if (checkactive == false) {
                    d.push(membersdata[member].last_time_active);
                }
            } catch (error) {
                console.error(`Error fetching data for member ${member}:`, error);
            }
        }

        if(convdata.group){

            const mmber = document.createElement("div");
            mmber.classList.add("member");
            mmber.classList.add("addmemberstyle");
            mmber.classList.add("addmember");
            
            const leftside = document.createElement("div");
            leftside.classList.add("leftside");
            leftside.classList.add("addmember");

            const photo = document.createElement("div");
            photo.classList.add("photo");
            photo.classList.add("addmember");

            const img = document.createElement("img");
            img.src = "https://cdn-icons-png.flaticon.com/512/992/992651.png";
            img.classList.add("addmember");

            photo.appendChild(img);

            leftside.appendChild(photo);

            const details = document.createElement("div");
            details.classList.add("details");
            details.classList.add("addmember");

            const nickname = document.createElement("div");
            nickname.classList.add("nickname");
            nickname.classList.add("addmember");
            nickname.innerHTML = "Add New Member"

            details.appendChild(nickname)


            leftside.appendChild(details);
            
            mmber.appendChild(leftside);

            memberscontainer.appendChild(mmber);
        }


        const conv_photo = document.querySelector(".chatcontainer .conversation .topsection .photo img");

        conv_photo.src = convdata.profile_picture;
        conv_photo.alt = "Profile Picture";

        const conv_name = document.querySelector(".chatcontainer .conversation .topsection .userdetails .name");
        conv_name.innerHTML = convdata.name;

        const moreinfophoto = document.querySelector(".chatcontainer .moreinfo .topsection .photo img");
        moreinfophoto.alt = "Profile Picture";

        const moreinfoname = document.querySelector(".chatcontainer .moreinfo .topsection .name");

        const leaveordeletechat = document.querySelector(".chatcontainer .moreinfo .middlesection .text");
        const leaveordeletechaticon = document.querySelector(".chatcontainer .moreinfo .middlesection .deletespan span")

        if(convdata.group){
            conv_name.innerHTML = convdata.name;
            moreinfophoto.src = convdata.profile_picture;
            moreinfoname.innerHTML = convdata.name;
            leaveordeletechat.innerHTML = "Leave";
            leaveordeletechaticon.innerHTML = "logout";
        }
        else{
            leaveordeletechat.innerHTML = "Delete";
            leaveordeletechaticon.innerHTML = "delete";
            var memberdetail;
            convdata.members.forEach(member => {
                if(member != username){
                    memberdetail = member;
                }
            })
            const member = await axios.get("/api/users/byusername/"+memberdetail);
            const memberdata = member.data;
            conv_name.innerHTML = convdata.nicknames[memberdetail];
            conv_photo.src = memberdata.profile_picture;
            moreinfophoto.src = memberdata.profile_picture;
            moreinfoname.innerHTML =  convdata.nicknames[memberdetail];

        }

        const active = document.querySelector(".chatcontainer .conversation .topsection .userdetails .lastmessage .time");
        const moreinfoactivetime = document.querySelector(".chatcontainer .moreinfo .topsection .activetime .time");
        if(checkactive){
            active.innerHTML = "Now";
            moreinfoactivetime.innerHTML = "Now";
        }
        else{
            d.sort();
            d.reverse();
            left = timeAgo(new Date(d[0]))
            active.innerHTML = left;
            moreinfoactivetime.innerHTML = left;
        }
        
        const convcontainer = document.querySelector(".chatcontainer .conversation .middlesection .convcontainer");

        convcontainer.innerHTML = '';

        if(displayphone){
            userscontainer.style.display = "none";
        }
    
        const conversationcontainer = document.querySelector(".chatcontainer .conversation .middlesection .convcontainer");

        for(let message of messagedata){
            const contx = message.content;
            const time = message.created_at;
            if(message.deleted){
                sendmessage("Deleted", contx, time, convdata)
            }
            else{

                if(message.sender==username){
                    sendmessage("You", contx, time)
                }else{
                    sendmessage(message.sender, contx, time, convdata)
                }
            }
        }

        conversationcontainer.scrollTop = conversationcontainer.scrollHeight;

        conv.style.display = "flex";
        firstpage.style.display = "none";
    }
 
    function getUrlParameter(name) {
        name = name.replace(/[\[\]]/g, "\\$&");
    
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),results = regex.exec(window.location.href);
    
        if (!results){
            return null;
        }   
    
        if (!results[2]) {
            return '';
        }
    
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
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

    function deployevents(){
        if(window.innerWidth<801){
            displayphone = true;
        }

        const searchusersinput = document.querySelector(".userscontainer .searchcontainer .searchinput input");
        const gobacksearchusers = document.querySelector(".userscontainer .searchcontainer .goback");
        const searchresultcontainer = document.querySelector(".userscontainer .searchresultcontainer");
        const chatscontainer = document.querySelector(".userscontainer .chatscontainer");

        gobacksearchusers.addEventListener("click", function(){
            searchusersinput.value = "";
            
            gobacksearchusers.style.display = "none";
            searchresultcontainer.style.display = "none";
            chatscontainer.style.display = "flex";
        })

        let searchTimeout;
        let currentRequest = null;
        
        searchusersinput.addEventListener("keyup", async function(event) {
            event.preventDefault();
            
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            searchTimeout = setTimeout(async function() {
                if (searchusersinput.value == "") {
                    gobacksearchusers.style.display = "none";
                    searchresultcontainer.style.display = "none";
                    chatscontainer.style.display = "flex";
                } else {
                    searchresultcontainer.style.display = "flex";
                    chatscontainer.style.display = "none";
                    gobacksearchusers.style.display = "flex";
                    searchresultcontainer.innerHTML = "";
        
                    if (currentRequest) {
                        currentRequest.cancel();
                    }
        
                    const CancelToken = axios.CancelToken;
                    currentRequest = CancelToken.source();
        
                    try {
                        const sorters = document.createElement("div");
                        sorters.classList.add("sorters");
        
                        const text = document.createElement("div");
                        text.classList.add("text");
                        text.innerHTML = "&nbsp;&nbsp;Users";
        
                        const hr = document.createElement("hr");
        
                        sorters.appendChild(text);
                        sorters.appendChild(hr);
        
                        searchresultcontainer.appendChild(sorters);
        
                        const searchresults = await axios.get(`/api/users/${searchusersinput.value}`, {
                            cancelToken: currentRequest.token
                        });
                        currentRequest = null;
        
                        searchresults.data.forEach(user => {
                            const userinfocontainer = document.createElement("div");
                            userinfocontainer.classList.add("userinfocontainer");
        
                            const photo = document.createElement("div");
                            photo.classList.add("photo");
        
                            const img = document.createElement("img");
                            img.alt = "profile picture";
                            img.src = user.profile_picture;
        
                            const userdetails = document.createElement("div");
                            userdetails.classList.add("userdetails");
        
                            const name = document.createElement("div");
                            name.classList.add("name");
                            name.innerHTML = user.first_name + " " + user.last_name;
        
                            photo.appendChild(img);
                            userinfocontainer.appendChild(photo);
        
                            if (user.username === username) {
                                const lastmessage = document.createElement("div");
                                lastmessage.classList.add("lastmessage");
        
                                const msg = document.createElement("div");
                                msg.classList.add("msg");
                                msg.innerHTML = "You";
        
                                lastmessage.appendChild(msg);
                                userdetails.appendChild(name);
                                userdetails.appendChild(lastmessage);
                            } else if (personalconversation[user.username]) {
                                const lastmessage = document.createElement("div");
                                lastmessage.classList.add("lastmessage");
        
                                const msg = document.createElement("div");
                                msg.classList.add("msg");
                                msg.innerHTML = personalconversation[user.username][1].last_message + " -&nbsp;";
        
                                const time = document.createElement("div");
                                time.classList.add("time");
                                time.innerHTML = timeAgo(new Date(personalconversation[user.username][1].last_message_time));
        
                                lastmessage.appendChild(msg);
                                lastmessage.appendChild(time);
        
                                userdetails.appendChild(name);
                                userdetails.appendChild(lastmessage);
        
                                userinfocontainer.addEventListener("click", function(event) {
                                    const id = personalconversation[user.username][1]._id;
                                    const conversationid = encodeURIComponent(id);
                                    const newUrl = new URL(window.location);
                                    newUrl.searchParams.set('convid', conversationid);
                                    history.pushState(null, '', newUrl);
        
                                    loadconv();
                                });
                            } else {
                                userdetails.appendChild(name);
                                userinfocontainer.addEventListener("click", function(event) {
                                    const newUrl = new URL(window.location);
                                    newUrl.searchParams.set('convid', encodeURIComponent("newconvo"));
                                    newUrl.searchParams.set('username', encodeURIComponent(user.username));
                                    history.pushState(null, '', newUrl);
        
                                    loadconv();
                                });
                            }
        
                            userinfocontainer.appendChild(userdetails);
                            searchresultcontainer.appendChild(userinfocontainer);
                        });
        
                        // For Groups
                        const sorters1 = document.createElement("div");
                        sorters1.classList.add("sorters");
        
                        const text1 = document.createElement("div");
                        text1.classList.add("text");
                        text1.innerHTML = "&nbsp;&nbsp;Groups";
        
                        const hr1 = document.createElement("hr");
        
                        sorters1.appendChild(text1);
                        sorters1.appendChild(hr1);
        
                        searchresultcontainer.appendChild(sorters1);
        
                        console.log(searchresults.data);
                    } catch (error) {
                        if (axios.isCancel(error)) {
                            console.log('Request canceled', error.message);
                        } else {
                            console.error('Error fetching search results:', error);
                        }
                    }
                }
            }, 300);
        });
    
        window.addEventListener('resize', function(){
            if(window.innerWidth<801){
                if(displayphone==false){
                    displayphone = true;
                    deployevents();
                }
            }
            else{
                if(displayphone==true){
                    displayphone = false;
                    deployevents();
                }
            }
        });
        var rotateindex = 1;
        
        gobackmoreinfo.addEventListener("click", function(event){
            moreinfo.classList.toggle("showmoreinfo");
            openmoreinfo.innerHTML = rotatelist[String(rotateindex)];
            rotateindex *= -1;
            messagescontainer.style.display = "flex";
        })
    
        openmoreinfo.addEventListener("click", function(event){
            moreinfo.classList.toggle("showmoreinfo");
            openmoreinfo.innerHTML = rotatelist[String(rotateindex)];
            rotateindex *= -1;
            if(displayphone){
                messagescontainer.style.display = "none";
            }
        })
    
        gotofirstpage.addEventListener("click", function(event){
            const url = new URL(window.location);

            url.searchParams.delete('convid');
            url.searchParams.delete('username');
        
            history.replaceState(null, '', url.toString());
            conv.style.display = "none";
            if(displayphone){
                userscontainer.style.display = "flex";
                return
            }
            firstpage.style.display = "flex";
        })

        const popup = document.getElementById('popup');
        const closePopupBtn = document.getElementById('closePopupBtn');
        const openPopupBtn = document.querySelector('.userscontainer .title .creategroup');
        const creategroupchatscontainer = document.querySelector(".popup-content .content .members .chatscontainer");
        creategroupchatscontainer.innerHTML = '';
        const creategroupbutton = document.querySelector(".popup-content .create input");

        

        var checkedusers;

        creategroupbutton.addEventListener("click", async function(){
            let convmembers = [... checkedusers];
            convmembers.push(username);

            const nicknames = convmembers.reduce((acc, cur) => {
                acc[cur] = cur;
                return acc;
            }, {}) 

            let groupname = document.querySelector(".popup-content .content .details .name input");
            let groupphoto = document.querySelector(".popup-content .content .details .profilepicture input");

            if(groupname.value == ""){
                groupname.classList.add("empty");
                return;
            }
            else{
                groupname.classList.remove("empty");
            }
            if(groupphoto.value == ""){
                groupphoto.classList.add("empty");
                return;
            }
            else{
                groupphoto.classList.remove("empty");
            }

            const newgroupconvo = await axios.post("/api/conversations",{
                name: groupname.value,
                members: convmembers,
                profile_picture: groupphoto.value,
                group: true,
                nicknames: nicknames,
                last_message: `${useraccount.first_name} ${useraccount.last_name} Created this Group!`,
                last_message_time: new Date()
            });
            const newgroupconvodata = newgroupconvo.data;

            await axios.post("/api/messages",{
                conversation_id: newgroupconvodata._id,
                sender: username,
                content: `${useraccount.first_name} ${useraccount.last_name} Created this Group!`,
                created_at: new Date(),
                edited: false,
                reacts: [],
                deleted: false
            })

            socket.emit("new_convo", {
                conversation_id: newgroupconvodata._id,
                members: newgroupconvodata.members,
            });
            popup.style.display = 'none';
        })

        openPopupBtn.addEventListener('click', () => {
            popup.style.display = 'flex';

            checkedusers = new Set();
            

            for(const user in personalconversation){
                const userdata = personalconversation[user][0];

                const userinfocontainer = document.createElement("label");
                userinfocontainer.classList.add("userinfocontainer");

                const photo = document.createElement("div");
                photo.classList.add("photo");

                const img = document.createElement("img");
                img.src = userdata.profile_picture;

                photo.appendChild(img);

                userinfocontainer.appendChild(photo);

                const userdetails = document.createElement("div");
                userdetails.classList.add("userdetails");

                const name = document.createElement("div");
                name.classList.add("name");
                name.innerHTML = userdata.first_name+" "+userdata.last_name;

                userdetails.appendChild(name);

                userinfocontainer.appendChild(userdetails);

                const checkbox = document.createElement("div")
                checkbox.classList.add("checkbox");

                const inputcheckbox = document.createElement("input")
                inputcheckbox.type = "checkbox";
                inputcheckbox.name = "checkbox";
                inputcheckbox.value = userdata.username;
                inputcheckbox.onchange = (function(event){
                    const target = event.target;
                    if(target.checked){
                        checkedusers.add(target.value);
                    }
                    else{
                        checkedusers.delete(target.value);
                    }

                    if(checkedusers.size > 1){
                        document.querySelector(".popup-content .create input").classList.add("notdisabled");
                        document.querySelector(".popup-content .create input").disabled = false;
                    }
                    else{
                        document.querySelector(".popup-content .create input").disabled = true;
                        document.querySelector(".popup-content .create input").classList.remove("notdisabled");
                    }
                });

                const span = document.createElement("span");
                span.classList.add("checkmark");

                checkbox.appendChild(inputcheckbox);
                checkbox.appendChild(span);

                userinfocontainer.appendChild(checkbox);

                creategroupchatscontainer.appendChild(userinfocontainer);

            }

        });
        
        closePopupBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
        

        let searchTimeoutcreategroup;
        let currentRequestcreategroup = null;

        const searchuserscreategroup = document.querySelector(".popup-content .content .members .searchcontainer .searchinput input");

        const searchresultcreategroupcontainer = document.querySelector(".popup-content .content .members .searchresult");


        
        searchuserscreategroup.addEventListener("keyup", async function(event) {
            event.preventDefault();
            
            if (searchTimeoutcreategroup) {
                clearTimeout(searchTimeoutcreategroup);
            }
            
            searchTimeoutcreategroup = setTimeout(async function() {
                if (searchuserscreategroup.value == "") {
                    creategroupchatscontainer.style.display = "flex";
                    searchresultcreategroupcontainer.style.display = "none";
                } else {
                    searchresultcreategroupcontainer.style.display = "flex";
                    creategroupchatscontainer.style.display = "none";
                    searchresultcreategroupcontainer.innerHTML = "";
        
                    if (currentRequestcreategroup) {
                        currentRequestcreategroup.cancel();
                    }
        
                    const CancelToken = axios.CancelToken;
                    currentRequestcreategroup = CancelToken.source();
        
                    try {
        
                        const searchresults = await axios.get(`/api/users/${searchuserscreategroup.value}`, {
                            cancelToken: currentRequestcreategroup.token
                        });
                        currentRequestcreategroup = null;
        
                        searchresults.data.forEach(userdata => {
                            if(userdata.username == username){
                                return;
                            }
                            const userinfocontainer = document.createElement("label");
                            userinfocontainer.classList.add("userinfocontainer");
                
                            const photo = document.createElement("div");
                            photo.classList.add("photo");
                
                            const img = document.createElement("img");
                            img.src = userdata.profile_picture;
                
                            photo.appendChild(img);
                
                            userinfocontainer.appendChild(photo);
                
                            const userdetails = document.createElement("div");
                            userdetails.classList.add("userdetails");
                
                            const name = document.createElement("div");
                            name.classList.add("name");
                            name.innerHTML = userdata.first_name+" "+userdata.last_name;
                
                            userdetails.appendChild(name);
                
                            userinfocontainer.appendChild(userdetails);
                
                            const checkbox = document.createElement("div")
                            checkbox.classList.add("checkbox");
                
                            const inputcheckbox = document.createElement("input")
                            inputcheckbox.type = "checkbox";
                            inputcheckbox.name = "checkbox";
                            inputcheckbox.value = userdata.username;
                            if(checkedusers.has(userdata.username)){
                                inputcheckbox.checked = true;
                            }
                            inputcheckbox.onchange = (function(event){
                                const target = event.target;
                                if(target.checked){
                                    checkedusers.add(target.value);
                                    document.querySelector(`.popup-content .content .members .chatscontainer .userinfocontainer .checkbox input[value=${userdata.username}]`).checked = true;
                                }
                                else{
                                    checkedusers.delete(target.value);
                                    document.querySelector(`.popup-content .content .members .chatscontainer .userinfocontainer .checkbox input[value=${userdata.username}]`).checked = false;
                                }

                                if(checkedusers.size > 1){
                                    document.querySelector(".popup-content .create input").disabled = false;
                                    document.querySelector(".popup-content .create input").classList.add("notdisabled");
                                }
                                else{
                                    document.querySelector(".popup-content .create input").disabled = true;
                                    document.querySelector(".popup-content .create input").classList.remove("notdisabled");
                                }
                            });
                
                            const span = document.createElement("span");
                            span.classList.add("checkmark");
                
                            checkbox.appendChild(inputcheckbox);
                            checkbox.appendChild(span);
                
                            userinfocontainer.appendChild(checkbox);
                
                            searchresultcreategroupcontainer.appendChild(userinfocontainer);
                        })
                    } catch (error) {
                        if (axios.isCancel(error)) {
                            console.log('Request canceled', error.message);
                        } else {
                            console.error('Error fetching search results:', error);
                        }
                    }
                }
            }, 300);
        });

        /* Delete or leave conv */

        const leaveordeletechaticon = document.querySelector(".chatcontainer .moreinfo .middlesection .deletespan span")
        const leavegrouppopup = document.querySelector(".leavegrouppopup");
        const leavegroupbutton = document.getElementById("leavegroup");
        const cancelleavegroupbutton = document.querySelector(".leavegrouppopup .cancelbutton");

        cancelleavegroupbutton.addEventListener("click",function(){
            leavegrouppopup.style.display = "none";
        })

        leavegroupbutton.addEventListener("click",async function(){
            let conversationid = getUrlParameter("convid");
            const convv = await axios.get(`/api/conversations/byid/${conversationid}`);
            const convdata = convv.data;

            document.getElementById(`${conversationid}`).remove();
            let message = `${useraccount.first_name} ${useraccount.last_name} Left the group!`
            let time = new Date();
            socket.emit('message', { username, conversation_id: getUrlParameter('convid'), message, time});
            conv.style.display = "none";
            if(displayphone){
                userscontainer.style.display = "flex";
            }
            else{
                firstpage.style.display = "flex";
            }
            const body = {conversation_id: conversationid, sender: username , content: message, reacts: [], created_at: new Date(), edited: false, deleted: false}
    
            axios.post('/api/messages', body)
            .catch(function (error) {
                console.log(error);
            });

            await axios.patch(`/api/conversations/byid/${conversationid}`,{last_message: message, last_message_time: time});
            const members = convdata.members;
            members.splice(members.indexOf(username), 1);
            await axios.patch(`/api/conversations/byid/${conversationid}`, {members: members});
            socket.emit("leave", {conversation_id: conversationid, username: username});
            leavegrouppopup.style.display = "none";

        })

        leaveordeletechaticon.parentElement.addEventListener("click",async function(event){
            event.preventDefault();
            if(leaveordeletechaticon.innerHTML == "logout"){
                leavegrouppopup.style.display = "flex";
            }
        })

        /* Chat Members */

        const chatmembersbutton = document.querySelector(".chatcontainer .moreinfo .bottomsection .chatmembers");
        const memberscontainer = document.querySelector(".chatcontainer .moreinfo .bottomsection .members");
        chatmembersbutton.addEventListener("click",async function(event){
            event.preventDefault();

            let arrow = chatmembersbutton.querySelector(".material-symbols-outlined");
            if(arrow.innerHTML == "chevron_right"){
                arrow.innerHTML = "keyboard_arrow_down";
            }
            else{
                arrow.innerHTML = "chevron_right";
            }
            
            memberscontainer.classList.toggle("showmoreinfo")
        })

        // Edit nicknames :

        const editnicknamepopup = document.getElementById('editnicknamepopup');
        const editnicknameclosePopupBtn = document.getElementById('editnicknameclosePopupBtn');
        const editnicknamedone = document.querySelector('.editnicknamedone');

        const addmemberpopup = document.getElementById('addmemberpopup');
        const addmemberclosePopupBtn = document.getElementById('addmemberclosePopupBtn');
        const searchresultnewmembercontainer = document.querySelector(".newmember .content .members .searchresult");
        const addmemberdone = document.querySelector('.addmemberdone');
        const newmemberchatscontainer = document.querySelector(".newmember .content .members .chatscontainer");
        newmemberchatscontainer.innerHTML = ""
        const searchusersnewmember = document.querySelector(".newmember .content .members .searchcontainer .searchinput input");

        let searchTimeoutnewmember;
        let currentRequestnewmember = null;

        searchusersnewmember.addEventListener("keyup", async function(event) {
            event.preventDefault();
            
            if (searchTimeoutnewmember) {
                clearTimeout(searchTimeoutnewmember);
            }
            
            searchTimeoutnewmember = setTimeout(async function() {
                if (searchusersnewmember.value == "") {
                    newmemberchatscontainer.style.display = "flex";
                    searchresultnewmembercontainer.style.display = "none";
                } else {
                    searchresultnewmembercontainer.style.display = "flex";
                    newmemberchatscontainer.style.display = "none";
                    searchresultnewmembercontainer.innerHTML = "";
        
                    if (currentRequestnewmember) {
                        currentRequestnewmember.cancel();
                    }
        
                    const CancelToken = axios.CancelToken;
                    currentRequestnewmember = CancelToken.source();
        
                    try {

        
                        const searchresults = await axios.get(`/api/users/${searchusersnewmember.value}`, {
                            cancelToken: currentRequestnewmember.token
                        });
                        const conv = await axios.get(`/api/conversations/byid/${getUrlParameter("convid")}`);
                        const convdata = conv.data;
                        currentRequestnewmember = null;
        
                        searchresults.data.forEach(userdata => {
                            if(userdata.username == username){
                                return;
                            }
                            if(convdata.members.includes(userdata.username)){
                                return;
                            }
                            const userinfocontainer = document.createElement("label");
                            userinfocontainer.classList.add("userinfocontainer");
                
                            const photo = document.createElement("div");
                            photo.classList.add("photo");
                
                            const img = document.createElement("img");
                            img.src = userdata.profile_picture;
                
                            photo.appendChild(img);
                
                            userinfocontainer.appendChild(photo);
                
                            const userdetails = document.createElement("div");
                            userdetails.classList.add("userdetails");
                
                            const name = document.createElement("div");
                            name.classList.add("name");
                            name.innerHTML = userdata.first_name+" "+userdata.last_name;
                
                            userdetails.appendChild(name);
                
                            userinfocontainer.appendChild(userdetails);
                
                            const checkbox = document.createElement("div")
                            checkbox.classList.add("checkbox");
                
                            const inputcheckbox = document.createElement("input")
                            inputcheckbox.type = "checkbox";
                            inputcheckbox.name = "checkbox";
                            inputcheckbox.value = userdata.username;
                            if(checknewmembers.has(userdata.username)){
                                inputcheckbox.checked = true;
                            }
                            inputcheckbox.onchange = (function(event){
                                const target = event.target;
                                if(target.checked){
                                    checknewmembers.add(target.value);
                                    document.querySelector(`.newmember .content .members .chatscontainer .userinfocontainer .checkbox input[value=${userdata.username}]`).checked = true;
                                }
                                else{
                                    checknewmembers.delete(target.value);
                                    document.querySelector(`.newmember .content .members .chatscontainer .userinfocontainer .checkbox input[value=${userdata.username}]`).checked = false;
                                }

                                if(checknewmembers.size > 0){
                                    document.querySelector(".newmember .create input").disabled = false;
                                    document.querySelector(".newmember .create input").classList.add("notdisabled");
                                }
                                else{
                                    document.querySelector(".newmember .create input").disabled = true;
                                    document.querySelector(".newmember .create input").classList.remove("notdisabled");
                                }
                            });
                
                            const span = document.createElement("span");
                            span.classList.add("checkmark");
                
                            checkbox.appendChild(inputcheckbox);
                            checkbox.appendChild(span);
                
                            userinfocontainer.appendChild(checkbox);
                
                            searchresultnewmembercontainer.appendChild(userinfocontainer);
                        })
                    } catch (error) {
                        if (axios.isCancel(error)) {
                            console.log('Request canceled', error.message);
                        } else {
                            console.error('Error fetching search results:', error);
                        }
                    }
                }
            }, 300);
        });

        var checknewmembers;

        addmemberdone.addEventListener("click",async function(){
            const convv = await axios.get(`/api/conversations/byid/${getUrlParameter("convid")}`);
            const convdata = convv.data;
            let newconvmembers = [... checknewmembers];

            const nicknames = newconvmembers.reduce((acc, cur) => {
                acc[cur] = cur;
                return acc;
            }, {}) 
            await axios.patch(`/api/conversations/byid/${getUrlParameter("convid")}`, {members: [ ...convdata.members, ...newconvmembers], nicknames: { ...convdata.nicknames, ...nicknames}});
            let idconv = getUrlParameter('convid');
            let sender = username;
            let message = `${convdata.nicknames[username]} added ${newconvmembers.join(", ")}`;
            let time = new Date();
            await axios.post("/api/messages",{
                conversation_id: idconv,
                sender: sender,
                content: message,
                reacts: [],
                created_at: time,
                edited: false,
                deleted: false
            })
            socket.emit("new_member", { conversation_id: idconv, members: newconvmembers});
            socket.emit('message', { username, conversation_id: getUrlParameter('convid'), message, time});
            const convcontainer = document.getElementById(`${idconv}`)
            convcontainer.querySelector(".time").innerHTML = timeAgo(new Date(time));
            convcontainer.querySelector(".msg").innerHTML = `${message} -&nbsp;`;
            await axios.patch(`/api/conversations/byid/${idconv}`,{last_message: message, last_message_time: time});
            sendmessage('You', message, time);
            loadconv();
            addmemberpopup.style.display = 'none';
        })
        
        addmemberclosePopupBtn.addEventListener("click",()=>{
            addmemberpopup.style.display = 'none';
        })

        editnicknamedone.addEventListener("click",async function(){
            const nickname = document.getElementById("newnicknameinput").value;
            const id = editnicknamedone.getAttribute("id");
            const convv = await axios.get(`/api/conversations/byid/${getUrlParameter("convid")}`);
            const convdata = convv.data;
            const nicknames = convdata.nicknames;
            let old = nicknames[id];
            nicknames[id] = nickname;
            await axios.patch(`/api/conversations/byid/${getUrlParameter("convid")}`, {nicknames: nicknames});
            let idconv = getUrlParameter('convid');
            let sender = username;
            let message = `${convdata.nicknames[username]} edited ${old} to ${nickname}`;
            let time = new Date();
            await axios.post("/api/messages",{
                conversation_id: idconv,
                sender: sender,
                content: message,
                reacts: [],
                created_at: time,
                edited: false,
                deleted: false
            })
            socket.emit('message', { username, conversation_id: getUrlParameter('convid'), message, time});
            const convcontainer = document.getElementById(`${idconv}`)
            convcontainer.querySelector(".time").innerHTML = timeAgo(new Date(time));
            convcontainer.querySelector(".msg").innerHTML = `${convdata.nicknames[username]} edited ${convdata.nicknames[id]} to ${nickname} -&nbsp;`;
            await axios.patch(`/api/conversations/byid/${idconv}`,{last_message: `${convdata.nicknames[username]} edited ${convdata.nicknames[id]} to ${nickname}`, last_message_time: time});
            sendmessage('You', message, time);
            loadconv();
            editnicknamepopup.style.display = 'none';
        })

        memberscontainer.addEventListener("click",async function(event){
            if(event.target.classList.contains("target")){
                const urnm = event.target.id;
                document.getElementById("newnicknameinput").value= "";
                const dt = await axios.get("/api/conversations/byid/"+getUrlParameter("convid"));
                document.getElementById("newnicknameinput").setAttribute("placeholder", dt.data.nicknames[urnm]);
                editnicknamedone.setAttribute("id", event.target.id);
                editnicknamepopup.style.display = 'flex';
            }
            if(event.target.classList.contains("addmember")){
                checknewmembers = new Set();
                const conv = await axios.get(`/api/conversations/byid/${getUrlParameter("convid")}`);
                const convdata = conv.data;
            
    
                for(const user in personalconversation){
                    if(user==username){
                        continue;
                    }
                    if(convdata.members.includes(user)){
                        continue;
                    }
                    const userdata = personalconversation[user][0];
    
                    const userinfocontainer = document.createElement("label");
                    userinfocontainer.classList.add("userinfocontainer");
    
                    const photo = document.createElement("div");
                    photo.classList.add("photo");
    
                    const img = document.createElement("img");
                    img.src = userdata.profile_picture;
    
                    photo.appendChild(img);
    
                    userinfocontainer.appendChild(photo);
    
                    const userdetails = document.createElement("div");
                    userdetails.classList.add("userdetails");
    
                    const name = document.createElement("div");
                    name.classList.add("name");
                    name.innerHTML = userdata.first_name+" "+userdata.last_name;
    
                    userdetails.appendChild(name);
    
                    userinfocontainer.appendChild(userdetails);
    
                    const checkbox = document.createElement("div")
                    checkbox.classList.add("checkbox");
    
                    const inputcheckbox = document.createElement("input")
                    inputcheckbox.type = "checkbox";
                    inputcheckbox.name = "checkbox";
                    inputcheckbox.value = userdata.username;
                    inputcheckbox.onchange = (function(event){
                        const target = event.target;
                        if(target.checked){
                            checknewmembers.add(target.value);
                        }
                        else{
                            checknewmembers.delete(target.value);
                        }
    
                        if(checknewmembers.size > 0){
                            document.querySelector(".newmember .create input").classList.add("notdisabled");
                            document.querySelector(".newmember .create input").disabled = false;
                        }
                        else{
                            document.querySelector(".newmember .create input").disabled = true;
                            document.querySelector(".newmember .create input").classList.remove("notdisabled");
                        }
                    });
    
                    const span = document.createElement("span");
                    span.classList.add("checkmark");
    
                    checkbox.appendChild(inputcheckbox);
                    checkbox.appendChild(span);
    
                    userinfocontainer.appendChild(checkbox);
    
                    newmemberchatscontainer.appendChild(userinfocontainer);
    
                }
                addmemberpopup.style.display = "flex";
            }
        })

        editnicknameclosePopupBtn.addEventListener("click",()=>{
            editnicknamepopup.style.display = 'none';
        })
        
        window.addEventListener('click', (event) => {
            if (event.target == popup) {
                popup.style.display = 'none';
            }
            if (event.target == editnicknamepopup) {
                editnicknamepopup.style.display = 'none';
            }
        });


    }

    async function sendmessage(sendername = "You", contx, time, convdata = null){
        const conversationid = getUrlParameter('convid');
        
        if(conversationid==null || conversationid==""){
            return;
        }

        const conversationcontainer = document.querySelector(".chatcontainer .conversation .middlesection .convcontainer");

        const messagecontainer = document.createElement("div");
        messagecontainer.classList.add("messagecontainer");

        const message = document.createElement("div");

        const sender = document.createElement("div");
        sender.classList.add("sender");
        if(sendername == "Deleted"){
            message.classList.add("message", 'notyou');
            sender.innerHTML = "-Deleted User";
        }
        else{
            if(sendername != "You"){
                message.classList.add("message", 'notyou');
                if(convdata == null){
                    const data = await axios.get("/api/conversations/byid/"+conversationid);
                    convdata = data.data;
                }
                let parts = convdata.nicknames[sendername].split(" ");
                sender.innerHTML = "- "+parts[0];
            }
            else{
                message.classList.add("message",sendername);
                sender.innerHTML = "- "+sendername;
            }
        }

        

        const context = document.createElement("div");
        context.classList.add("context");

        var messagecontext = contx.replace(/\s+$/, "");
        messagecontext = messagecontext.replace(/</g, "&lt;");
        messagecontext = messagecontext.replace(/>/g, "&gt;");
        messagecontext = messagecontext.replace(/\n/g, '<br>');
        messagecontext = messagecontext.replace(/\r/g, "<br>");
        messagecontext = messagecontext.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
        messagecontext = messagecontext.replace(/\s/g, "&nbsp;");
        // messagecontext = messagecontext.replace(/ /g, "&nbsp;");

        if(messagecontext == "material-symbols-outlined.like"){
            messagecontext = `<span class="material-symbols-outlined like">thumb_up</span>`
        }
        if(messagecontext == "material-symbols-outlined.dislike"){
            messagecontext = `<span class="material-symbols-outlined like">thumb_down</span>`
        }
        
        context.innerHTML = messagecontext;

        const timecontainer = document.createElement("div");
        timecontainer.classList.add("time");
        timecontainer.innerHTML = formatTime(new Date(time));

        message.appendChild(sender);
        message.appendChild(context);
        message.appendChild(timecontainer);

        messagecontainer.appendChild(message);

        conversationcontainer.appendChild(messagecontainer);

        messagecontainer.scrollIntoView({behavior: "smooth"});
    }
    
    function showToast(text) {
        var x = document.getElementById("toast");
        x.innerHTML = text;
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    const chats = document.querySelectorAll(".userscontainer .chatscontainer .userinfocontainer");
    var displayphone = false;
    const textarea = document.querySelector("textarea");
    const conv = document.querySelector(".chatcontainer");
    const firstpage = document.querySelector(".firstpagecontainer");
    const userscontainer = document.querySelector(".userscontainer");
    const gotofirstpage = document.querySelector(".chatcontainer .conversation .topsection .leftside .goback span");
    const openmoreinfo = document.querySelector(".chatcontainer .conversation .topsection .rightside .openmoreinfo");
    const moreinfo = document.querySelector(".chatcontainer .moreinfo");
    const messagescontainer = document.querySelector(".chatcontainer .conversation");
    const gobackmoreinfo = document.querySelector(".chatcontainer .moreinfo .goback div")
    const rotatelist = {"1": "keyboard_double_arrow_right", "-1": "keyboard_double_arrow_left"};
    const rightsidebottomside = document.querySelectorAll(".chatcontainer .conversation .bottomsection .like span");
    const sendmessagebutton = document.querySelector(".chatcontainer .conversation .bottomsection .like .send");
    const likebutton = document.querySelector(".chatcontainer .conversation .bottomsection .like span.like");
    const dislikebutton = document.querySelector(".chatcontainer .conversation .bottomsection .like span.dislike");

    likebutton.addEventListener("click", async function(){
        let idconv = getUrlParameter('convid');
        let sender = username;
        let message = `material-symbols-outlined.like`;
        let time = new Date();
        await axios.post("/api/messages",{
            conversation_id: idconv,
            sender: sender,
            content: message,
            reacts: [],
            created_at: time,
            edited: false,
            deleted: false
        })
        socket.emit('message', { username, conversation_id: getUrlParameter('convid'), message, time});
        const convcontainer = document.getElementById(`${idconv}`)
        convcontainer.querySelector(".time").innerHTML = timeAgo(new Date(time));
        convcontainer.querySelector(".msg").innerHTML = `<span class="material-symbols-outlined like">thumb_up</span> -&nbsp;`;
        await axios.patch(`/api/conversations/byid/${idconv}`,{last_message: `<span class="material-symbols-outlined like">thumb_up</span>`, last_message_time: time});
        sendmessage('You', message, time);

    })

    dislikebutton.addEventListener("click", async function(){
        let idconv = getUrlParameter('convid');
        let sender = username;
        let message = `material-symbols-outlined.dislike`;
        let time = new Date();
        await axios.post("/api/messages",{
            conversation_id: idconv,
            sender: sender,
            content: message,
            reacts: [],
            created_at: time,
            edited: false,
            deleted: false
        })
        socket.emit('message', { username, conversation_id: getUrlParameter('convid'), message, time});
        const convcontainer = document.getElementById(`${idconv}`)
        convcontainer.querySelector(".time").innerHTML = timeAgo(new Date(time));
        convcontainer.querySelector(".msg").innerHTML = `<span class="material-symbols-outlined like">thumb_down</span> -&nbsp;`;
        await axios.patch(`/api/conversations/byid/${idconv}`,{last_message: `<span class="material-symbols-outlined like">thumb_down</span>`, last_message_time: time});
        sendmessage('You', message, time);

    })

    sendmessagebutton.addEventListener("click",async function(event){
        var time = new Date();
        const message = textarea.value;
        if(getUrlParameter('convid') == 'newconvo'){
            var newuserdata
            await axios.get(`/api/users/byusername/${getUrlParameter('username')}`).then(res=>{
                newuserdata = res.data;
            })
            .catch(err=>{
                console.log(err);
            })
            
            const body = {members: [username, getUrlParameter('username')], last_message: message, last_message_time: time, name: "", group: false, profile_picture: "", nicknames: {[username]: useraccount.first_name+" "+useraccount.last_name, [newuserdata.username]: newuserdata.first_name+" "+newuserdata.last_name}}
            var response;
            await axios.post('/api/conversations', body).then(res=>{
                response = res.data;
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('convid', encodeURIComponent(res.data._id));
                history.pushState(null, '', newUrl);
            });
            console.log(response)
            socket.emit("new_convo",{ conversation_id: response._id, members: response.members});
            const reciever = getUrlParameter('convid');
            socket.emit('message', { username, conversation_id: getUrlParameter('convid'), message, time});

            axios.post('/api/messages', {conversation_id: reciever, sender: username , content: message, reacts: [], created_at: new Date(), edited: false, deleted: false})
            .catch(function (error) {
                console.log(error);
            });
            const url = new URL(window.location);

            url.searchParams.delete('username');
        
            history.replaceState(null, '', url.toString());
            sendmessage("You", textarea.value, time);
            textarea.value = "";
            rightsidebottomside[0].style.display = "flex";
            rightsidebottomside[1].style.display = "flex";
            rightsidebottomside[2].style.display = "none";
            textarea.style.height = "26px";
            return;
        }
        const reciever = getUrlParameter('convid');
        socket.emit('message', { username, conversation_id: getUrlParameter('convid'), message, time});
        event.preventDefault();
        const body = {conversation_id: reciever, sender: username , content: message, reacts: [], created_at: new Date(), edited: false, deleted: false}

        axios.post('/api/messages', body)
        .catch(function (error) {
            console.log(error);
        });
        await axios.patch(`/api/conversations/byid/${reciever}`,{last_message: message, last_message_time: time});
        sendmessage("You", textarea.value, time);
        const convcontainer = document.getElementById(`${reciever}`)
        convcontainer.querySelector(".time").innerHTML = timeAgo(new Date(time));
        convcontainer.querySelector(".msg").innerHTML = message+" -&nbsp;";
        if(chatscontainer.firstChild){
            chatscontainer.insertBefore(convcontainer, chatscontainer.firstChild);
        }
        textarea.value = "";
        rightsidebottomside[0].style.display = "flex";
        rightsidebottomside[1].style.display = "flex";
        rightsidebottomside[2].style.display = "none";
        textarea.style.height = "26px";
    })

    textarea.addEventListener("keyup", function(event) {
        if(textarea.value==""){
            rightsidebottomside[0].style.display = "flex";
            rightsidebottomside[1].style.display = "flex";
            rightsidebottomside[2].style.display = "none";
        }
        else{
            rightsidebottomside[0].style.display = "none";
            rightsidebottomside[1].style.display = "none";
            rightsidebottomside[2].style.display = "flex";
        }
        textarea.style.height = "26px";
        let height = event.target.scrollHeight;
        textarea.style.height = height + "px";
    });

    textarea.addEventListener("keydown",async function(event) {
        if(event.keyCode==13 && !event.shiftKey){
            var time = new Date();
            const message = textarea.value;
            if(getUrlParameter('convid') == 'newconvo'){
                var newuserdata
                await axios.get(`/api/users/byusername/${getUrlParameter('username')}`).then(res=>{
                    newuserdata = res.data;
                })
                .catch(err=>{
                    console.log(err);
                })
                
                const body = {members: [username, getUrlParameter('username')], last_message: message, last_message_time: time, name: "", group: false, profile_picture: "", nicknames: {[username]: useraccount.first_name+" "+useraccount.last_name, [newuserdata.username]: newuserdata.first_name+" "+newuserdata.last_name}}
                var response;
                await axios.post('/api/conversations', body).then(res=>{
                    response = res.data;
                    const newUrl = new URL(window.location);
                    newUrl.searchParams.set('convid', encodeURIComponent(res.data._id));
                    history.pushState(null, '', newUrl);
                });
                console.log(response)
                socket.emit("new_convo",{ conversation_id: response._id, members: response.members});
                const reciever = getUrlParameter('convid');
                socket.emit('message', { username, conversation_id: getUrlParameter('convid'), message, time});
    
                axios.post('/api/messages', {conversation_id: reciever, sender: username , content: message, reacts: [], created_at: new Date(), edited: false, deleted: false})
                .catch(function (error) {
                    console.log(error);
                });
                const url = new URL(window.location);

                 url.searchParams.delete('username');
            
                history.replaceState(null, '', url.toString());
                sendmessage("You", textarea.value, time);
                textarea.value = "";
                rightsidebottomside[0].style.display = "flex";
                rightsidebottomside[1].style.display = "flex";
                rightsidebottomside[2].style.display = "none";
                textarea.style.height = "26px";
                return;
            }
            const reciever = getUrlParameter('convid');
            socket.emit('message', { username, conversation_id: getUrlParameter('convid'), message, time});
            event.preventDefault();
            const body = {conversation_id: reciever, sender: username , content: message, reacts: [], created_at: new Date(), edited: false, deleted: false}

            axios.post('/api/messages', body)
            .catch(function (error) {
                console.log(error);
            });
            await axios.patch(`/api/conversations/byid/${reciever}`,{last_message: message, last_message_time: time});
            sendmessage("You", textarea.value, time);
            const convcontainer = document.getElementById(`${reciever}`)
            convcontainer.querySelector(".time").innerHTML = timeAgo(new Date(time));
            convcontainer.querySelector(".msg").innerHTML = message+" -&nbsp;";
            if(chatscontainer.firstChild){
                chatscontainer.insertBefore(convcontainer, chatscontainer.firstChild);
            }
            textarea.value = "";
            rightsidebottomside[0].style.display = "flex";
            rightsidebottomside[1].style.display = "flex";
            rightsidebottomside[2].style.display = "none";
            textarea.style.height = "26px";
        }

    });

    deployevents();

    const username = getCookie('username');
    const password = getCookie('password');

    if(username==null || username=="" || password==null || password==""){
        showToast("Authentication error, Try Again!");
        setTimeout(function(){
            document.cookie = "username=; path=/; ";
            document.cookie = "password=; path=/; ";
            window.location.href = "../";}
        ,2000);
        return;
    }

    const useraccountdata = await axios.get("/api/accounts/byusername/"+username+"&"+password);
    const useraccount = useraccountdata.data;

    if(useraccount==null){
        showToast("Authentication error, Going Back...!");
        setTimeout(function(){
            document.cookie = "username=; path=/; ";
            document.cookie = "password=; path=/; ";
            window.location.href = "../";}
        ,2000);
        return;
    }

    document.querySelector(".firstpagecontainer .firstpage .title h1 .first_name").innerHTML = useraccount.first_name;

    const socket = io(window.location.origin.replace(/^http/, 'ws'));

    socket.emit("authenticate",{ username, conversations_id: useraccount.conversations});

    var conversations = useraccount.conversations;

    const chatscontainer = document.querySelector(".userscontainer .chatscontainer");
    chatscontainer.innerHTML = '';

    const groupsconversation = [];
    const personalconversation = {};

    const conversationsData = [];

    for (const conversation of conversations) {
        if (conversation == "" || conversation == null) {
            continue;
        }
        const conv = await axios.get("/api/conversations/byid/" + conversation);
        const convdata = conv.data;

        if (convdata == null) {
            continue;
        }

        conversationsData.push(convdata);
    }

    conversationsData.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));

    for (let convdata of conversationsData){
        if(convdata==null){
            return;
        }

        const userinfocontainer = document.createElement("div");
        userinfocontainer.classList.add("userinfocontainer");

        const photo = document.createElement("div");
        photo.classList.add("photo");

        const img = document.createElement("img");
        img.src = convdata.profile_picture;
        img.alt = "profile picture";


        const userdetails = document.createElement("div");
        userdetails.classList.add("userdetails");

        const name = document.createElement("div");
        name.classList.add("name");
        if(convdata.group){
            name.innerHTML = convdata.name;
            groupsconversation.push(convdata._id);
        }
        else{
            var memberdetail;
            convdata.members.forEach(member => {
                if(member != username){
                    memberdetail = member;
                }
            })
            const member = await axios.get("/api/users/byusername/"+memberdetail);
            const memberdata = member.data;
            personalconversation[memberdetail] = [memberdata, convdata];
            name.innerHTML = convdata.nicknames[memberdetail];
            img.src = memberdata.profile_picture;
        }

        
        photo.appendChild(img);

        userinfocontainer.appendChild(photo);

        const lastmessage = document.createElement("div");
        lastmessage.classList.add("lastmessage");

        const msg = document.createElement("div");
        msg.classList.add("msg");
        msg.innerHTML = convdata.last_message+" -&nbsp;";

        const time = document.createElement("div");
        time.classList.add("time");
        time.innerHTML = timeAgo(new Date(convdata.last_message_time));

        lastmessage.appendChild(msg);
        lastmessage.appendChild(time);

        userdetails.appendChild(name);
        userdetails.appendChild(lastmessage);

        userinfocontainer.appendChild(userdetails);

        userinfocontainer.addEventListener("click", function(event) {
            const id = convdata._id;
            const conversationid = encodeURIComponent(id);
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('convid', conversationid);
            history.pushState(null, '', newUrl);
            
            loadconv();
        })

        userinfocontainer.setAttribute("id",convdata._id);

        chatscontainer.appendChild(userinfocontainer);
    }
    
    socket.on("message", ({ username, conversation_id, message, time })=>{
        const actualconv = getUrlParameter('convid');
        try{
            const convcontainer = document.getElementById(`${conversation_id}`)
            convcontainer.querySelector(".time").innerHTML = timeAgo(new Date(time));
            convcontainer.querySelector(".msg").innerHTML = message+" -&nbsp;";
            if(chatscontainer.firstChild){
                chatscontainer.insertBefore(convcontainer, chatscontainer.firstChild);
            }
        }
        catch(err){
            console.log(err);
        }
        
        if(actualconv== conversation_id){
            sendmessage(username, message, time);
        }
    
    })

    socket.on("new_convo",async ({conversation_id})=>{
        const conv = await axios.get("/api/conversations/byid/"+conversation_id);
        const convdata = conv.data;

        if(convdata==null){
            return;
        }

        const userinfocontainer = document.createElement("div");
        userinfocontainer.classList.add("userinfocontainer");

        const photo = document.createElement("div");
        photo.classList.add("photo");

        const img = document.createElement("img");
        img.src = convdata.profile_picture;
        img.alt = "profile picture";


        const userdetails = document.createElement("div");
        userdetails.classList.add("userdetails");

        const name = document.createElement("div");
        name.classList.add("name");
        if(convdata.group){
            name.innerHTML = convdata.name;
            groupsconversation.push(convdata._id);
        }
        else{
            var memberdetail;
            convdata.members.forEach(member => {
                if(member != username){
                    memberdetail = member;
                }
            })
            const member = await axios.get("/api/users/byusername/"+memberdetail);
            const memberdata = member.data;
            personalconversation[memberdetail] = [memberdata, convdata];
            name.innerHTML = memberdata.first_name+" "+memberdata.last_name;
            img.src = memberdata.profile_picture;
        }

        
        photo.appendChild(img);

        userinfocontainer.appendChild(photo);

        const lastmessage = document.createElement("div");
        lastmessage.classList.add("lastmessage");

        const msg = document.createElement("div");
        msg.classList.add("msg");
        msg.innerHTML = convdata.last_message+" -&nbsp;";

        const time = document.createElement("div");
        time.classList.add("time");
        time.innerHTML = timeAgo(new Date(convdata.last_message_time));

        lastmessage.appendChild(msg);
        lastmessage.appendChild(time);

        userdetails.appendChild(name);
        userdetails.appendChild(lastmessage);

        userinfocontainer.appendChild(userdetails);

        userinfocontainer.addEventListener("click", function(event) {
            const id = convdata._id;
            const conversationid = encodeURIComponent(id);
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('convid', conversationid);
            history.pushState(null, '', newUrl);
            
            loadconv();
        })

        userinfocontainer.setAttribute("id",conversation_id);

        if (chatscontainer.firstChild) {
            chatscontainer.insertBefore(userinfocontainer, chatscontainer.firstChild);
        } else {
            chatscontainer.appendChild(userinfocontainer);
        }
    })

    
})




myCode();