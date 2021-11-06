// state changes
auth.onAuthStateChanged(user => {
  if (user) {
    const userDB = db.collection("instructors").doc(user.uid);
    userDB.get().then((doc) => {
      const userImg = document.querySelector('#img-user');
      userImg.src = doc.data().imageUrl;
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
