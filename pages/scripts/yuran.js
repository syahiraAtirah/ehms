let id;
// document.querySelector('#updateAmount').addEventListener('click', addPayment);

// render instructor table
const paymentList = document.querySelector('#payment-list');
document.querySelector('#addPayment').addEventListener('click',addPayment);


// realtime listener
db.collection("students").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const studID = doc.id;
        const studName = doc.data().fullname;
        const studEmail = doc.data().email;

        db.collection("students").doc(studID).collection('payment').where("status", "==", "proses").get().then((querySnapshot) => {
            querySnapshot.forEach((doc2) => { 
                paymentID = doc2.id;
                // console.log('paymentID'+paymentID);
                const date = doc2.data().date.toDate().toDateString() + ", " + doc2.data().date.toDate().toLocaleTimeString();
                const tr = `
                <tr data-id='${doc2.id}'>
                    <td>${studName}</td> 
                    <td>${studEmail}</td>
                    <td>${doc2.data().amount}</td>
                    <td>${date}</td>
                    <td>${doc2.data().status}</td>
                    <td>
                        <a href="https://dashboard.stripe.com/test/dashboard" target="_blank" class="btn btn-secondary btn-xs">Semak</a>
                        <button class="btn btn-success btn-xs" id="paymentSuccess">Lulus</button>
                        <button class="btn btn-danger btn-xs btn-delete1" id="paymentFail">Batal</button>
                    </td>
                </tr>
                `;
                paymentList.insertAdjacentHTML('beforeend', tr);
                
                
                //update payment
                const btnUpdate = document.querySelector(`[data-id='${doc2.id}'] #paymentSuccess`);
                btnUpdate.addEventListener('click', () =>{
                    db.collection('students').doc(studID).update({
                        paymentStatus: 'Sudah'
                    }).then(()=>{
                        console.log('update document student', err);
                    }).catch(err => {
                        console.log('Error update document student', err);
                    });

                    db.collection('students').doc(studID).collection('payment').doc(`${doc2.id}`).update({
                        status: 'Sudah'
                    }).then(()=>{
                        alert('Bayaran bagi pelajar '+ studName + ' telah disunting');
                        document.location.reload(true);
                    }).catch(err => {
                        alert('Bayaran bagi pelajar '+ studName + ' tidak dapat disunting');
                        console.log('Error update document payment', err);
                    });
                })
                
                //del payment
                const btnDelete = document.querySelector(`[data-id='${doc2.id}'] #paymentFail`);
                btnDelete.addEventListener('click', () =>{
                    db.collection('students').doc(studID).collection('payment').doc(`${doc2.id}`).delete().then(() => {
                        console.log('Document of ' + doc2.id + ' succesfully deleted from FIRESTORE!');
                        alert('Bayaran bagi pelajar '+ studName + ' telah dibuang');
                        document.location.reload(true);
                    }).catch(err => {
                        alert('Bayaran bagi pelajar '+ studName + ' tidak dapat dibuang');
                        console.log('Error update document student', err);
                    });
                })
            });
        });
    });
});

// add payment
function addPayment(e) {
    e.preventDefault();
    console.log('click add payment');
    const getAmount = document.getElementById("amount").value;
    const getLinkUrl = document.getElementById("linkUrl").value;

    //del current amount
    db.collection('Payment').get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            db.collection('Payment').doc(doc.id).delete().then(()=>{
                console.log('success delete from payment collection');
            }).catch(err => {
                console.log('Error delete from payment collection', err);
            });
        })

        //add latest amount
        db.collection("Payment").add({
            amount: getAmount,
            linkUrl: getLinkUrl,
            date: firebase.firestore.FieldValue.serverTimestamp()
        }).then(()=>{
            alert('Jumlah bayaran baru telah disunting');
            document.location.reload(true);
        }).catch((error) => {
            console.error("Error adding payment: ", error);
        });
    }).catch(err => {
        console.log('Error getting document', err);
    });

    
}