const assessments = [];
db.collection("Assessment").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        assessments.push(doc.id);
    })
})

const notDone = document.querySelector('#not-done');
const done = document.querySelector('#done');
const assessed = document.querySelector('#assessed');

function assessmentAssessed(quizName, studID, fullname, intersection, groupName) {
    const assAssessed = `
    <a href="#" onclick="window.open('keputusan-penilaian.html?one=${intersection}&two=${studID}', '_blank');" class="list-group-item listItem list-group-item-action flex-column align-items-start" data-toggle="modal" data-target="#resultModal">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${quizName}</h5>
            <small class="text-muted">${groupName}</small>
        </div>
        <div class="d-flex w-100 justify-content-between">
            <p class="mb-1">${fullname}</p>
        </div>
    </a>
    `;
    return assAssessed;
}

function assessmentsDone(quizName, studID, fullname, intersection, groupName) {
    const assDone = `
    <a href="#" onclick="window.open('jawapan-penilaian.html?one=${intersection}&two=${studID}', '_blank');" class="list-group-item listItem list-group-item-action flex-column align-items-start" data-toggle="modal" data-target="#resultModal">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${quizName}</h5>
            <small class="text-muted">${groupName}</small>
        </div>
        <div class="d-flex w-100 justify-content-between">
            <p class="mb-1">${fullname}</p>
            <button class="btn btn-xs btn-outline-info" onclick="window.open('nilai-penilaian.html?one=${intersection}&two=${studID}', '_blank');">Nilai</button>
        </div>
    </a>
    `;
    return assDone;
}

function assessmentsNotDone(quizName, groupName, fullname) {
    const assNotDone = `
    <div class="list-group-item listItem list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${quizName}</h5>
            <small class="text-muted">${groupName}</small>
        </div>
        <p class="mb-1">${fullname}</p>
    </div>
    `;
    return assNotDone;
}

auth.onAuthStateChanged((user) => {

    let execute = false;

    db.collection("students").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const studID = doc.id;
    
            const curr = [];
            db.collection("students").doc(studID).collection('assessment').get().then((querySnapshot) => {
                querySnapshot.forEach((doc4) => { 
                    curr.push(doc4.id);
                });
            });
            
            db.collection('students').doc(studID).collection('assessment').get().then(doc3 => {
                if (! execute) {
                    db.collection("TadabburGroup").where("members", "array-contains", doc.data().fullname).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc7) => {
                            execute = true;
                            if (doc3.docs.length > 0) { 
                                
                                let intersection = assessments.filter(x => curr.includes(x));
                                for (let i=0 ; i < intersection.length ; i++) {
                                    db.collection("Assessment").doc(intersection[i]).get().then((doc5) => {
                                        db.collection('students').doc(studID).collection('assessment').doc(intersection[i]).get().then(doc1 => {
                                            const status = doc1.data().status;
                                            
                                            if (status == "sedang") {
                                                done.insertAdjacentHTML('beforebegin', assessmentsDone(doc5.data().assessmentName, studID, doc.data().fullname, intersection[i], doc7.data().groupName));
                                            } else if (status == "sudah") {
                                                assessed.insertAdjacentHTML('beforebegin', assessmentAssessed(doc5.data().assessmentName, studID, doc.data().fullname, intersection[i], doc7.data().groupName));
                                            }                                                            
                                        });
                                    });
                                }

                                let difference = assessments.filter(x => !curr.includes(x));
                                for (let j=0 ; j < difference.length ; j++) {
                                    db.collection("Assessment").doc(difference[j]).get().then((doc6) => {
                                        notDone.insertAdjacentHTML('beforebegin', assessmentsNotDone(doc6.data().assessmentName, doc7.data().groupName, doc.data().fullname));
                                    });
                                }

                            } else {

                                db.collection("Assessment").get().then((querySnapshot) => {
                                    querySnapshot.forEach((doc8) => {    
                                        notDone.insertAdjacentHTML('beforebegin', assessmentsNotDone(doc8.data().assessmentName, doc7.data().groupName, doc.data().fullname));
                                    });
                                });
                            }
                        });
                    });
                }        
            });        
        });
    });     

});

function Search(item){
    var collection = document.getElementsByClassName("listItem");
    for (i = 0 ; i < collection.length ; i++) {
        if (((collection[i].innerHTML).toLowerCase()).indexOf(item) > -1) {
            collection[i].style.display = "block";
        } else {
            collection[i].style.display = "none";
        }
    }
}