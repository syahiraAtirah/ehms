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
                <textarea id="ques" class="form-control" placeholder="${doc.data().question}" rows="2" disabled></textarea>
            </div>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">A</span></div>
                <input id="opt1" type="text" placeholder="${doc.data().opt1}" class="form-control" disabled>
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="${doc.data().opt1}" class="custom-control-input" disabled><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">B</span></div>
                <input id="opt2" type="text" name="${doc.data().opt2}" placeholder="${doc.data().opt2}" class="form-control" disabled>
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="${doc.data().opt2}" class="custom-control-input" disabled><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">C</span></div>
                <input id="opt3" type="text" name="${doc.data().opt3}" placeholder="${doc.data().opt3}" class="form-control" disabled>
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="${doc.data().opt3}" class="custom-control-input" disabled><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">D</span></div>
                <input id="opt4" type="text" name="${doc.data().opt4}" placeholder="${doc.data().opt4}" class="form-control" disabled>
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" id="${doc.data().opt4}" class="custom-control-input" disabled><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>
            </form>
        </div>
        `;
        viewQNA.insertAdjacentHTML('beforebegin', opt);

        for (let i=0 ; i < 4 ; i++) {
            const opt1 = doc.data().opt1;
            const opt2 = doc.data().opt2;
            const opt3 = doc.data().opt3;
            const opt4 = doc.data().opt4;
            const ans = doc.data().answer;

            if (opt1 == ans[i]) {
                document.getElementById(opt1).checked = true;
            } else if (opt2 == ans[i]) {
                document.getElementById(opt2).checked = true;
            } else if (opt3 == ans[i]) {
                document.getElementById(opt3).checked = true;
            } else if (opt4 == ans[i]) {
                document.getElementById(opt4).checked = true;
            }
            
        }
    
    });
});