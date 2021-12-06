const practiceList = document.querySelector('#practice-list');
const renderPractice = doc => {
    const date = doc.data().date.toDate().toDateString() + ", " + doc.data().date.toDate().toLocaleTimeString();
    const div = `
    <div data-id='${doc.data().quizID}' class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
        <div class="card">
            <div class="card-header d-flex">
                <a href="lihat-latihan.html?${doc.data().quizID}" target="_blank"><h4 class="mb-0">${doc.data().quizName}</h4></a>       
            </div>
            <div class="card-body">
                <p class="card-text">${doc.data().quizDesc}</p>
                <p class="card-text"><small class="text-muted">Tarikh dikemaskini: ${date}</small></p>
            </div>
        </div>
    </div>
    `;
    practiceList.insertAdjacentHTML('beforeend', div);
};

// realtime listener
db.collection('Practice').orderBy("date").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added') {
            renderPractice(change.doc);
            console.log('ADDED');
        }
        if(change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            practiceList.removeChild(tr);
            console.log('REMOVED');
        }
    })
});