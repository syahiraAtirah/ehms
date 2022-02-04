// state changes
auth.onAuthStateChanged(user => {
    if (!user) {
        console.log('You are not log in');
    } 
});

// login
const clickLogin = document.querySelector('#loginBtn').addEventListener('click', login);
async function login(e) {
    e.preventDefault();

    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    const peranan = document.querySelector('#peranan').value;

    await auth.signInWithEmailAndPassword(email, password).then(() => {
        const docRef = db.collection("instructors").doc(auth.currentUser.uid);
        docRef.get().then((doc) => {
            if (doc.exists) {      
                const role = doc.data().role;
                if (role == peranan) {
                    window.location.href = "../pages/lamanutama.html";
                } else {
                    alert('Sila pilih peranan yang betul.');
                }
            } else {
                alert('Emel yang digunakan tidak didaftar.')
            }
        }).catch((error) => {
            console.log("Error: ", error);
        });
    })
    .catch((error) => {
        alert(error.message);
    });
}


