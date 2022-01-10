const halaqahList = document.querySelector('#halaqah-list');
const renderHalaqah = doc => {
    const div = `
    <div data-id='${doc.id}' class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
        <div class="card">
            <div class="card-header d-flex">
                <h4 class="mb-0">${doc.data().groupName}</h4>
                <div class="dropdown ml-auto">
                    <a class="toolbar" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="mdi mdi-dots-vertical"></i>  </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                        <a class="dropdown-item" href="sunting-halaqah.html?${doc.id}" target="_blank">Sunting</a>
                        <a class="dropdown-item btn-delete1" data-toggle="modal" data-target="#modal-deletegp" href="#">Buang</a>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="card-text">Admin: ${doc.data().admin}</p>
                <!-- accordion -->
                <div class="accrodion-regular">
                    <div id="accordion">
                        <div class="card">
                            <div class="card-header" id="headingTwo">
                                <h5 class="mb-0"><button class="btn btn-link collapsed" data-toggle="collapse" data-target="#${doc.id}" aria-expanded="false" aria-controls="${doc.id}">Pelajar</button></h5>
                            </div>
                            <div id="${doc.id}" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                <div class="card-body">
                                    <ul>
                                        <li>${doc.data().members[0]}</li>
                                        <li>${doc.data().members[1]}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    halaqahList.insertAdjacentHTML('beforeend', div);
};


// realtime listener
db.collection('TadabburGroup').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added') {
            renderHalaqah(change.doc);
            console.log('ADDED');
        }
        if(change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            halaqahList.removeChild(tr);
            console.log('REMOVED');
        }
    })
});