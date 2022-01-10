const profile = document.querySelector('.profile .form');
const profileLink = document.querySelector('#profile-link');
const profileImg = document.querySelector('#profile-img');
const profileName = document.querySelector('#profile-fullname');
const profileRole = document.querySelector('#profile-role');

auth.onAuthStateChanged((user) => {
    if (user) {

        db.collection("instructors").doc(user.uid).onSnapshot((doc) => {
            profile.email.value = doc.data().email;
            profile.fullname.value = doc.data().fullname;
            profile.role.value = doc.data().role;
            profile.phone.value = doc.data().phone;
            profile.addr1.value = doc.data().addr1;
            profile.addr2.value = doc.data().addr2;
            profile.postcode.value = doc.data().postcode;
            profile.city.value = doc.data().city;
            profile.state.value = doc.data().state;
            profile.datejoined.value = doc.data().datejoined;
            profileLink.href = doc.data().imageUrl;
            profileImg.src = doc.data().imageUrl;
        });
        
        // edit profile details
        profile.addEventListener('submit', e => {
            e.preventDefault();
            db.collection('instructors').doc(user.uid).update({
                fullname: profile.fullname.value,
                role: profile.role.value,
                phone: profile.phone.value,
                addr1: profile.addr1.value,
                addr2: profile.addr2.value,
                postcode: profile.postcode.value,
                city: profile.city.value,
                state: profile.state.value,
            }).then(() => {
                alert('Data berjaya disunting.');
            })
        });
        

    } else {
        console.log('no user');
    }
});



