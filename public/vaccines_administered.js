var dropdownMenu = document.querySelector(".dropdown-wrapper");
var closeModalBtn = document.getElementById("close-modal-btn");
var infoModal = document.getElementById("info-modal");
var table = document.getElementsByTagName("table")[0];
var vaccineInfo = document.getElementById("patron-info");
var addVaccNameDropdown = document.getElementById("name-dropdown");
var vaccineDD = document.getElementById("vaccine-dropdown")

var tempData = {
    animalID: 0,
    vaccineID: 0,
    vaccineName: "",
    dateGiven: "",
    dateExpires: ""
}

highlightNavbarButton("vaccines_administered-nav-btn")

dropdownMenu.addEventListener('change', function () {

    if (dropdownMenu.value == 'All') {
        window.location.href = '/vaccines_administered'
    }

    if (dropdownMenu.value == 'Feline')
        getRequest = '/vaccines/Feline/VaccinesAdministered'

    else
        getRequest = '/vaccines/Canine/VaccinesAdministered'

    fetchAndReplaceTableRows(getRequest, table, Handlebars.templates.vaccines_administeredTableRow)
})

function loadVaccineModalInfo(vaccineRowInfo) {
    var rowData = vaccineRowInfo.getElementsByTagName("th");

    var aID = rowData[0].id;
    var vID = rowData[1].id;
    var vName = rowData[1].firstChild.data;
    var dateGiven = formatDate(rowData[2].firstChild.data);
    var dateExpires = formatDate(rowData[3].firstChild.data);

    tempData.animalID = aID
    tempData.vaccineID = vID
    tempData.vaccineName = vName
    tempData.dateGiven = dateGiven
    tempData.dateExpires = dateExpires

    document.getElementsByClassName("data id")[0].innerText = aID;
    document.getElementById("name-dropdown").value = aID;
    document.getElementById("vaccine-dropdown").value = vID;
    document.getElementById("date-given").value = dateGiven;
    document.getElementById("date-expires").value = dateExpires;

    fetch("/animals/" + aID)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data[0].animalID != "N/A") {
                document.getElementById("info-modal").querySelector(".animal-modal-img").src = data[0].pictureURL
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

table.addEventListener('click', function (event) {
    if (event.target.parentNode.classList.contains("table-header"))
        return;

    loadVaccineModalInfo(event.target.parentNode);

    confirmBtn.classList.add("hidden");
    updateBtn.classList.remove("hidden");
    deleteBtn.classList.remove("hidden");
    infoModal.classList.remove('hidden');
    modalBackdrop.classList.remove('hidden');
})

addNewBtn.addEventListener('click', function () {
    document.getElementById("name-dropdown").value = "";
    document.getElementsByClassName("data id")[0].innerHTML = "0";
    document.getElementById("vaccine-dropdown").value = "";
    document.getElementById("date-given").value = "";
    document.getElementById("date-expires").value = "";

    var imgWrapper = document.querySelector(".animal-img-wrapper")

    while (imgWrapper.firstChild) {
        imgWrapper.removeChild(imgWrapper.firstChild);
    }

    confirmBtn.classList.remove("hidden")
    updateBtn.classList.add("hidden")
    deleteBtn.classList.add("hidden")
    infoModal.classList.remove("hidden");
    modalBackdrop.classList.remove("hidden");
})

addVaccNameDropdown.addEventListener('change', function () {

    var imgWrapper = document.querySelector(".animal-img-wrapper")

    while (imgWrapper.firstChild) {
        imgWrapper.removeChild(imgWrapper.firstChild);
    }

    if (addVaccNameDropdown.value == "") {
        document.getElementsByClassName("data id")[0].innerHTML = "0";
    }

    else {
        aID = addVaccNameDropdown.value;
        document.getElementsByClassName("data id")[0].innerHTML = aID;

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

function getVaccineAdministeredInput() {
    var aID = addVaccNameDropdown.value
    var vaccName = vaccineDD.options[vaccineDD.selectedIndex].text
    var vaccID = vaccineDD.value
    var dateGiven = document.getElementById("date-given").value
    var dateExpires = document.getElementById("date-expires").value


    if (aID == "" || vaccName == "" || dateGiven == "" || dateExpires == "")
        return null

    let data = {
        animalID: aID,
        vaccineName: vaccName,
        vaccineID: vaccID,
        dateGiven: dateGiven,
        dateExpires: dateExpires
    }

    return data
}

confirmBtn.addEventListener('click', function () {
    var data = getVaccineAdministeredInput()

    if (data == null)
        alert("请填写所有必填字段")

    else {
        postData("/add/VaccinesAdministered", data, '/vaccines_administered');
    }
})


updateBtn.addEventListener('click', function () {
    var data = getVaccineAdministeredInput()

    if (data == null)
        alert("请填写所有必填字段")

    else if (JSON.stringify(tempData) === JSON.stringify(data))
        alert("没有检测到数据更新")

    else if (data.animalID != tempData.animalID || data.vaccineName != tempData.vaccineName) {
        postData('/delete/VaccinesAdministered', tempData, null)
        postData("/add/VaccinesAdministered", data, '/vaccines_administered');
    }

    else {
        postData("/update/VaccinesAdministered", data, '/vaccines_administered');
    }
})

deleteBtn.addEventListener('click', function (even) {
    deleteModal.classList.remove('hidden');
    deleteModalBackdrop.classList.remove('hidden');
})

confirmDeleteBtn.addEventListener('click', function () {
    var aID = document.getElementById("name-dropdown").value;
    var vName = vaccineDD.options[vaccineDD.selectedIndex].text;

    let data = {
        animalID: aID,
        vaccineName: vName
    }

    postData('/delete/VaccinesAdministered', data, '/vaccines_administered')
})