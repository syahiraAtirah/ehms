const assessmentList = document.querySelector('#assessment-list');
const renderAssessment = doc => {
    // const date = doc.data().date.toDate().toDateString() + ", " + doc.data().date.toDate().toLocaleTimeString();
    const div = `
    <div data-id='${doc.data().assessmentID}' class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
        <div class="card">
            <div class="card-header d-flex">
                <a href="lihat-penilaian.html?${doc.data().assessmentID}" target="_blank"><h4 class="mb-0">${doc.data().assessmentName}</h4></a>
                <div class="dropdown ml-auto">
                    <a class="toolbar" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="mdi mdi-dots-vertical"></i>  </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                        <a class="dropdown-item btn-delete1" data-toggle="modal" data-target="#modal-deleteass" href="#">Buang</a>
                        <a class="dropdown-item" href="sunting-penilaian.html?${doc.data().assessmentID}" target="_blank">Sunting</a>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="card-text">${doc.data().assessmentName}</p>
                <p class="card-text"><small class="text-muted">Tarikh dikemaskini: ${doc.data().date}</small></p>
            </div>
        </div>
    </div>
    `;
    assessmentList.insertAdjacentHTML('beforeend', div);

    // delete assessment
    const delAss = document.querySelector('#body-delete-modal');
    const btnDelete1 = document.querySelector(`[data-id='${doc.data().assessmentID}'] .btn-delete1`);
    const btnDelete2 = document.querySelector('.btn-delete2');
    btnDelete1.addEventListener('click', () => {
        delAss.innerHTML = "Adakah anda pasti mahu membuang " + doc.data().assessmentName + " daripada database secara kekal?";
        btnDelete2.addEventListener('click', () => {
            db.collection('Assessment').doc(doc.data().assessmentID).collection('Question').get().then((querySnapshot) => {
                querySnapshot.forEach((docu) => {

                    db.collection('Assessment').doc(doc.data().assessmentID).collection('Question').doc(docu.id).delete().then(() => {
                        console.log('------------ Document succesfully deleted from FIRESTORE! : ' + docu.id + " in " + doc.data().assessmentID + "--------------------");
                        // setTimeout(function(){
                        //     document.location.reload();
                        // }, 1000);
                    })
                });
            })
            .then(() => {
                db.collection('Assessment').doc(doc.data().assessmentID).delete().then(() => {
                    console.log('------------ Document succesfully deleted from FIRESTORE! : ' + doc.data().assessmentID );
                    // setTimeout(function(){
                    //     document.location.reload();
                    // }, 1000);
                })
            })  
            .catch(err => {
                console.log('Error removing document', err);
            });
        })
    })
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