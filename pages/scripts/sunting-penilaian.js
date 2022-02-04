const assID = window.location.search.substring(1);
const clickSaveBtn = document.querySelector('#createAss');
const addQues = document.querySelector('#addQues');
const title = document.querySelector('#ass-title');
const desc = document.querySelector('#ass-desc');

db.collection("students").onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        db.collection("students").doc(doc.id).collection("assessment").onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc2) => {
                if (assID == doc2.id) {
                    clickSaveBtn.disabled = true;
                    addQues.disabled = true;
                    title.disabled = true;
                    desc.disabled = true;
                    alert('Anda tidak dibenarkan untuk sunting ' + doc2.data().assessmentName + ' ini. Ini adalah kerana penilaian ini telah dibuat oleh para pelajar.');
                }
            });
        });
    });
});

// VIEW CURRENT TITLE AND DESCRIPTION
const assessment = document.querySelector('.edit-practice .form');
db.collection("Assessment").doc(assID).onSnapshot((doc) => {
    assessment.title.value = doc.data().assessmentName;
    assessment.desc.value = doc.data().assessmentDesc;
});

// VIEW CURRENT QNA
const qnaID = [];
const viewQNA = document.querySelector('#viewQNA');
db.collection("Assessment").doc(assID).collection("Question").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

        qnaID.push(doc.id);
        const opt = `
        <div data-id='${doc.id}' class="alert alert-info fade show" role="alert">
            <a href="#" class="close btn-delete1" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></a>
            <br>
            <form>
            <div class="form-group">
                <textarea id="ques${doc.id}" class="form-control" placeholder="Soalan" rows="2"></textarea>
            </div>
            </form>
        </div>
        `;
        viewQNA.insertAdjacentHTML('beforebegin', opt);

        // INSERT DATA OF QNA INTO THE FIELDS
        document.getElementById("ques" + doc.id).value = doc.data().question;

        // remove data-id of QNA from the array
        const btnDelete1 = document.querySelector(`[data-id='${doc.id}'] .btn-delete1`);
        btnDelete1.addEventListener('click', () => {
            const IDindex = qnaID.indexOf(doc.id);
            qnaID.splice(IDindex, 1); 
            console.log('DIBUANG: ' + doc.id + ', CURRENT QNA: ' + qnaID);
        });
    });
});

// ADD NEW QNA
addQues.addEventListener('click', QnAform);
function QnAform(e) {
    e.preventDefault();

    const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
    qnaID.push(uid);
    // console.log('ADD: ' + uid);

    const opt = `
        <div data-id='${uid}' class="alert alert-info fade show" role="alert">
            <a href="#" class="close btn-delete1" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></a>
            <br>
            <form>
            <div class="form-group">
                <textarea id="ques${uid}" class="form-control" placeholder="Soalan" rows="2" required></textarea>
            </div>
            </form>
        </div>
    `;
    addQues.insertAdjacentHTML('beforebegin', opt);

    console.log('CURRENT QNA: ' + qnaID);

    // remove data-id of QNA from the array
    const btnDelete1 = document.querySelector(`[data-id='${uid}'] .btn-delete1`);
    btnDelete1.addEventListener('click', () => {
        const IDindex = qnaID.indexOf(uid);
        qnaID.splice(IDindex, 1); 
        console.log('DIBUANG: ' + uid + ', CURRENT QNA: ' + qnaID);
    });
}

// CLICK SAVE BUTTON
clickSaveBtn.addEventListener('click', updateAssessment);
function validate() {

    if (title.value != "" && desc.value != "") {
        if (qnaID.length == 0) {
            alert('Sila tambah soalan.');
            throw new Error('This is not an error. This is just to abort javascript');
        } else {
            for (let i = 0; i < qnaID.length ; i++) {
    
                const question = document.querySelector('#ques' + qnaID[i]).value;
        
                if (question == "") {
                    console.log("--- ADA KOSONGGG SOALAN ---");
                    alert('Terdapat kekosongan pada Soalan. Sila semak semula dan pastikan ruang kosong tersebut diisi.')
                    throw new Error('This is not an error. This is just to abort javascript');
                } 
            }
        }
    } else {
        console.log("--- ADA KOSONGGG TAJUK / DESC ---");
        alert('Terdapat kekosongan sama ada pada Tajuk penilaian atau Penerangan. Sila semak semula dan pastikan ruang kosong tersebut diisi.')
        throw new Error('This is not an error. This is just to abort javascript');
    }
}

function updateAssessment(e) {

    e.preventDefault();
    validate();
    console.log('KALAU ADA KOSONG TAK BOLE LALU SINI');
    
    // DELETE REMOVED QNA
    db.collection("Assessment").doc(assID).collection("Question").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (! qnaID.includes(doc.id)) {
                db.collection("Assessment").doc(assID).collection("Question").doc(doc.id).delete().then(() => {
                    console.log(doc.id + " successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            }
        });
    });

    db.collection("Assessment").doc(assID).update({
        assessmentName: title.value,
        assessmentDesc: desc.value,
        date: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
        // UPDATE EXISTING QNA
        for (let i = 0; i < qnaID.length ; i++) {
            db.collection("Assessment").doc(assID).collection("Question").doc(qnaID[i]).update({
                question: document.querySelector('#ques' + qnaID[i]).value, 
            })
        }
    })
    .then(() => {
        // ADD NEW QNA
        const comp = [];
        db.collection("Assessment").doc(assID).collection("Question").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                comp.push(doc.id);
            });
        })
        .then(() => {
            console.log('COMPARE ------------ ' + comp);
            for (let n=0 ; n < qnaID.length ; n++) {
                if (! comp.includes(qnaID[n])) {
                    
                    db.collection("Assessment").doc(assID).collection("Question").add({
                        question: document.querySelector('#ques' + qnaID[n]).value, 
                    })
                    .catch((error) => {
                        console.error("Error adding new QNA: ", error);
                    });
                }
            }
        })
    })
    .then(() => {
        // SUCCESS
        console.log('ASSESSMENT CREATED SUCCESSFULLY');
        alert('Alhamdulillah. Penilaian telah berjaya disunting.');
        // -------------window.location.href = "urus-penilaian.html";
    })
}