const assessmentList = document.querySelector('#assessment-list');
const renderAssessment = doc => {
    // const date = doc.data().date.toDate().toDateString() + ", " + doc.data().date.toDate().toLocaleTimeString();
    const div = `
    <div data-id='${doc.data().assessmentID}' class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
        <div class="card">
            <div class="card-header d-flex">
                <a href="lihat-penilaian.html?${doc.data().assessmentID}" target="_blank"><h4 class="mb-0">${doc.data().assessmentName}</h4></a>       
            </div>
            <div class="card-body">
                <p class="card-text">${doc.data().assessmentDesc}</p>
                <p class="card-text"><small class="text-muted">Tarikh dikemaskini: ${doc.data().date}</small></p>
            </div>
        </div>
    </div>
    `;
    assessmentList.insertAdjacentHTML('beforeend', div);
};

// realtime listener
db.collection('Assessment').orderBy("date").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added') {
            renderAssessment(change.doc);
            console.log('ADDED');
        }
        if(change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            assessmentList.removeChild(tr);
            console.log('REMOVED');
        }
    })
});