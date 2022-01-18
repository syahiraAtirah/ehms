const noteList = document.querySelector('#notes-list');

const renderNotes = doc => {
    const div = `
    <div data-id='${doc.id}' class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
        <div class="card">
            <div class="card-header d-flex">
                <h4 class="mb-0">${doc.data().title}</h4>
                
            </div>
            <div class="card-body">
                <p class="card-text">Pautan:</p>
                <p class="card-text">${doc.data().url}</p>
                <a href="${doc.data().url}" target="_blank" class="btn btn-secondary">Buka Nota</a>
            </div>
        </div>
    </div>
    `;
    noteList.insertAdjacentHTML('beforeend', div);
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


