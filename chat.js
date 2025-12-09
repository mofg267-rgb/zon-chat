const auth = firebase.auth();
const db = firebase.database();

let myID = "";
let myEmail = "";

// التحقق من تسجيل الدخول
auth.onAuthStateChanged(user => {
    if(!user){
        if(!location.href.includes("index.html")){
            location.href = "index.html";
        }
        return;
    }
    myID = user.uid;
    myEmail = user.email || "";
    const myEmailSpan = document.getElementById("myEmail");
    if(myEmailSpan) myEmailSpan.innerText = myEmail;

    loadMessages(); // تحميل الرسائل العامة
});

// إرسال رسالة
document.getElementById("sendBtn").addEventListener("click", ()=>{
    const input = document.getElementById("messageInput");
    if(!input) return;
    const text = input.value.trim();
    if(!text) return;

    const msgObj = {
        from: myID,
        email: myEmail,
        text: text,
        time: Date.now()
    };

    db.ref("public_messages").push(msgObj)
      .then(()=> input.value = "")
      .catch(err=> console.error(err));
});

// تحميل الرسائل العامة
function loadMessages(){
    const messagesBox = document.getElementById("messages");
    if(!messagesBox) return;

    db.ref("public_messages").off();
    db.ref("public_messages").on("value", snap=>{
        messagesBox.innerHTML = "";
        snap.forEach(ms=>{
            const m = ms.val();
            const wrapper = document.createElement("div");
            wrapper.className = m.from === myID ? "message-out" : "message-in";
            
            const textNode = document.createElement("div");
            textNode.innerHTML = `<strong>${m.email}</strong>: ${m.text}`;
            wrapper.appendChild(textNode);

            const timeEl = document.createElement("div");
            timeEl.className = "msg-time";
            const d = new Date(m.time || Date.now());
            timeEl.innerText = d.toLocaleString();
            wrapper.appendChild(timeEl);

            messagesBox.appendChild(wrapper);
        });
        messagesBox.scrollTop = messagesBox.scrollHeight;
    });
}

// تسجيل خروج
function logout() {
    auth.signOut().then(()=> location.href = "index.html");
}

document.addEventListener("DOMContentLoaded", ()=>{
    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn) logoutBtn.addEventListener("click", logout);
});