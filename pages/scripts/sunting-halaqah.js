//
//
// 1. Nanti figure out mcm mana nk buat 'Tiada pelajar baru', when all registered students already been assigned to halaqah
// 2. Cantikkan modal when use addMembers() - its good to dislpay selected members before actually add it to db
//
//
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

// view halaqah data in form
const halaqah = document.querySelector('.halaqah .formGp');
const memberList = document.querySelector('#memberlist');
db.collection("TadabburGroup").doc(gpID).get().then((doc) => {
    halaqah.groupName.value = doc.data().groupName;
    halaqah.admin.value = doc.data().admin;
    const members = doc.data().members;
    if(members.length > 0) { 
        for(let i = 0; i < members.length; i++){
            const li = `
                <li data-id1='${members[i]}' class="list-group-item d-flex justify-content-between align-items-center">
                    ${members[i]}
                    <button id="${members[i]}" class="btn btn-sm btn-outline-light" data-toggle="modal" data-target="#removeMember" onclick="removeMember('${members[i]}', '${doc.data().groupName}')"><i class="far fa-trash-alt"></i></button>
                </li>
            `;
            memberList.insertAdjacentHTML('beforeend', li);
        }
    } else {
        const li = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Belum mempunyai pelajar 
            </li>
        `;
        memberList.insertAdjacentHTML('beforeend', li);
    }
});

// remove selected of current's member
const removeBody = document.querySelector('#body-remove-modal');
function removeMember(removeName, removeGp) {
    removeBody.innerHTML = "Adakah anda pasti mahu mengeluarkan " + removeName + " daripada " + removeGp + "?";
    document.querySelector('.btn-delete2').addEventListener('click', () => {
        const selectMember = db.collection("TadabburGroup").doc(gpID);
        selectMember.update({
            members: firebase.firestore.FieldValue.arrayRemove(removeName)
        });
        let tr = document.querySelector(`[data-id1='${removeName}']`);
        console.log('tr: ' + tr);
        memberList.removeChild(tr);

        const student = `
        <li data-id2='${removeName}' class="list-group-item d-flex justify-content-between align-items-center">
            ${removeName}
            <div class="switch-button switch-button-xs">
                <input type="checkbox" name="${removeName}" id="${removeName}">
                <span><label for="${removeName}"></label></span>
            </div>
        </li>
        `;
        newStudent.insertAdjacentHTML('beforeend', student);

        setTimeout(function(){
            document.location.reload();
        }, 300);
    })
}

// edit halaqah
document.querySelector('#editgp').addEventListener('click', editHalaqah);
function editHalaqah(e) {
    e.preventDefault();

    db.collection('TadabburGroup').doc(gpID).update({
        groupName: halaqah.groupName.value,
        admin: halaqah.admin.value,
    }).then(() => {
        alert('Data berjaya disunting.');
    })
};

// render all members that doesnt have halaqah yet
const currentMembers = [];
const newStudent = document.querySelector('#new-student');
db.collection("TadabburGroup").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const members = doc.data().members;
        if(members.length > 0) {
            for(let i = 0; i < members.length; i++) {
                currentMembers.push(doc.data().members[i]);
            }
        }
    });
    db.collection("students").where("fullname", "not-in", currentMembers).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const student = `
            <li data-id2='${doc.data().fullname}' class="list-group-item d-flex justify-content-between align-items-center">
                ${doc.data().fullname}
                <div class="switch-button switch-button-xs">
                    <input type="checkbox" name="${doc.data().fullname}" id="${doc.data().fullname}">
                    <span><label for="${doc.data().fullname}"></label></span>
                </div>
            </li>
            `;
            newStudent.insertAdjacentHTML('beforeend', student);
        });
    })
});

// add members
function addMembers() {
    db.collection("students").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const cb = document.getElementById(doc.data().fullname);
                if(cb.checked == true) {   
                    const addStud = db.collection("TadabburGroup").doc(gpID);
                    addStud.get().then((doc) => {
                        const addGroup = doc.data().groupName;
                        addStud.update({
                            members: firebase.firestore.FieldValue.arrayUnion(cb.name)
                        });
                        let tr = document.querySelector(`[data-id2='${cb.name}']`);
                        console.log('tr here: ' + tr);
                        newStudent.removeChild(tr);
    
                        const li = `
                            <li data-id1='${cb.name}' class="list-group-item d-flex justify-content-between align-items-center">
                                ${cb.name}
                                <button id="${cb.name}" class="btn btn-sm btn-outline-light" data-toggle="modal" data-target="#removeMember" onclick="removeMember('${cb.name}', '${addGroup}')"><i class="far fa-trash-alt"></i></button>
                            </li>
                        `;
                        memberList.insertAdjacentHTML('beforeend', li);
                    })
                }
        });
    });
}