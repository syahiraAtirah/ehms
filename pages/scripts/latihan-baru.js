const addQues = document.querySelector('#addQues');
addQues.addEventListener('click', addQuestion);
function addQuestion(e) {
    e.preventDefault();
    const opt = `
    <div class="card">
        <div class="alert alert-info fade show" role="alert">
            <a href="#" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></a>
            <br>
            <div class="form-group">
                <textarea class="form-control" placeholder="Soalan" rows="2"></textarea>
            </div>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">A</span></div>
                <input type="text" placeholder="Pilihan jawapan" class="form-control">
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">B</span></div>
                <input type="text" placeholder="Pilihan jawapan" class="form-control">
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">C</span></div>
                <input type="text" placeholder="Pilihan jawapan" class="form-control">
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>

            <div class="input-group input-group-sm">
                <div class="input-group-prepend"><span class="input-group-text">D</span></div>
                <input type="text" placeholder="Pilihan jawapan" class="form-control">
            </div>
            <label class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input"><span class="custom-control-label"><small>Jawapan yang betul</small></span>
            </label>
        </div>
    </div>

    
    `;
    addQues.insertAdjacentHTML('beforebegin', opt);
}

