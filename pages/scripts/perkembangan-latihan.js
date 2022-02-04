const practices = [];
db.collection("Practice").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        practices.push(doc.id);
    })
})

const done = document.querySelector('#done');
function practicesDone(quizName, fullname, intersection, groupName) {
    var pracDone = `
    <a href="#" data-id='${quizName}, ${fullname}, ${intersection}' class="list-group-item listItem list-group-item-action flex-column align-items-start" data-toggle="modal" data-target="#resultModal">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${quizName}</h5>
            <small class="text-muted">${groupName}</small>
        </div>
        <p class="mb-1">${fullname}</p>
    </a>
    `;
    return pracDone;
}

const notDone = document.querySelector('#not-done');
function practicesNotDone(quizName, groupName, fullname) {
    const pracNotDone = `
    <div class="list-group-item listItem list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${quizName}</h5>
            <small class="text-muted">${groupName}</small>
        </div>
        <p class="mb-1">${fullname}</p>
    </div>
    `;
    return pracNotDone;
}

auth.onAuthStateChanged((user) => {

    // check role - if instructor, they cannot see the button 'keseluruhan pelajar'
    db.collection("instructors").doc(user.uid).get().then((doc) => {
        if (doc.data().role == "Pengajar") {
            const btnAll = document.getElementById("btn-all");
            btnAll.style.display = "none";
        }
    });

    const allHalaqah = [];
    db.collection("TadabburGroup").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            allHalaqah.push(doc.data().adminID);
        })

        if (allHalaqah.length > 0) {
            if (allHalaqah.includes(user.uid)) {
                db.collection("students").get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const studID = doc.id;
                
                        const pracDoneByStuds = [];
                        db.collection("students").doc(studID).collection('practices').get().then((querySnapshot) => {
                            querySnapshot.forEach((doc4) => { 
                                pracDoneByStuds.push(doc4.id);
                            });
                        });
                        
                        db.collection('students').doc(studID).collection('practices').get().then(doc3 => {
                            db.collection("TadabburGroup").where("members", "array-contains", doc.data().fullname).where("adminID", "==", user.uid).get().then((querySnapshot) => {
                                querySnapshot.forEach((doc7) => {
                                    if (doc3.docs.length > 0) { 
                                        
                                        let intersection = practices.filter(x => pracDoneByStuds.includes(x));
                                        console.log(intersection);
                                        for (let i=0 ; i < intersection.length ; i++) {
                                            db.collection("Practice").doc(intersection[i]).get().then((doc5) => {
                                                done.insertAdjacentHTML('beforebegin', practicesDone(doc5.data().quizName, doc.data().fullname, intersection[i], doc7.data().groupName, studID));
                                                
                                                const resultList = document.querySelector('#result-list');
                                                const more = document.querySelector(`[data-id='${doc5.data().quizName}, ${doc.data().fullname}, ${intersection[i]}']`);
                                                more.addEventListener('click', () => {
    
                                                    db.collection('students').doc(studID).collection('practices').doc(intersection[i]).collection('Result').orderBy("numAttempt").get().then((querySnapshot) => {
                                                        querySnapshot.forEach((doc10) => {
    
                                                            var result = ``;
                                                            const modalTitle = document.querySelector('#resultModalLabel');
                                                            const nameStud = document.querySelector('#studentName');
                                                            modalTitle.innerHTML = "Keputusan " + doc5.data().quizName;
                                                            nameStud.innerHTML = "Nama pelajar: " + doc.data().fullname;
                                                            const date = doc10.data().date.toDate().toDateString() + ", " + doc10.data().date.toDate().toLocaleTimeString();
                                                            
                                                            result = `
                                                            <tr id='${doc10.id}'>
                                                                <th scope="row">${doc10.data().numAttempt}</th>
                                                                <td>${doc10.data().correctAns} / ${doc10.data().numOfQuestion}</td>
                                                                <td>${date}</td>
                                                            </tr>
                                                            `;
                                                            resultList.innerHTML += result;
                                                        })
                                                    });
                                                    resultList.innerHTML = '';
                                                });
                                            });
                                        }
    
                                        let difference = practices.filter(x => !pracDoneByStuds.includes(x));
                                        for (let j=0 ; j < difference.length ; j++) {
                                            db.collection("Practice").doc(difference[j]).get().then((doc6) => {
                                                notDone.insertAdjacentHTML('beforebegin', practicesNotDone(doc6.data().quizName, doc7.data().groupName, doc.data().fullname));
                                            });
                                        }
    
                                    } else {
    
                                        db.collection("Practice").get().then((querySnapshot) => {
                                            querySnapshot.forEach((doc8) => {    
                                                notDone.insertAdjacentHTML('beforebegin', practicesNotDone(doc8.data().quizName, doc7.data().groupName, doc.data().fullname));
                                            });
                                        });
                                    }
                                });
                            });
                        });        
                    });
                });
    
            } else {
                
                console.log("You own no halaqah group yet.");
                db.collection("TadabburGroup").where("adminID", "!=", user.uid).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc12) => {
                        
                        if (doc12.data().adminID != user.uid) {
                            const pracHeader1 = document.getElementById("practice-header1");
                            pracHeader1.style.display = "none";
                            const pracHeader2 = document.getElementById("practice-header2");
                            pracHeader2.style.display = "none";
                            const pracHeader3 = document.getElementById("practice-searchbar");
                            pracHeader3.style.display = "none";
                
                            const notAvailable = document.getElementById("not-available");
                            const zero = `
                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                <div class="card">
                                    <p class="list-group-item list-group-item-danger text-center">Maaf, anda belum mempunyai halaqah. Sila semak dari semasa ke semasa. Admin akan memberikan anda halaqah dalam masa yang terdekat.</p>
                                </div>
                            </div>
                            `;
                            notAvailable.insertAdjacentHTML('beforeend', zero);
                        }
                    })
                })
            }
        } else {
            console.log("No halaqah created yet.");
            const pracHeader1 = document.getElementById("practice-header1");
            pracHeader1.style.display = "none";
            const pracHeader2 = document.getElementById("practice-header2");
            pracHeader2.style.display = "none";
            const pracHeader3 = document.getElementById("practice-searchbar");
            pracHeader3.style.display = "none";

            const notAvailable = document.getElementById("not-available");
            const zero = `
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div class="card">
                    <p class="list-group-item list-group-item-danger text-center">Maaf, tiada halaqah lagi yang diwujudkan setakat ini. Sila ke 'Urus Halaqah' untuk menciptakan halaqah baru.</p>
                </div>
            </div>
            `;
            notAvailable.insertAdjacentHTML('beforeend', zero);
        }
        
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