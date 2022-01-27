const pcID = window.location.search.substring(1);

const assessment = document.querySelector('.view-practice .form');

db.collection("Assessment").doc(pcID).onSnapshot((doc) => {
    assessment.title.value = doc.data().assessmentName;
    assessment.desc.value = doc.data().assessmentDesc;
});

const viewQNA = document.querySelector('#viewQNA');
db.collection("Assessment").doc(pcID).collection("Question").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

        const opt = `
        <div data-id='${doc.id}' class="alert alert-info fade show" role="alert">
            <br>
            <form>
            <div class="form-group">
                <textarea id="ques${doc.id}" class="form-control" placeholder="${doc.data().question}" rows="2" disabled></textarea>
            </div>
            </form>
        </div>
        `;
        viewQNA.insertAdjacentHTML('beforebegin', opt);    
    });
});