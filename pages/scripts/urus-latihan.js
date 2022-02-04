const practiceList = document.querySelector('#practice-list');
const renderPractice = doc => {
    const date = doc.data().date.toDate().toDateString() + ", " + doc.data().date.toDate().toLocaleTimeString();
    const div = `
    <div data-id='${doc.data().quizID}' class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
        <div class="card">
            <div class="card-header d-flex">
                <a href="lihat-latihan.html?${doc.data().quizID}" target="_blank"><h4 class="mb-0">${doc.data().quizName}</h4></a>
                <div class="dropdown ml-auto">
                    <a class="toolbar" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="mdi mdi-dots-vertical"></i>  </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                        <a class="dropdown-item btn-delete1" data-toggle="modal" data-target="#modal-deletepc" href="#">Buang</a>
                        <a class="dropdown-item" href="sunting-latihan.html?${doc.data().quizID}" target="_blank">Sunting</a>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="card-text">${doc.data().quizDesc}</p>
                <p class="card-text"><small class="text-muted">Tarikh dikemaskini: ${date}</small></p>
            </div>
        </div>
    </div>
    `;
    practiceList.insertAdjacentHTML('beforeend', div);

    // delete practice
    const delPc = document.querySelector('#body-delete-modal');
    const btnDelete1 = document.querySelector(`[data-id='${doc.data().quizID}'] .btn-delete1`);
    const btnDelete2 = document.querySelector('.btn-delete2');
    btnDelete1.addEventListener('click', () => {
        delPc.innerHTML = "Adakah anda pasti mahu membuang " + doc.data().quizName + " daripada database secara kekal?";
        btnDelete2.addEventListener('click', () => {
            db.collection('Practice').doc(doc.data().quizID).collection('QnA').get().then((querySnapshot) => {
                querySnapshot.forEach((docu) => {
                    db.collection('Practice').doc(doc.data().quizID).collection('QnA').doc(docu.id).delete().then(() => {
                        console.log('success delete all the QNA under this practice.');
                    })
                });
            })
            .then(() => {
                db.collection('Practice').doc(doc.data().quizID).delete().then(() => {
                    console.log('success delete the doc of this practice');
                })
            }) 
            .then(() => {
                db.collection("students").get().then((querySnapshot) => {
                    querySnapshot.forEach((doc1) => {
                        const studID = doc1.id;
                        console.log(studID);
                        const quizID = doc.data().quizID;
                        console.log(quizID);

                        db.collection('students').doc(studID).collection('practices').get().then(doc3 => { 
                            if (doc3.docs.length > 0) {
        
                                db.collection("students").doc(studID).collection('practices').where("quizID", "==", quizID).get().then((querySnapshot) => {
                                    querySnapshot.forEach((doc2) => {
                                        db.collection("students").doc(studID).collection('practices').doc(doc2.id).delete().then(() => {
                                            console.log('success delete the doc of this practice under Students DB');
                                        })
                                    });
                                })
                            }
                        })
                    });
                });
            })  
            .catch(err => {
                console.log('Error removing document', err);
            });
        })
    })
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