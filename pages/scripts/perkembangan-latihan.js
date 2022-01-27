const practices = [];
db.collection("Practice").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        practices.push(doc.id);
    })
})

const notDone = document.querySelector('#not-done');
const done = document.querySelector('#done');

function practicesDone(quizName, fullname, intersection, groupName) {
    const pracDone = `
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

    var currentUser = "";
    let execute = false;
    const allHalaqah = [];

    // check role - if instructor, they cannot see the button 'keseluruhan pelajar'
    db.collection("instructors").doc(user.uid).get().then((doc) => {
        if (doc.data().role == "Pengajar") {
            const btnAll = document.getElementById("btn-all");
            btnAll.style.display = "none";
        }
    });

    db.collection("TadabburGroup").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            allHalaqah.push(doc.data().adminID);
        })

        if (allHalaqah.includes(user.uid)) {
            // check the halaqah that under this respective user
            db.collection("TadabburGroup").where("adminID", "==", user.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc11) => {
                    currentUser = doc11.data().adminID;
            
                    db.collection("students").get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const studID = doc.id;
                    
                            const curr = [];
                            db.collection("students").doc(studID).collection('practices').get().then((querySnapshot) => {
                                querySnapshot.forEach((doc4) => { 
                                    curr.push(doc4.id);
                                });
                            });
                            
                            db.collection('students').doc(studID).collection('practices').get().then(doc3 => {
                                if (! execute) {
                                    db.collection("TadabburGroup").where("members", "array-contains", doc.data().fullname).where("adminID", "==", user.uid).get().then((querySnapshot) => {
                                        querySnapshot.forEach((doc7) => {
                                            execute = true;
                                            if (doc3.docs.length > 0) { 
                                                
                                                let intersection = practices.filter(x => curr.includes(x));
                                                for (let i=0 ; i < intersection.length ; i++) {
                                                    db.collection("Practice").doc(intersection[i]).get().then((doc5) => {
                                                        done.insertAdjacentHTML('beforebegin', practicesDone(doc5.data().quizName, doc.data().fullname, intersection[i], doc7.data().groupName));
                                                        
                                                        var execute = false;
                                                        const more = document.querySelector(`[data-id='${doc5.data().quizName}, ${doc.data().fullname}, ${intersection[i]}']`);
                                                        more.addEventListener('click', () => {
                                                            if (! execute) {
                                                                execute = true;
                                                                const modalTitle = document.querySelector('#resultModalLabel');
                                                                const nameStud = document.querySelector('#studentName');
                                                                const resultList = document.querySelector('#result-list');
                                                                modalTitle.innerHTML = "Keputusan " + doc5.data().quizName;
                                                                nameStud.innerHTML = "Nama pelajar: " + doc.data().fullname;
                        
                                                                db.collection('students').doc(studID).collection('practices').doc(intersection[i]).collection('Result').orderBy("numAttempt").get().then((querySnapshot) => {
                                                                    querySnapshot.forEach((doc10) => {
                                                                        console.log('sini ' + doc10.id);
                                                                        const date = doc10.data().date.toDate().toDateString() + ", " + doc10.data().date.toDate().toLocaleTimeString();
                                                                        const filter = db.collection('students').doc(studID)
                                                                        
                                                                        result = `
                                                                        <tr data-id='${doc10.id}'>
                                                                            <th scope="row">${doc10.data().numAttempt}</th>
                                                                            <td>${doc10.data().correctAns} / ${doc10.data().numOfQuestion}</td>
                                                                            <td>${date}</td>
                                                                        </tr>
                                                                        `;
                                                                        resultList.insertAdjacentHTML('beforeend', result);
                                                                    });
                                                                });
                                                            }                                        
                                                        })
                                                    });
                                                }

                                                let difference = practices.filter(x => !curr.includes(x));
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
                                }        
                            });        
                        });
                    });
                })
            })

        } else {
            
            console.log("You own no halaqah group yet.");
            db.collection("TadabburGroup").where("adminID", "!=", user.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc12) => {
                    currentUser = doc12.data().adminID;
                    
                    if (! execute) {
                        if (currentUser != user.uid) {
                            execute = true;
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
                    }
                })
            })
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