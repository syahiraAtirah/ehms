const pcID = window.location.search.substring(1);

const practice = document.querySelector('.view-practice .form');

db.collection("Practice").doc(pcID).onSnapshot((doc) => {
    practice.title.value = doc.data().quizName;
    practice.desc.value = doc.data().quizDesc;
});

function QNA (id, ques, opt1, opt2, opt3) {
    const opt = `
        <div data-id='${id}' class="alert alert-info fade show" role="alert">
            <br>
            <form>
            <div class="form-group">
                <textarea id="ques${id}" class="form-control" placeholder="${ques}" rows="2" disabled></textarea>
            </div>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">A</span></div>
                <input id="opt1${id}" type="text" placeholder="${opt1}" class="form-control" disabled>
            </div>
            <label class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="cb1${id}" name="${id}" class="custom-control-input" disabled><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">B</span></div>
                <input id="opt2${id}" type="text" placeholder="${opt2}" class="form-control" disabled>
            </div>
            <label class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="cb2${id}" name="${id}" class="custom-control-input" disabled><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">C</span></div>
                <input id="opt3${id}" type="text" placeholder="${opt3}" class="form-control" disabled>
            </div>
            <label class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="cb3${id}" name="${id}" class="custom-control-input" disabled><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>
            </form>
        </div>
        `;
    
    return opt; 
}

const viewQNA = document.querySelector('#viewQNA');

db.collection("Practice").doc(pcID).collection("QnA").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

        viewQNA.insertAdjacentHTML('beforeend', QNA(doc.id, doc.data().question, doc.data().opt1, doc.data().opt2, doc.data().opt3));

        console.log('-------------- QNA ID : ' + doc.id + ' --------------');
        // VIEW CURRENT CORRECT ANSWER
            const id = doc.id;
            const opt1 = doc.data().opt1;
            const opt2 = doc.data().opt2;
            const opt3 = doc.data().opt3;
            const ans = doc.data().answer;

            if (opt1 == ans) {
                document.getElementById("cb1" + id).checked = true;
            } else if (opt2 == ans) {
                document.getElementById("cb2" + id).checked = true;
            } else if (opt3 == ans) {
                document.getElementById("cb3" + id).checked = true;
            } 
    
    });
});