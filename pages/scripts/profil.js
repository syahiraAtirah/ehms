const profile = document.querySelector('.profile .form');
const profileLink = document.querySelector('#profile-link');
const profileImg = document.querySelector('#profile-img');
const profileName = document.querySelector('#profile-fullname');
const profileRole = document.querySelector('#profile-role');

auth.onAuthStateChanged((user) => {
    if (user) {

        db.collection("instructors").doc(user.uid).get().then((doc) => {
            profile.email.value = doc.data().email;
            profile.phone.value = doc.data().phone;
            profile.address.value = doc.data().addr1 + ', ' + doc.data().addr2 + ', ' + doc.data().postcode + ', ' + doc.data().city + ', ' + doc.data().state;
            profile.datejoined.value = doc.data().datejoined;
            profileLink.href = doc.data().imageUrl;
            profileImg.src = doc.data().imageUrl;
            profileName.innerHTML = doc.data().fullname;
            profileRole.innerHTML = doc.data().role;
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    } else {
        console.log('no user');
    }
  });



