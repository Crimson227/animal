var infoModal = document.getElementById("info-modal");
var table = document.getElementsByTagName("table")[0];
var addNewAnimalBtn = document.getElementById("add-animal-btn");
var confirmAnimalBtn = document.getElementById("confirm-animal-btn");
var deleteAnimalBtn = document.getElementById("delete-animal-btn");
var animalDropdown = document.getElementById("animal-dropdown");
var addAnimalModal = document.getElementById("add-animal-modal");
var newAnimalPicInput = document.getElementById("picURL");
var updateAnimalBtn = document.getElementById("update-animal-btn")

highlightNavbarButton("animals-nav-btn")

animalDropdown.addEventListener('change', function () {
    var getRequest

    // 注意：这里检查的是我们在 HTML 中设置的 value 属性，而不是显示的中文文本
    if (animalDropdown.value == 'All') {
        window.location.href = '/animals'
    }

    if (animalDropdown.value == 'Adopted')
        getRequest = '/adopted/Animals'

    else if (animalDropdown.value == 'Fostered')
        getRequest = '/fostered/Animals'

    else
        getRequest = '/adoptable'

    fetchAndReplaceTableRows(getRequest, table, Handlebars.templates.animalTableRow)
})

addNewAnimalBtn.addEventListener('click', function () {
    document.getElementById("name").value = ""
    document.getElementById("breed").value = ""
    document.getElementById("age").value = ""
    document.getElementById("picURL").value = ""
    document.getElementById("i-restrictions").value = ""

    var imgWrapper = document.getElementById("add-animal-img")

    while (imgWrapper.firstChild) {
        imgWrapper.removeChild(imgWrapper.firstChild);
    }

    addAnimalModal.classList.remove("hidden");
    modalBackdrop.classList.remove("hidden");
})

function getAnimalInput() {
    var name = document.getElementById("name").value
    var species = document.getElementById("species-dropdown").value
    var breed = document.getElementById("breed").value
    var age = document.getElementById("age").value
    var gender = document.getElementById("gender-dropdown").value
    var picURL = document.getElementById("picURL").value
    var adoptable = document.getElementById("i-adoptable-dropdown").value
    var restrictions = document.getElementById("i-restrictions").value

    var inputs = document.getElementById("add-animal-modal").getElementsByTagName("input")

    for (let x = 0; x < inputs.length - 1; x++) {
        if (inputs[x].value == "")
            return null
    }

    let data = {
        species: species,
        animalName: name,
        age: age,
        gender: gender,
        breed: breed,
        pictureURL: picURL,
        adoptable: adoptable,
        restrictions: restrictions
    }

    return data
}

confirmAnimalBtn.addEventListener('click', async function () {
    var animalData = getAnimalInput()

    if (animalData == null)
        alert("请填写所有必填字段！")

    else {
        postData("/add/Animals", animalData, '/animals');
    }
})

newAnimalPicInput.addEventListener('focusout', function () {
    if (newAnimalPicInput.value.length == 0)
        return;

    var newAnimalPic = document.createElement("img")
    newAnimalPic.classList.add("animal-modal-img")
    newAnimalPic.src = newAnimalPicInput.value

    var imgWrapper = document.getElementById("add-animal-img")

    while (imgWrapper.firstChild) {
        imgWrapper.removeChild(imgWrapper.firstChild);
    }

    imgWrapper.append(newAnimalPic)
})

function loadAnimalModalInfo(animalRowInfo) {
    var rowData = animalRowInfo.getElementsByTagName("th");

    var aid = rowData[0].firstChild.data;
    var species = rowData[1].firstChild.data;
    var breed = rowData[2].firstChild.data;
    var name = rowData[3].firstChild.data;
    var age = rowData[4].firstChild.data;
    var gender = rowData[5].firstChild.data;
    var picURL = rowData[6].firstChild.href;
    var restrictions = "无";
    var adoptable = "No";

    var modalData = document.getElementsByClassName("data");

    modalData[0].innerText = aid;
    modalData[1].innerText = name;
    modalData[2].innerText = species;
    modalData[3].innerText = breed;
    modalData[4].innerText = age;
    modalData[5].innerText = gender;

    fetch("/adoptable/" + aid)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data[0].restrictions != "N/A") {
                adoptable = "Yes"
                restrictions = data[0].restrictions
            }

            modalData[6].value = adoptable;
            modalData[7].value = restrictions;
        })
        .catch(function (error) {
            console.log(error);
        });

    document.getElementById("info-modal").querySelector(".animal-modal-img").src = picURL
}

deleteAnimalBtn.addEventListener('click', function (even) {
    deleteModal.classList.remove('hidden');
    deleteModalBackdrop.classList.remove('hidden');
})

confirmDeleteBtn.addEventListener('click', function () {
    var aID = document.getElementsByClassName("data")[0].innerText;
    postData('/delete/Animals', { animalID: aID }, '/animals')
})

updateAnimalBtn.addEventListener('click', function () {
    var aID = infoModal.getElementsByClassName("data id")[0].innerText
    var adoptable = document.getElementById("adoptable-dropdown").value
    var restrictions = document.getElementById("restrictions").value

    let adoptData = {
        animalID: aID,
        adoptable: adoptable,
        restrictions: restrictions
    }

    postData('update-adoptable', adoptData, '/animals');
})

table.addEventListener('click', function (event) {
    if (event.target.parentNode.classList.contains("table-header"))
        return;

    loadAnimalModalInfo(event.target.parentNode);

    infoModal.classList.remove('hidden');
    modalBackdrop.classList.remove('hidden');
})