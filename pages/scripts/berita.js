const newsList = document.querySelector('#news-list');

const renderNews = doc => {
    const div = `
    <div data-id='${doc.id}' class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
        <div class="card card-figure">
            <figure class="figure">
                <img class="img-fluid" src="${doc.data().imageUrl}" alt="${doc.data().name}">
                <figcaption class="figure-caption">
                    <p class="text-muted mb-0"> ${doc.data().desc} </p>
                </figcaption>
            </figure>
            <button class="btn btn-danger btn-xs btn-delete1" data-toggle="modal" data-target="#deleteNews">Buang</button>
        </div>
    </div>
    `;
    newsList.insertAdjacentHTML('beforeend', div);

    // delete news (tapi tak auto close modal after click submit)
    const btnDelete1 = document.querySelector(`[data-id='${doc.id}'] .btn-delete1`);
    const btnDelete2 = document.querySelector('.btn-delete2');
    btnDelete1.addEventListener('click', () => {
        btnDelete2.addEventListener('click', () => {
            db.collection('News').doc(`${doc.id}`).delete().then(() => {
                console.log('Document succesfully deleted from FIRESTORE!');
                // setTimeout(function(){
                //     document.location.reload();
                // }, 1000);
            }).catch(err => {
                console.log('Error removing document', err);
            });
        });
    });
}

// realtime listener
db.collection('News').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added') {
            renderNews(change.doc);
            console.log('ADDED');
        }
        if(change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            newsList.removeChild(tr);
            console.log('REMOVED');
        }
    })
});

// add news
document.querySelector('#addNews').addEventListener('click', addNews);
function addNews(e) {
    e.preventDefault();
    const file = document.querySelector('#news-img').files[0];
    const imageName = file.name;
    const task = firebase.storage().ref().child('news/' + imageName).put(file);

    task.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
        console.log('successfully upload file: ' + url);
        db.collection('News').add({
            imageUrl: url,
            imageName: imageName,
            desc: document.querySelector('#news-desc').value,
        });
        console.log('news data added to firestore');
    })
    .catch((error) => {
        console.log(error.message);
    })
}

