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

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">A</span></div>
                <input id="opt1${uid}" type="text" placeholder="Pilihan jawapan" class="form-control" required>
            </div>
            <label class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="cb1${uid}" name="${uid}" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">B</span></div>
                <input id="opt2${uid}" type="text" placeholder="Pilihan jawapan" class="form-control" required>
            </div>
            <label class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="cb2${uid}" name="${uid}" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">C</span></div>
                <input id="opt3${uid}" type="text" placeholder="Pilihan jawapan" class="form-control">
            </div>
            <label class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="cb3${uid}" name="${uid}" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
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
        console.log('SAYA DIBUANG' + uid);
        console.log('CURRENT QNA: ' + qnaID);
    });
}

document.querySelector('#createPc').addEventListener('click', createPractice);

function validate() {

    const title = document.querySelector('#pc-title').value;
    const desc = document.querySelector('#pc-desc').value;

    if (title != "" && desc != "") {
        
        for (let i = 0; i < qnaID.length ; i++) {
            var checking = false;

            const question = document.querySelector('#ques' + qnaID[i]).value;
            const opt1 = document.querySelector('#opt1' + qnaID[i]).value;
            const opt2 = document.querySelector('#opt2' + qnaID[i]).value;
            const opt3 = document.querySelector('#opt3' + qnaID[i]).value;
    
            for (let j=1 ; j < 4 ; j++) {
                const cbID = "cb" + j + qnaID[i];
                const cb = document.getElementById(cbID);
                if (cb.checked) {
                    console.log('checked: ' + cb.id);
                    checking = true;
                    break;
                } 
            }
    
            if (question != "" && opt1 != "" && opt2 != "" && opt3 != "") {
                if(checking) {
                    console.log("--- TIADA KOSONGGG ---");
                } else {
                    console.log(checking);
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

function createPractice(e) {

    e.preventDefault();
    validate();
    console.log('KALAU ADA KOSONG TAK BOLE LALU SINI');

    db.collection("Practice").add({
        // CREATE TITLE AND DESC
        quizName: document.querySelector('#pc-title').value,
        quizDesc: document.querySelector('#pc-desc').value,
    })
    .then((docRef) => {
        db.collection("Practice").doc(docRef.id).update({
            // CREATE ID AND DATE
            quizID: docRef.id,
            date: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            // CREATE QNA
            for (let i = 0; i < qnaID.length ; i++) {
                db.collection("Practice").doc(docRef.id).collection("QnA").add({
                    question: document.querySelector('#ques' + qnaID[i]).value, 
                    opt1: document.querySelector('#opt1' + qnaID[i]).value,
                    opt2: document.querySelector('#opt2' + qnaID[i]).value,
                    opt3: document.querySelector('#opt3' + qnaID[i]).value,
                })
                .then((docRef2) => {
                    // CREATE CORRECT ANSWER
                    for (let j=1 ; j < 4 ; j++) {
                        const cbID = "cb" + j + qnaID[i];
                        const cbValue = "opt" + j + qnaID[i];
                        const cb = document.getElementById(cbID);
                        const data = document.getElementById(cbValue);
                        if (cb.checked == true) {
                            console.log('checked: ' + cb.id);
                            console.log('value: ' + data.value);
                            console.log('docRef.id = ' + docRef.id);
                            console.log('docRef2.id = ' + docRef2.id);
                            db.collection("Practice").doc(docRef.id).collection("QnA").doc(docRef2.id).update({
                                answer: data.value,
                            });
                            break;
                        }
                    } 
                })
            }
            // SUCCESS
            console.log('PRACTICE CREATED SUCCESSFULLY');
            alert('Alhamdulillah. Latihan telah berjaya dicipta.');
            setTimeout(function(){ window.location.href = "urus-latihan.html"; }, 4000); 
        })
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

}
