const gpID = window.location.search.substring(1);

const profile = document.querySelector('.profile .form');
const profileLink = document.querySelector('#profile-link');
const profileImg = document.querySelector('#profile-img');

db.collection("students").doc(gpID).onSnapshot((doc) => {
    profile.email.value = doc.data().email;
    profile.fullname.value = doc.data().fullname;
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
    db.collection('students').doc(gpID).update({
        fullname: profile.fullname.value,
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


