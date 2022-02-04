const assID = window.location.search.substring(1);

const assessment = document.querySelector('.view-practice .form');

db.collection("Assessment").doc(assID).onSnapshot((doc) => {
    assessment.title.value = doc.data().assessmentName;
    assessment.desc.value = doc.data().assessmentDesc;
});

function QNA (id, ques) {
    const opt = `
    <div data-id='${id}' class="alert alert-info fade show" role="alert">
        <br>
        <form>
        <div class="form-group">
            <textarea id="ques${id}" class="form-control" placeholder="${ques}" rows="2" disabled></textarea>
        </div>
        </form>
    </div>
    `;
    
    return opt; 
}

const viewQNA = document.querySelector('#viewQNA');

db.collection("Assessment").doc(assID).collection("Question").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

        viewQNA.insertAdjacentHTML('beforeend', QNA (doc.id, doc.data().question));    
    });
});