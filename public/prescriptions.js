var dropdownMenu = document.querySelector(".dropdown-wrapper");
var infoModal = document.getElementById("info-modal");
var prescInfo = document.getElementById("patron-info");
var addPrescModal = document.getElementById("add-prescription-modal");
var prescNameDropdown = document.getElementById("name-dropdown");

highlightNavbarButton("prescriptions-nav-btn")

dropdownMenu.addEventListener('change', function () {
    if (dropdownMenu.value == 'All') {
        window.location.href = '/prescriptions'
    }

    if (dropdownMenu.value == 'Feline')
        getRequest = '/vaccines/Feline/Prescriptions'

    else
        getRequest = '/vaccines/Canine/Prescriptions'

    fetchAndReplaceTableRows(getRequest, table, Handlebars.templates.prescriptionTableRow)
})

function loadPrescriptionModalInfo(prescriptionRowInfo) {
    var rowData = prescriptionRowInfo.getElementsByTagName("th");

    var aID = rowData[0].firstChild.data;
    var aName = rowData[1].firstChild.data;
    var pName = rowData[2].firstChild.data;
    var freq = rowData[3].firstChild.data;
    var picURL = rowData[4].firstChild.href;

    var modalData = document.getElementsByClassName("data");

    modalData[0].innerText = aID;
    modalData[1].innerText = aName;
    modalData[2].innerText = pName;
    modalData[3].innerText = freq;

    document.getElementById("info-modal").querySelector(".animal-modal-img").src = picURL
}

table.addEventListener('click', function (event) {
    if (event.target.parentNode.classList.contains("table-header"))
        return;

    loadPrescriptionModalInfo(event.target.parentNode);

    infoModal.classList.remove('hidden');
    modalBackdrop.classList.remove('hidden');
})

function getPrescriptionInput() {
    animalID = document.getElementById("name-dropdown").value;
    pName = document.getElementById("prescription").value;
    frequency = document.getElementById("frequency").value;

    var data = {
        animalID: animalID,
        name: pName,
        frequency: frequency
    }

    for (const [key, value] of Object.entries(data)) {
        if (value.length == 0)
            return null
    }

    return data
}

addNewBtn.addEventListener('click', function () {
    document.getElementById("name-dropdown").value = "";
    addPrescModal.getElementsByClassName("data id")[0].innerHTML = "0";
    document.getElementById("prescription").value = "";
    document.getElementById("frequency").value = "";

    var imgWrapper = addPrescModal.querySelector(".animal-img-wrapper")

    while (imgWrapper.firstChild) {
        imgWrapper.removeChild(imgWrapper.firstChild);
    }

    addPrescModal.classList.remove("hidden");
    modalBackdrop.classList.remove("hidden");
})

confirmBtn.addEventListener('click', function () {
    data = getPrescriptionInput()

    if (data == null)
        alert("请填写所有必填字段")
    else
        postData("/add/Prescriptions", data, '/prescriptions');
})

prescNameDropdown.addEventListener('change', function () {
    aID = prescNameDropdown.value;

    var imgWrapper = addPrescModal.querySelector(".animal-img-wrapper")

    while (imgWrapper.firstChild) {
        imgWrapper.removeChild(imgWrapper.firstChild);
    }

    if (prescNameDropdown.value == "") {
        addPrescModal.getElementsByClassName("data id")[0].innerHTML = "0";
    }

    else {
        addPrescModal.getElementsByClassName("data id")[0].innerHTML = aID;

        fetch("/animals/" + aID)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data[0].animalID != "N/A") {
                    var newAnimalPic = document.createElement("img")
                    newAnimalPic.classList.add("animal-modal-img")
                    newAnimalPic.src = data[0].pictureURL
                    imgWrapper.append(newAnimalPic)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
})

confirmDeleteBtn.addEventListener('click', function () {

    aID = document.getElementById("info-modal").getElementsByClassName("data")[0].innerText
    pName = document.getElementById("info-modal").getElementsByClassName("data")[2].innerText

    postData('/delete/Prescriptions', { animalID: aID, name: pName }, '/prescriptions')
})