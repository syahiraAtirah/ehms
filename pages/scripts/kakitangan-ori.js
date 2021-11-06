let id;

// render instructor table
const instructorList = document.querySelector('#instructor-list');
const deleteBody = document.querySelector('#body-delete-modal');
    
const renderUser = doc => {
    const tr = `
        <tr data-id='${doc.id}'>
            <td>${doc.data().fullname}</td>
            <td>${doc.data().email}</td>
            <td>${doc.data().phone}</td>
            <td>${doc.data().role}</td>
            <td>
                <button class="btn btn-primary btn-xs btn-view" data-toggle="modal" data-target="#viewUser">Profil</button>
                <button class="btn btn-danger btn-xs btn-delete1" data-toggle="modal" data-target="#deleteUser">Buang</button>
            </td>
        </tr>
    `;
    instructorList.insertAdjacentHTML('beforeend', tr);

    // delete user (tapi tak auto close modal after click submit)
    const btnDelete1 = document.querySelector(`[data-id='${doc.id}'] .btn-delete1`);
    const btnDelete2 = document.querySelector('.btn-delete2');
    btnDelete1.addEventListener('click', () => {
        console.log('id instructor: ' + doc.id);
        deleteBody.innerHTML = "Adakah anda pasti mahu membuang rekod kakitangan " + doc.data().fullname + " daripada database secara kekal?";
        btnDelete2.addEventListener('click', () => {
            db.collection('instructors').doc(`${doc.id}`).delete().then(() => {
                console.log('Document of ' + doc.data().fullname + ' succesfully deleted from FIRESTORE!');
                // setTimeout(function(){
                //     document.location.reload();
                // }, 1000);
            }).catch(err => {
                console.log('Error removing document', err);
            });
        });
    });

    // view user profile
    const img = document.querySelector('#view-img');
    const imgLink = document.querySelector('#view-imgLink');
    const btnView = document.querySelector(`[data-id='${doc.id}'] .btn-view`);
    btnView.addEventListener('click', () => {
        id = doc.id;
        img.src = doc.data().imageUrl;
        imgLink.href = doc.data().imageUrl;
        viewProfile.imageName.value = doc.data().imageName;
        viewProfile.email.value = doc.data().email;
        viewProfile.fullname.value = doc.data().fullname;
        viewProfile.role.value = doc.data().role;
        viewProfile.adminOf.value = doc.data().adminOf;
        viewProfile.phone.value = doc.data().phone;
        viewProfile.addr1.value = doc.data().addr1;
        viewProfile.addr2.value = doc.data().addr2;
        viewProfile.postcode.value = doc.data().postcode;
        viewProfile.city.value = doc.data().city;
        viewProfile.state.value = doc.data().state;
        viewProfile.datejoined.value = doc.data().datejoined;
    }); 
};

// edit profile
const viewProfile = document.querySelector('.view-profile .form');
viewProfile.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('instructors').doc(id).update({
        email: viewProfile.email.value,
        fullname: viewProfile.fullname.value,
        role: viewProfile.role.value,
        adminOf: viewProfile.adminOf.value,
        phone: viewProfile.phone.value,
        addr1: viewProfile.addr1.value,
        addr2: viewProfile.addr2.value,
        postcode: viewProfile.postcode.value,
        city: viewProfile.city.value,
        state: viewProfile.state.value,
        datejoined: viewProfile.datejoined.value,
        // adminOf nk edit kat sini ka ?
    });
});

// realtime listener
db.collection('instructors').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added') {
            renderUser(change.doc);
            console.log('ADDED');
        }
        if(change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            let tbody = tr.parentElement;
            instructorList.removeChild(tbody);
            console.log('REMOVED');
        }
        if(change.type === 'modified') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            let tbody = tr.parentElement;
            instructorList.removeChild(tbody);
            renderUser(change.doc);
            console.log('MODIFIED');
        }
    })
});

// register new instructor
const signupForm = document.querySelector('#signup-form');
document.querySelector('#signupBtn').addEventListener('click', signup);
function signup(e) {
    e.preventDefault();

    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;
    const file = document.querySelector('#signup-img').files[0];
    const imageName = file.name;
    const name = 'profileImage/' + imageName;
    const task = firebase.storage().ref().child(name).put(file);

    secondaryApp.auth().createUserWithEmailAndPassword(email, password).then(cred => {
        // save img to storage
        task.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
            console.log(url);
            alert("image upload successful");
            console.log("User " + email + " created successfully!");
            
            // save data to firestore
            db.collection('instructors').doc(cred.user.uid).set({
                email: email,
                password: password,
                imageName: imageName,
                imageUrl: url,
                fullname: document.querySelector('#signup-fullname').value,
                role: document.querySelector('#signup-role').value,
                adminOf: "",
                phone: document.querySelector('#signup-phone').value,
                addr1: document.querySelector('#signup-addr1').value,
                addr2: document.querySelector('#signup-addr2').value,
                postcode: document.querySelector('#signup-postcode').value,
                city: document.querySelector('#signup-city').value,
                state: document.querySelector('#signup-state').value,
                datejoined: document.querySelector('#signup-datejoined').value
            });
            console.log("User's data of " + email + " added to firestore!");
            signupForm.reset();
            // FIND OUT LATER HOW TO CLOSE THE MODAL ONCE SUBMIT THE FORM
        })
        
    })
    .catch((error) => {
        console.log(error.message);
    });   
}


// function uploadImage() {
//     const ref = firebase.storage().ref();
//     const file = document.querySelector('#select').files[0];
//     const name = 'profileImage/' + file.name;
//     const task = ref.child(name).put(file);

//     task.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
//         console.log(url);
//         const image = document.querySelector('#view-img');
//         const link = document.querySelector('#view-imgLink');
//         image.src = url;
//         link.href = url;
//         image.name = file.name;
//     })      
// }

// function uploadImageEdit() {
//     const ref = firebase.storage().ref();
//     const file = document.querySelector('#select-editImg').files[0];
//     const name = 'profileImage/' + file.name;
//     const task = ref.child(name).put(file);

//     task.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
//         console.log(url);
//         const image = document.querySelector('#edit-img');
//         const link = document.querySelector('#edit-imgLink');
//         image.src = url;
//         link.href = url;
//         image.name = file.name;
//     })      
// }
