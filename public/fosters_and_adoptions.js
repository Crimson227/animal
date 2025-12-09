var dropdownMenu = document.querySelector(".dropdown-wrapper");
var infoModal = document.getElementById("info-modal");
var fosterAdoptInfo = document.getElementById("fosters-adoptions-info");
var addFosterAdoptionModal = document.getElementById("add-foster-adoption-modal");
var animalNameDropdown = document.getElementById("animal-dropdown");
var patronNameDropdown = document.getElementById("patron-dropdown");

var tempStatus = ""

highlightNavbarButton("fosters_and_adoptions-nav-btn")

/* dropdown menu for table*/
dropdownMenu.addEventListener('change', function () {
    var getRequest

    //if dropdown changes to All, reload page since that's the default
    if (dropdownMenu.value == 'All') {
        window.location.href = '/fosters_and_adoptions'
    }

    //forumlate proper get URL
    if (dropdownMenu.value == 'Adopters')
        getRequest = '/adopted/FostersAndAdoptions'

    else
        getRequest = '/fostered/FostersAndAdoptions'


    fetchAndReplaceTableRows(getRequest, table, Handlebars.templates.fosters_and_adoptionsTableRow)
})

/* Takes info from row selected and creates info modal body */
function loadFosterAdoptionModalInfo(fosterAdoptRowInfo) {
    //update modal based on patron info
    var rowData = fosterAdoptRowInfo.getElementsByTagName("th");

    var aName = rowData[0].firstChild.data;
    var aID = rowData[0].id;
    var pName = rowData[1].firstChild.data;
    var pID = rowData[4].firstChild.data;

    var faStatus = rowData[2].firstChild.data;
    tempStatus = faStatus;

    // Map database status to Chinese for display if needed, 
    // or keep code logic (F/A) consistent with backend.
    // The dropdown in modal uses value="F" and "A".
    // If the table displays "F" or "A", we should handle it.

    var date = rowData[3].firstChild.data;

    //get all p data elements in modal and update them
    var modalData = document.getElementsByClassName("data");

    modalData[0].innerText = aID;
    modalData[1].innerText = aName;
    modalData[2].innerText = pID;
    modalData[3].innerText = pName;
    modalData[4].value = faStatus; // Sets the select value (F or A)
    modalData[5].innerText = date;

    //send query request to get animal's picURL
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


//on table entry click, load modal with row info
table.addEventListener('click', function (event) {
    //ignore a click on the table header
    if (event.target.parentNode.classList.contains("table-header"))
        return;

    //call a function here to load info into modal
    loadFosterAdoptionModalInfo(event.target.parentNode);

    infoModal.classList.remove('hidden');
    modalBackdrop.classList.remove('hidden');
})

/* add new fosterAdopt */
addNewBtn.addEventListener('click', function () {
    //remove old info
    document.getElementById("animal-dropdown").value = "";
    addFosterAdoptionModal.getElementsByClassName("data animalID")[0].innerHTML = "0";
    document.getElementById("patron-dropdown").value = "";
    addFosterAdoptionModal.getElementsByClassName("data patronID")[0].innerHTML = "0";
    document.getElementById("add-fosterAdopt-dropdown").value = "";

    //remove any existing images
    var imgWrapper = addFosterAdoptionModal.querySelector(".animal-img-wrapper")

    while (imgWrapper.firstChild) {
        imgWrapper.removeChild(imgWrapper.firstChild);
    }

    addFosterAdoptionModal.classList.remove("hidden");
    modalBackdrop.classList.remove("hidden");
})

/* When adding a new fosterAdopt, if the dropdown animal changes, update animal ID
    and animal picture */
animalNameDropdown.addEventListener('change', function () {
    aID = animalNameDropdown.value;

    //remove any existing images
    var imgWrapper = addFosterAdoptionModal.querySelector(".animal-img-wrapper")

    while (imgWrapper.firstChild) {
        imgWrapper.removeChild(imgWrapper.firstChild);
    }

    if (animalNameDropdown.value == "") {
        addFosterAdoptionModal.getElementsByClassName("data animalID")[0].innerHTML = "0";
    }

    else {
        addFosterAdoptionModal.getElementsByClassName("data animalID")[0].innerHTML = aID;

        //send query request to get animal's picture
        fetch("/animals/" + aID)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data[0].animalID != "N/A") {
                    //load pic onto modal
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

/* When adding a new fosterAdopt, if the dropdown patron changes, update patron ID */
patronNameDropdown.addEventListener('change', function () {
    pID = patronNameDropdown.value;

    if (patronNameDropdown.value == "")
        addFosterAdoptionModal.getElementsByClassName("data patronID")[0].innerHTML = "0";
    else
        addFosterAdoptionModal.getElementsByClassName("data patronID")[0].innerHTML = pID;

})

/* Get info from add modal, return null if any fields are empty */
function getInput() {
    aID = animalNameDropdown.value;
    pID = patronNameDropdown.value;
    fOrA = document.getElementById("add-fosterAdopt-dropdown").value;

    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();

    date = year + '-' + month + '-' + day;

    var data = {
        animalID: aID,
        patronID: pID,
        fosteredOrAdopted: fOrA.slice(0, 1),
        date: date
    }

    //check if any entries are empty
    for (const [key, value] of Object.entries(data)) {
        if (value.length == 0)
            return null
    }

    return data
}

/* confirm addition of new entity */
confirmBtn.addEventListener('click', function () {
    //make sure all required fields are filled
    data = getInput()

    if (data == null)
        alert("请填写所有必填字段")
    else {
        //if an animal is being adopted, remove it from adoptable table
        if (data.fosteredOrAdopted == "A")
            postData("/update-adoptable", { animalID: data.animalID, adoptable: "No", restrictions: "N/A" }, null)

        //now add to foster/adopt table
        postData("/add/FostersAndAdoptions", data, '/fosters_and_adoptions');
    }
})

confirmDeleteBtn.addEventListener('click', function () {
    //send query for deletion
    aID = document.getElementById("info-modal").getElementsByClassName("data")[0].innerText

    postData('/delete/FostersAndAdoptions', { animalID: aID }, '/fosters_and_adoptions')
})

updateBtn.addEventListener('click', function () {
    aID = document.getElementById("info-modal").getElementsByClassName("data")[0].innerText
    fOrA = document.getElementById("foster-adopt-dropdown").value

    if (tempStatus == fOrA)
        alert("没有检测到状态更新")
    else {
        //if an animal is being adopted, remove it from adoptable table
        if (fOrA == "A")
            postData("/update-adoptable", { animalID: aID, adoptable: "No", restrictions: "N/A" }, null)

        //now update to foster/adopt table
        postData("/update/FostersAndAdoptions", { fosteredOrAdopted: fOrA, animalID: aID }, '/fosters_and_adoptions');
    }
})