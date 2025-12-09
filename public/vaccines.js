var dropdownMenu = document.querySelector(".dropdown-wrapper");
var infoModal = document.getElementById("info-modal");
var vaccineInfo = document.getElementById("vaccine-info");
var addVaccineModal = document.getElementById("add-vaccine-modal");

highlightNavbarButton("vaccines-nav-btn")

dropdownMenu.addEventListener('change', function () {
    if (dropdownMenu.value == 'All') {
        window.location.href = '/vaccines'
    }

    if (dropdownMenu.value == 'Feline')
        getRequest = '/vaccines/Feline/Vaccines'

    else
        getRequest = '/vaccines/Canine/Vaccines'

    fetchAndReplaceTableRows(getRequest, table, Handlebars.templates.vaccineTableRow)
})

function loadVaccineModalInfo(vaccineRowInfo) {
    var rowData = vaccineRowInfo.getElementsByTagName("th");

    var name = rowData[0].firstChild.data;
    var species = rowData[1].firstChild.data;
    var doses = rowData[2].firstChild.data;

    var modalData = document.getElementById("info-modal").getElementsByClassName("data");

    modalData[0].innerText = name;
    modalData[1].innerText = species;

    document.getElementById("update-doses").placeholder = doses;
}

table.addEventListener('click', function (event) {
    if (event.target.parentNode.classList.contains("table-header"))
        return;

    loadVaccineModalInfo(event.target.parentNode);

    infoModal.classList.remove('hidden');
    modalBackdrop.classList.remove('hidden');
})

addNewBtn.addEventListener('click', function () {
    document.getElementById("name").value = "";
    document.getElementById("doses").value = "";

    addVaccineModal.classList.remove("hidden");
    modalBackdrop.classList.remove("hidden");
})

function getVaccineInput() {
    var name = document.getElementById("name").value
    var doses = document.getElementById("doses").value
    var species = document.getElementById("species-dropdown").value

    var data = {
        name: name,
        doses: doses,
        species: species
    }

    for (const [key, value] of Object.entries(data)) {
        if (value.length == 0)
            return null
    }

    return data
}

confirmBtn.addEventListener('click', function () {
    data = getVaccineInput()

    if (data == null)
        alert("请填写所有必填字段")
    else
        postData("/add/Vaccines", data, '/vaccines');
})

updateBtn.addEventListener('click', function () {
    vaccName = document.getElementById("info-modal").getElementsByClassName("data")[0].innerText
    doses = document.getElementById("update-doses").value

    let data = {
        name: vaccName,
        doses: doses
    }

    if (doses == 0 && document.getElementById("update-doses").placeholder != 0)
        alert("没有检测到数据更新")
    else
        postData("/update/Vaccines", data, '/vaccines')
})

confirmDeleteBtn.addEventListener('click', function () {
    vaccName = document.getElementById("info-modal").getElementsByClassName("data")[0].innerText
    postData('/delete/Vaccines', { name: vaccName }, '/vaccines')
})