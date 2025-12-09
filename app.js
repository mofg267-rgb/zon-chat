// ===== Firebase Initialization =====
const firebaseConfig = {
  apiKey: "AIzaSyAHoAbokei74Osmqd-EDh-__3nhZK68s6c",
  authDomain: "yomn-chat.firebaseapp.com",
  databaseURL: "https://yomn-chat-default-rtdb.firebaseio.com",
  projectId: "yomn-chat",
  storageBucket: "yomn-chat.firebasestorage.app",
  messagingSenderId: "298443519020",
  appId: "1:298443519020:web:8f9faf9d446a1f85390d89",
  measurementId: "G-PTFHDW72B8"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

// ===== تسجيل حساب =====
function register() {
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();
    const status = document.getElementById("status");

    if (!email || !pass) {
        status.innerText = "📌 الرجاء إدخال البريد الإلكتروني وكلمة السر";
        return;
    }

    status.innerText = "⏳ جاري إنشاء الحساب...";

    auth.createUserWithEmailAndPassword(email, pass)
        .then(cred => {
            const uid = cred.user.uid;
            db.ref("users/" + uid).set({
                email: email,
                uid: uid,
                createdAt: Date.now(),
                isBanned: false
            });
            status.innerText = "✅ تم إنشاء الحساب بنجاح!";
            setTimeout(()=> location.href = "chat.html", 700);
        })
        .catch(err => { status.innerText = "❌ " + err.message; });
}

// ===== تسجيل دخول =====
function login() {
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();
    const status = document.getElementById("status");

    if (!email || !pass) {
        status.innerText = "📌 الرجاء إدخال البريد الإلكتروني وكلمة السر";
        return;
    }

    status.innerText = "⏳ جاري تسجيل الدخول...";

    auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            status.innerText = "✅ تم تسجيل الدخول";
            setTimeout(()=> location.href = "chat.html", 500);
        })
        .catch(err => { status.innerText = "❌ " + err.message; });
}

// ===== تسجيل خروج =====
function logout() {
    auth.signOut().then(()=> location.href = "index.html");
}

// زر تسجيل الخروج
document.addEventListener("DOMContentLoaded", ()=>{
    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn) logoutBtn.addEventListener("click", logout);
});

// ===== التحقق من تسجيل الدخول =====
auth.onAuthStateChanged(user=>{
    if(!user && !location.href.includes("index.html")){
        location.href = "index.html";
    }
});