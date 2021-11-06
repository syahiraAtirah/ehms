// create halaqah group
const creategpForm = document.querySelector('#creategp-form');
const instructor = document.querySelector('#gp-admin');
document.querySelector('#creategp').addEventListener('click', createGp);
function createGp(e) {
    e.preventDefault();

    const gpAdmin = instructor.options[instructor.selectedIndex].text;

    db.collection("TadabburGroup").add({
        groupName: document.querySelector('#gp-name').value,
        admin: gpAdmin,
        adminID: instructor.value,
        members: {0: "Tiada", 1: "Tiada", 2: "Tiada", 3: "Tiada", 4: "Tiada"}
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);

        db.collection('instructors').doc(instructor.value).update({
            groupID: firebase.firestore.FieldValue.arrayUnion(docRef.id),
            adminOf: firebase.firestore.FieldValue.arrayUnion(document.querySelector('#gp-name').value),
        });
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

const halaqahList = document.querySelector('#halaqah-list');
const renderHalaqah = doc => {
    const div = `
    <div data-id='${doc.id}' class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
        <div class="card">
            <div class="card-header d-flex">
                <h4 class="mb-0">${doc.data().groupName}</h4>
                <div class="dropdown ml-auto">
                    <a class="toolbar" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="mdi mdi-dots-vertical"></i>  </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                        <a class="dropdown-item" href="sunting-halaqah.html?${doc.id}" target="_blank">Sunting</a>
                        <a class="dropdown-item btn-delete1" data-toggle="modal" data-target="#modal-deletegp" href="#">Buang</a>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="card-text">Admin: ${doc.data().admin}</p>
                <!-- accordion -->
                <div class="accrodion-regular">
                    <div id="accordion">
                        <div class="card">
                            <div class="card-header" id="headingTwo">
                                <h5 class="mb-0"><button class="btn btn-link collapsed" data-toggle="collapse" data-target="#${doc.id}" aria-expanded="false" aria-controls="${doc.id}">Pelajar</button></h5>
                            </div>
                            <div id="${doc.id}" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                <div class="card-body">
                                    <ol>
                                        <li> ${doc.data().members}</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    halaqahList.insertAdjacentHTML('beforeend', div);

    // delete halaqah
    const delGp = document.querySelector('#body-delete-modal');
    const btnDelete1 = document.querySelector(`[data-id='${doc.id}'] .btn-delete1`);
    const btnDelete2 = document.querySelector('.btn-delete2');
    btnDelete1.addEventListener('click', () => {
        delGp.innerHTML = "Adakah anda pasti mahu membuang rekod " + doc.data().groupName + " daripada database secara kekal?";
        btnDelete2.addEventListener('click', () => {
            db.collection('TadabburGroup').doc(`${doc.id}`).delete().then(() => {
                console.log('Document succesfully deleted from FIRESTORE!');
                
                db.collection('instructors').doc(doc.data().adminID).update({
                    groupID: firebase.firestore.FieldValue.arrayRemove(doc.id),
                    adminOf: firebase.firestore.FieldValue.arrayRemove(doc.data().groupName),
                });

                // setTimeout(function(){
                //     document.location.reload();
                // }, 1000);
            }).catch(err => {
                console.log('Error removing document', err);
            });
        })
    })
};


// realtime listener
db.collection('TadabburGroup').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added') {
            renderHalaqah(change.doc);
            console.log('ADDED');
        }
        if(change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            halaqahList.removeChild(tr);
            console.log('REMOVED');
        }
    })
});

const allInstructor = document.querySelector('#gp-admin');
const renderInstructor = doc => {
    const opt = `
        <option value="${doc.id}">${doc.data().fullname}</option>
    `;
    allInstructor.insertAdjacentHTML('beforeend', opt);
}

// realtime listener
db.collection('instructors').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added') {
            renderInstructor(change.doc);
            console.log('ADDED');
        }
        if(change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            allInstructor.removeChild(tr);
            console.log('REMOVED');
        }
    })
});

