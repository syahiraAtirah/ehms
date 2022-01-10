const pcID = window.location.search.substring(1);

const practice = document.querySelector('.view-practice .form');

db.collection("Practice").doc(pcID).onSnapshot((doc) => {
    practice.title.value = doc.data().quizName;
    practice.desc.value = doc.data().quizDesc;
});

const viewQNA = document.querySelector('#viewQNA');
db.collection("Practice").doc(pcID).collection("QnA").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

        const opt = `
        <div data-id='${doc.id}' class="alert alert-info fade show" role="alert">
            <br>
            <form>
            <div class="form-group">
                <textarea id="ques${doc.id}" class="form-control" placeholder="${doc.data().question}" rows="2" disabled></textarea>
            </div>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">A</span></div>
                <input id="opt1${doc.id}" type="text" placeholder="${doc.data().opt1}" class="form-control" disabled>
            </div>
            <label class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="cb1${doc.id}" name="${doc.id}" class="custom-control-input" disabled><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">B</span></div>
                <input id="opt2${doc.id}" type="text" placeholder="${doc.data().opt2}" class="form-control" disabled>
            </div>
            <label class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="cb2${doc.id}" name="${doc.id}" class="custom-control-input" disabled><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">C</span></div>
                <input id="opt3${doc.id}" type="text" placeholder="${doc.data().opt3}" class="form-control" disabled>
            </div>
            <label class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="cb3${doc.id}" name="${doc.id}" class="custom-control-input" disabled><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>
            </form>
        </div>
        `;
        viewQNA.insertAdjacentHTML('beforebegin', opt);

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