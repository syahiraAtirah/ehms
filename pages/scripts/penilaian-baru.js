const addQues = document.querySelector('#addQues');
addQues.addEventListener('click', QnAform);

const qnaID = [];

function QnAform(e) {
    e.preventDefault();

    const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
    qnaID.push(uid);
    console.log('FIRST: ' + uid);

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
        console.log('SAYA DIBUANG' + uid);
        console.log('CURRENT QNA: ' + qnaID);
    });
}

document.querySelector('#createPc').addEventListener('click', createAssessment);

function validate() {

    const title = document.querySelector('#pc-title').value;
    const desc = document.querySelector('#pc-desc').value;

    if (title != "" && desc != "") {
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

function createAssessment(e) {

    e.preventDefault();
    validate();
    console.log('KALAU ADA KOSONG TAK BOLE LALU SINI');

    db.collection("Assessment").add({
        // CREATE TITLE AND DESC
        assessmentName: document.querySelector('#pc-title').value,
        assessmentDesc: document.querySelector('#pc-desc').value,
    })
    .then((docRef) => {
        db.collection("Assessment").doc(docRef.id).update({
            // CREATE ID AND DATE
            assessmentID: docRef.id,
            date: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            // CREATE QNA
            for (let i = 0; i < qnaID.length ; i++) {
                db.collection("Assessment").doc(docRef.id).collection("Question").add({
                    question: document.querySelector('#ques' + qnaID[i]).value, 
                })
                // SUCCESS
                console.log('Assessment CREATED SUCCESSFULLY');
                alert('Alhamdulillah. Penilaian telah berjaya dicipta.');
                // setTimeout(function(){ window.location.href = "urus-penilaian.html"; }, 4000); 
            }
        })
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

}
