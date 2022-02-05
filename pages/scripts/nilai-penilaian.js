const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const assID = urlParams.get('one');
const studID = urlParams.get('two');

const assessment = document.querySelector('.view-ass .form');
db.collection("Assessment").doc(assID).onSnapshot((doc) => {
    assessment.title.value = doc.data().assessmentName;
    assessment.description.value = doc.data().assessmentDesc;
});

function QNA (id, ques, url) {
    const opt = `
    <div data-id='${id}' class="alert alert-info fade show" role="alert">
        <form>
            <div class="form-group">
                <textarea id="ques${id}" class="form-control" placeholder="${ques}" rows="2" disabled></textarea>
                <br>
                <audio controls> 
                    <source src="${url}" type="audio/x-wav"> 
                </audio>
                <br><br>
                <div class="form-group">
                    <label for="comment${id}">Ulasan:</label>
                    <textarea class="form-control" name="comment" id="comment${id}" rows="3"></textarea>
                </div>
            </div>
        </form>
    </div>
    `;
    return opt; 
}

const commentedID = [];
let j = 0;
const viewQNA = document.querySelector('#viewQNA');
db.collection("students").doc(studID).collection("assessment").doc(assID).onSnapshot((doc1) => {
    
    if (j < doc1.data().voiceUrl.length) {
        db.collection("Assessment").doc(assID).collection("Question").get().then((querySnapshot) => {
            querySnapshot.forEach((doc2) => { 
                const temp = 'comment' + doc2.id;
                commentedID.push(temp);
                viewQNA.insertAdjacentHTML('beforeend', QNA (doc2.id, doc2.data().question, doc1.data().voiceUrl[j++]));    
            });
        });
    }
});

function validate() {
    for (let i=0 ; i < commentedID.length ; i++) {
        const comment = document.getElementById(commentedID[i]).value;
        const result = document.getElementById('ass-result').value;

        if (comment == "") {
            console.log("--- ADA KOSONGGG PADA ULASAN ---");
            alert('Terdapat kekosongan pada Ulasan penilaian. Sila semak semula dan pastikan ruang kosong tersebut diisi.')
            throw new Error('This is not an error. This is just to abort javascript');
        } else if (result == "") {
            console.log("--- ADA KOSONGGG PADA KEPUTUSAN KESELURUHAN ---");
            alert('Terdapat kekosongan pada Keputusan Keseluruhan. Sila semak semula dan pastikan ruang kosong tersebut diisi.')
            throw new Error('This is not an error. This is just to abort javascript');
        } else {
            console.log("--- ALL GOOD, TIADA KOSONG ---");
        }
    }
}

document.querySelector('#submitAss').addEventListener('click', submitAssessment);
function submitAssessment(e) {

    e.preventDefault();
    validate();
    console.log('KALAU ADA KOSONG TAK BOLE LALU SINI');

    for (let i=0 ; i < commentedID.length ; i++) {
        const commentValue = document.getElementById(commentedID[i]).value;
        db.collection("students").doc(studID).collection("assessment").doc(assID).update({
            comment: firebase.firestore.FieldValue.arrayUnion(commentValue),
            status: "sudah",
            result: document.querySelector('#ass-result').value,
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
    }
    
    console.log('Assessment SUBMITTED SUCCESSFULLY');
    alert('Alhamdulillah. Penilaian telah berjaya dinilai.');
    
}
    