const noteList = document.querySelector('#notes-list');

const renderNotes = doc => {
    const div = `
    <div data-id='${doc.id}' class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
        <div class="card">
            <div class="card-header d-flex">
                <h4 class="mb-0">${doc.data().title}</h4>
                <div class="dropdown ml-auto">
                    <a class="toolbar" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="mdi mdi-dots-vertical"></i>  </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                        <a class="dropdown-item btn-delete1" href="#" data-toggle="modal" data-target="#deleteNote">Buang</a>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="card-text">Pautan:</p>
                <p class="card-text">${doc.data().url}</p>
                <a href="${doc.data().url}" target="_blank" class="btn btn-xs btn-info">Buka Nota</a>
            </div>
        </div>
    </div>
    `;
    noteList.insertAdjacentHTML('beforeend', div);

    // delete news (tapi tak auto close modal after click submit)
    const btnDelete1 = document.querySelector(`[data-id='${doc.id}'] .btn-delete1`);
    const btnDelete2 = document.querySelector('.btn-delete2');
    btnDelete1.addEventListener('click', () => {
        btnDelete2.addEventListener('click', () => {
            db.collection('Notes').doc(`${doc.id}`).delete().then(() => {
                console.log('Document succesfully deleted from FIRESTORE!');
                // setTimeout(function(){
                //     document.location.reload();
                // }, 1000);
            }).catch(err => {
                console.log('Error removing document', err);
            });
        });
    });
}

// realtime listener
db.collection('Notes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added') {
            renderNotes(change.doc);
            console.log('ADDED');
        }
        if(change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            noteList.removeChild(tr);
            console.log('REMOVED');
        }
    })
});

// add news
document.querySelector('#addNote').addEventListener('click', addNote);
function addNote(e) {
    e.preventDefault();

    db.collection('Notes').add({
        title: document.querySelector('#note-title').value,
        url: document.querySelector('#note-link').value,
        date: firebase.firestore.FieldValue.serverTimestamp(),
    });
    console.log('data added to firestore');
    
}

