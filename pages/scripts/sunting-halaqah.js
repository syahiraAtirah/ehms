//
//
// 1. 'Belum mempunyai pelajar' still display even dh ada ahli
// 2. nnti test 'Tiada pelajar baru. Semua pelajar telah didaftarkan pada kumpulan-kumpulan halaqah yang sedia ada.'
// 

const gpID = window.location.search.substring(1);

// render all instructors - OPTIONS
const allInstructor = document.querySelector('.admin-list');
const renderInstructor = doc => {
    const opt = `
        <option>${doc.data().fullname}</option>
    `;
    allInstructor.insertAdjacentHTML('beforeend', opt);
}
db.collection("instructors").onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        renderInstructor(doc);
    });
});

const newStudent = document.querySelector('#new-student');
function viewNewStudents(newStud) {
    const student = `
        <li data-id='${newStud}' class="list-group-item d-flex justify-content-between align-items-center">
            ${newStud}
            <div class="switch-button switch-button-xs">
                <input type="checkbox" name="${newStud}" id="${newStud}">
                <span><label for="${newStud}"></label></span>
            </div>
        </li>
    `;
    return student;
}

const memberList = document.querySelector('#memberlist');
function viewMemberList(member) {
    const memberr = `
        <li data-id='${member}' class="list-group-item d-flex justify-content-between align-items-center">
            ${member}
            <button id="${member}" class="btn btn-sm btn-outline-light" data-toggle="modal" data-target="#removeMember" onclick="removeMember('${member}')"><i class="far fa-trash-alt"></i></button>
        </li>
    `;
    return memberr;
}

// view halaqah data in form and the current member in 'Pelajar Terkini' section
const halaqah = document.querySelector('.halaqah .formGp');
const noStudentYet = document.querySelector('#noStudYet');


const allStudents = [];
const membersWithHalaqah = [];
const noNewStudent = document.querySelector('#noNewStud');
auth.onAuthStateChanged(() => {

    db.collection("TadabburGroup").doc(gpID).onSnapshot((doc) => {
        // display halaqah name and it's admin
        halaqah.groupName.value = doc.data().groupName;
        halaqah.admin.value = doc.data().admin;
    
        // display current members in that halaqah
        const members = doc.data().members;
        if(members.length > 0) { 
            for(let i = 0; i < members.length; i++){
                memberList.insertAdjacentHTML('beforeend', viewMemberList(members[i]));
            }
        } else {
            const li = `<li class="list-group-item d-flex justify-content-between align-items-center"> Belum mempunyai pelajar </li>`;
            noStudentYet.innerHTML = li;
        }
    });

    db.collection("students").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            allStudents.push(doc.data().fullname);
        })

        db.collection("TadabburGroup").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const members = doc.data().members;
                if(members.length > 0) {
                    for(let i = 0; i < members.length; i++) {
                        membersWithHalaqah.push(doc.data().members[i]);
                    }
                }
            });

            // display students that have no halaqah yet
            let difference = allStudents.filter(x => !membersWithHalaqah.includes(x));
            if (difference.length > 0) {
                for (let k=0 ; k < difference.length ; k++) {
                    newStudent.insertAdjacentHTML('beforeend', viewNewStudents(difference[k]));
                }
            } else {
                const li = `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Tiada pelajar baru. Semua pelajar telah didaftarkan pada kumpulan-kumpulan halaqah yang sedia ada. 
                    </li>
                `;
                noNewStudent.innerHTML = li;
                document.querySelector('#btnTmbhPelajar').disabled = true;
            }
        });
    })
});

// edit halaqah name or admin
document.querySelector('#editgp').addEventListener('click', editHalaqah);
function editHalaqah(e) {

    e.preventDefault();

    db.collection("instructors").where("fullname", "==", halaqah.admin.value).onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection('TadabburGroup').doc(gpID).update({
                groupName: halaqah.groupName.value,
                admin: halaqah.admin.value,
                adminID: doc.id
            }).then(() => {
                alert('Data berjaya disunting.');
                setTimeout(function(){
                    document.location.reload();
                }, 400);
            })
        });
    });
};

// remove selected current's member
const removeBody = document.querySelector('#body-remove-modal');
function removeMember(removeName) {
    removeBody.innerHTML = "Adakah anda pasti mahu mengeluarkan " + removeName + " daripada halaqah ini?";
    document.querySelector('.btn-delete2').addEventListener('click', () => {
        const selectMember = db.collection("TadabburGroup").doc(gpID);
        selectMember.update({
            members: firebase.firestore.FieldValue.arrayRemove(removeName)
        });
        setTimeout(function(){
            document.location.reload();
        }, 400);
    })
}

// add members
// const addStudDescription = document.querySelector('#addStudDes');
function addMembers() {
    let difference = allStudents.filter(x => !membersWithHalaqah.includes(x));
    for (let k=0 ; k < difference.length ; k++) {
        const name = difference[k];
        const cb = document.getElementById(name);

        if (cb.checked == true) {
            const addStud = db.collection("TadabburGroup").doc(gpID);
            addStud.update({
                members: firebase.firestore.FieldValue.arrayUnion(cb.name)
            });
        }
    }
    setTimeout(function(){
        document.location.reload();
    }, 600);
}