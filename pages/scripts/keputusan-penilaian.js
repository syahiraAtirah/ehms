const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const assID = urlParams.get('one');
const studID = urlParams.get('two');


const assessment = document.querySelector('.view-ass .form');

db.collection("Assessment").doc(assID).onSnapshot((doc) => {
    assessment.title.value = doc.data().assessmentName;
    assessment.desc.value = doc.data().assessmentDesc;
});

function QNA (id, ques, url, comment) {
    const opt = `
    <div data-id='${id}' class="alert alert-info fade show" role="alert">
        <form>
            <div class="form-group">
                <textarea id="ques${id}" class="form-control" placeholder="${ques}" rows="2" disabled></textarea>
                <br>
                <audio controls> 
                    <source src="${url}" type="audio/x-wav"> 
                </audio> 
                <hr>
                <div class="form-group">
                    <label for="comment${id}">Keputusan:</label>
                    <textarea class="form-control" name="comment" placeholder="${comment}" id="comment${id}" rows="2" disabled></textarea>
                </div>
            </div>
        </form>
    </div>
    `;
    return opt; 
}

const viewQNA = document.querySelector('#viewQNA');

db.collection("students").doc(studID).collection("assessment").doc(assID).onSnapshot((doc1) => {
    let i = 0;
    if (i < doc1.data().voiceUrl.length) {
        db.collection("Assessment").doc(assID).collection("Question").get().then((querySnapshot) => {
            querySnapshot.forEach((doc2) => { 
                viewQNA.insertAdjacentHTML('beforeend', QNA (doc2.id, doc2.data().question, doc1.data().voiceUrl[i], doc1.data().comment[i]));    
                i++;
            });
            
        });
        
    }
    assessment.result.value = doc1.data().result;
});

    