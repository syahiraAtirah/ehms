
// state changes
auth.onAuthStateChanged(user => {
    if (user) {
        const userDB = db.collection("instructors").doc(user.uid);
        userDB.get().then((doc) => {
            const userImg = document.querySelector('#img-user');
            userImg.src = doc.data().imageUrl;

            // access level
            const role = doc.data().role;
            console.log('PERANAN: ' + role);

            var admin = document.getElementsByClassName("nav-admin");
            var lead = document.getElementsByClassName("nav-lead");
            
            if (role == "Ketua Pengajar") { 
              for (let i=0 ; i < admin.length ; i++) {
                admin[i].style.display = "none";
              }
            } 
            if (role == "Pengajar") { 
              for (let i=0 ; i < lead.length ; i++) {
                lead[i].style.display = "none";
              }
              for (let i=0 ; i < admin.length ; i++) {
                admin[i].style.display = "none";
              }
            } 
        });
        document.querySelector('#currentuser').innerHTML = user.email;
        console.log('Signed in as ', user.email);
    } else {
        window.location.href = "logmasuk.html";
    }
});

// logout
const logout = document.querySelector('#logout').addEventListener('click', logOut);
function logOut(e) {
    e.preventDefault();
    auth.signOut().catch((error) => {
        console.log(error.message);
    });
}

// change password
const changePw = document.querySelector('#changePw').addEventListener('click', changePassword);
function changePassword(e) {
    e.preventDefault();
    auth.sendPasswordResetEmail(auth.currentUser.email).then(() => {
        console.log('sent!');
    })
    .catch((error) => {
        console.log(error.message);
    });
}
