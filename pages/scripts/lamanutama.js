db.collection("students").get().then((querySnapshot) => {
    console.log("pelajar: " + querySnapshot.size);
    document.querySelector('#total-students').innerHTML = querySnapshot.size;
});

db.collection("instructors").get().then((querySnapshot) => {
    console.log("guru: " + querySnapshot.size);
    document.querySelector('#total-instructors').innerHTML = querySnapshot.size;
});

db.collection("Practice").get().then((querySnapshot) => {
    console.log("latihan: " + querySnapshot.size);
    document.querySelector('#total-practices').innerHTML = querySnapshot.size;
});

db.collection("Assessment").get().then((querySnapshot) => {
    console.log("penilaian: " + querySnapshot.size);
    document.querySelector('#total-assessments').innerHTML = querySnapshot.size;
});

db.collection("TadabburGroup").get().then((querySnapshot) => {
    console.log("halaqah: " + querySnapshot.size);
    document.querySelector('#total-halaqah').innerHTML = querySnapshot.size;
});

db.collection("News").get().then((querySnapshot) => {
    console.log("berita: " + querySnapshot.size);
    document.querySelector('#total-news').innerHTML = querySnapshot.size;
});