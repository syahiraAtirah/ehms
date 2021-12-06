const pcID = window.location.search.substring(1);

// VIEW CURRENT TITLE AND DESCRIPTION
const practice = document.querySelector('.edit-practice .form');
db.collection("Practice").doc(pcID).onSnapshot((doc) => {
    practice.title.value = doc.data().quizName;
    practice.desc.value = doc.data().quizDesc;
});

// VIEW CURRENT QNA
const qnaID = [];
const viewQNA = document.querySelector('#viewQNA');
db.collection("Practice").doc(pcID).collection("QnA").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

        qnaID.push(doc.id);
        // console.log('ADD: ' + doc.id);

        const opt = `
        <div data-id='${doc.id}' class="alert alert-info fade show" role="alert">
            <a href="#" class="close btn-delete1" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></a>
            <br>
            <form>
            <div class="form-group">
                <textarea id="ques${doc.id}" class="form-control" placeholder="Soalan" rows="2"></textarea>
            </div>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">A</span></div>
                <input id="opt1${doc.id}" type="text" placeholder="Pilihan jawapan" class="form-control">
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="cb1${doc.id}" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">B</span></div>
                <input id="opt2${doc.id}" type="text" placeholder="Pilihan jawapan" class="form-control">
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="cb2${doc.id}" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">C</span></div>
                <input id="opt3${doc.id}" type="text" placeholder="Pilihan jawapan" class="form-control">
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="cb3${doc.id}" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">D</span></div>
                <input id="opt4${doc.id}" type="text" placeholder="Pilihan jawapan" class="form-control">
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="cb4${doc.id}" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>
            </form>
        </div>
        `;
        viewQNA.insertAdjacentHTML('beforebegin', opt);

        // INSERT DATA OF QNA INTO THE FIELDS
        document.getElementById("ques" + doc.id).value = doc.data().question;
        document.getElementById("opt1" + doc.id).value = doc.data().opt1;
        document.getElementById("opt2" + doc.id).value = doc.data().opt2;
        document.getElementById("opt3" + doc.id).value = doc.data().opt3;
        document.getElementById("opt4" + doc.id).value = doc.data().opt4;

        console.log('CURRENT QNA [qnaID]: ' + qnaID);

        // remove data-id of QNA from the array
        const btnDelete1 = document.querySelector(`[data-id='${doc.id}'] .btn-delete1`);
        btnDelete1.addEventListener('click', () => {
            const IDindex = qnaID.indexOf(doc.id);
            qnaID.splice(IDindex, 1); 
            console.log('DIBUANG: ' + doc.id + ', CURRENT QNA: ' + qnaID);
        });

        // VIEW CURRENT CORRECT ANSWER
        for (let i=0 ; i < 4 ; i++) {
            const id = doc.id;
            const opt1 = doc.data().opt1;
            const opt2 = doc.data().opt2;
            const opt3 = doc.data().opt3;
            const opt4 = doc.data().opt4;
            const ans = doc.data().answer;

            if (opt1 == ans[i]) {
                document.getElementById("cb1" + id).checked = true;
            } else if (opt2 == ans[i]) {
                document.getElementById("cb2" + id).checked = true;
            } else if (opt3 == ans[i]) {
                document.getElementById("cb3" + id).checked = true;
            } else if (opt4 == ans[i]) {
                document.getElementById("cb4" + id).checked = true;
            }
            
        }
    
    });
});

// ADD NEW QNA
const addQues = document.querySelector('#addQues');
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

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">A</span></div>
                <input id="opt1${uid}" type="text" placeholder="Pilihan jawapan" class="form-control" required>
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="cb1${uid}" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">B</span></div>
                <input id="opt2${uid}" type="text" placeholder="Pilihan jawapan" class="form-control" required>
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="cb2${uid}" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">C</span></div>
                <input id="opt3${uid}" type="text" placeholder="Pilihan jawapan" class="form-control">
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="cb3${uid}" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">D</span></div>
                <input id="opt4${uid}" type="text" placeholder="Pilihan jawapan" class="form-control">
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="cb4${uid}" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>
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
document.querySelector('#createPc').addEventListener('click', updatePractice);
function validate() {

    const title = document.querySelector('#pc-title').value;
    const desc = document.querySelector('#pc-desc').value;

    if (title != "" && desc != "") {
        
        for (let i = 0; i < qnaID.length ; i++) {
            var checking = false;

            const question = document.querySelector('#ques' + qnaID[i]).value;
            const opt1 = document.querySelector('#opt1' + qnaID[i]).value;
            const opt2 = document.querySelector('#opt2' + qnaID[i]).value;
    
            for (let j=1 ; j < 5 ; j++) {
                const cbID = "cb" + j + qnaID[i];
                const cb = document.getElementById(cbID);
                if (cb.checked) {
                    // console.log('checked: ' + cb.id);
                    checking = true;
                    break;
                } 
            }
    
            if (question != "" && opt1 != "" && opt2 != "") {
                if(checking) {
                    console.log("--- TIADA KOSONGGG ---");
                } else {
                    // console.log(checking);
                    console.log("--- ADA KOSONGGG PADA CHECKBOX ---");
                    alert('Terdapat kekosongan pada jawapan yang betul. Sila semak semula dan pastikan kotak jawapan yang betul tersebut disemak, sekurang-kurangnya satu semakkan bagi setiap soalan.')
                    throw new Error('This is not an error. This is just to abort javascript');
                }
            } else {
                console.log("--- ADA KOSONGGG SOALAN / PIL JWPN ---");
                alert('Terdapat kekosongan sama ada pada Soalan atau Pilihan jawapan. Sila semak semula dan pastikan ruang kosong tersebut diisi.')
                throw new Error('This is not an error. This is just to abort javascript');
            }
        }
    } else {
        console.log("--- ADA KOSONGGG TAJUK / DESC ---");
        alert('Terdapat kekosongan sama ada pada Tajuk latihan atau Penerangan. Sila semak semula dan pastikan ruang kosong tersebut diisi.')
        throw new Error('This is not an error. This is just to abort javascript');
    }

}

function updatePractice(e) {

    e.preventDefault();
    validate();
    console.log('KALAU ADA KOSONG TAK BOLE LALU SINI');
    
    
    // DELETE REMOVED QNA
    db.collection("Practice").doc(pcID).collection("QnA").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // for (let m=0 ; m < qnaID.length ; m++) {
                if (! qnaID.includes(doc.id)) {
                    db.collection("Practice").doc(pcID).collection("QnA").doc(doc.id).delete().then(() => {
                        console.log(doc.id + " successfully deleted!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                }
            // }
        });
    });
   

    db.collection("Practice").doc(pcID).update({
        quizName: document.querySelector('#pc-title').value,
        quizDesc: document.querySelector('#pc-desc').value,
        date: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
        // UPDATE EXISTING QNA
        for (let i = 0; i < qnaID.length ; i++) {
            db.collection("Practice").doc(pcID).collection("QnA").doc(qnaID[i]).update({
                question: document.querySelector('#ques' + qnaID[i]).value, 
                opt1: document.querySelector('#opt1' + qnaID[i]).value,
                opt2: document.querySelector('#opt2' + qnaID[i]).value,
                opt3: document.querySelector('#opt3' + qnaID[i]).value,
                opt4: document.querySelector('#opt4' + qnaID[i]).value,
            })
            .then(() => {
                console.log('----------- UPDATED EXISTING QUES : ' + qnaID[i] + "------------");
                // UPDATE CORRECT ANSWER
                db.collection("Practice").doc(pcID).collection("QnA").doc(qnaID[i]).get().then((doc) => {
                    const ans = doc.data().answer;

                    // kosongkan dulu answer[]
                    for (let k=0 ; k < ans.length ; k++) {
                        db.collection("Practice").doc(pcID).collection("QnA").doc(qnaID[i]).update({
                            answer: firebase.firestore.FieldValue.arrayRemove(ans[k])
                        })
                    }

                    for (let j=1 ; j < 5 ; j++) {
                        const cbID = "cb" + j + qnaID[i];
                        const cbValue = "opt" + j + qnaID[i];
                        const cb = document.getElementById(cbID);
                        const data = document.getElementById(cbValue);
                        
                        if (cb.checked == true) {
                            console.log('CHECKED: ' + cb.id);
                            // console.log('value: ' + data.value);
                            // console.log('pcID = ' + pcID);
                            // console.log('docRef2.id = ' + qnaID[i]);
                            db.collection("Practice").doc(pcID).collection("QnA").doc(qnaID[i]).update({
                                answer: firebase.firestore.FieldValue.arrayUnion(data.value),
                            })
                        } 
                        console.log('----------- UPDATED EXISTING ANSWER : ' + qnaID[i] + "------------");
                    } 
                })
            })
        }
    })
    .then(() => {
        // ADD NEW QNA
        const comp = [];
        db.collection("Practice").doc(pcID).collection("QnA").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                comp.push(doc.id);
            });
        })
        .then(() => {
            console.log('COMPARE ------------ ' + comp);
            for (let n=0 ; n < qnaID.length ; n++) {
                if (! comp.includes(qnaID[n])) {

                    console.log('kat sini ----> current  : ' + qnaID);
                    console.log('kat sini ----> qnaID[n] : ' + qnaID[n]);
                    console.log('kat sini ----> comp     : ' + comp);
                    
                    db.collection("Practice").doc(pcID).collection("QnA").add({
                        question: document.querySelector('#ques' + qnaID[n]).value, 
                        opt1: document.querySelector('#opt1' + qnaID[n]).value,
                        opt2: document.querySelector('#opt2' + qnaID[n]).value,
                        opt3: document.querySelector('#opt3' + qnaID[n]).value,
                        opt4: document.querySelector('#opt4' + qnaID[n]).value,
                    })
                    .then((docRef2) => {
                        console.log('----------- ADDED NEW QUES : ' + qnaID[n] + "------------");

                        // CREATE CORRECT ANSWER
                        for (let j=1 ; j < 5 ; j++) {
                            const cbID = "cb" + j + qnaID[n];
                            const cbValue = "opt" + j + qnaID[n];
                            const cb = document.getElementById(cbID);
                            const data = document.getElementById(cbValue);
                            if (cb.checked == true) {
                                console.log('checked: ' + cb.id);
                                // console.log('value: ' + data.value);
                                // console.log('docRef2.id = ' + docRef2.id);
                                db.collection("Practice").doc(pcID).collection("QnA").doc(docRef2.id).update({
                                    answer: firebase.firestore.FieldValue.arrayUnion(data.value)
                                })
                            }
                            console.log('----------- ADDED NEW ANSWER : ' + qnaID[n] + "------------");
                        }                             
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
        console.log('PRACTICE CREATED SUCCESSFULLY');
        alert('Alhamdulillah. Latihan telah berjaya disunting.');
        // -------------window.location.href = "urus-latihan.html";
    })
}