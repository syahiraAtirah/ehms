const halaqahList = document.querySelector('#halaqah-list');

db.collection("TadabburGroup").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
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
                        <div>

                            <div class="card">
                                <div class="card-header" id="headingTwo">
                                    <h5 class="mb-0"><button class="btn btn-link collapsed" data-toggle="collapse" data-target="#${doc.id}" aria-expanded="false" aria-controls="${doc.id}" onclick="displayMember('${doc.id}')">Pelajar</button></h5>
                                </div>
                                <div id="${doc.id}" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                    <div class="card-body">
                                        <ol id="accordionn">
                                        </ol>
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

    });
});

function displayMember(clickedID) {
    db.collection("TadabburGroup").doc(clickedID).get().then((doc) => {
        console.log('BERJAYA TEKAN');
        const members = doc.data().members;
        // const acc = document.querySelector('#accordionn');
        if(members.length > 0) { 
            for(let i = 0; i < members.length; i++){
                // const lo = `
                //     <li> ${members[i]}</li>
                // `;
                // acc.insertAdjacentHTML('beforeend', lo);
                console.log(members[i]);
            }
        } 
        else {
            // const lo = `
            //     <li>Tiada pelajar lagi</li>
            // `;
            // acc.insertAdjacentHTML('beforeend', lo);
        }
        // selectedGp.removeEventListener('click', displayMembers);
    })
    clickedID.onclick = null;
}
