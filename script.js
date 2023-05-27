// Show the form

const popup = document.getElementById("popupForm");

function showPopup() {
  popup.style.display = "block";
}

const addCodeForm = document.getElementById("form");
const codesContainer = document.getElementById("codes");
const nameValue = document.getElementById("name-input");
const allCards = document.getElementById("cards");

// Display Codes From Local Storage

const codes = getFromLocalStorage("codes");

function getFromLocalStorage() {
  let codesStorage = JSON.parse(localStorage.getItem("codes")) || [];
  return codesStorage;
}

window.onload = function () {
  displayCodes(codes);
};

function displayCodes(codes) {
  codes.forEach((element) => {
    let code = `<div id="code-card" class="code-card">
                        <div id="card-content" class="card-content">
                            <h1 id="codeValue">${element.code}</h1>
                            <p>${element.name}</p>
                        </div>
                        <button id="delete-code" class="delete-code" onclick="deleteCode(event,${element.code})"> <i class="fa-solid fa-trash"></i></button>
                      </div>`;

    if (codesContainer != null) {
      const newCode = document.createElement("div");
      newCode.innerHTML = code;
      codesContainer.appendChild(newCode);
    }

    const codeText = document.getElementById("codeValue");

    reload(codeText);
  });
}

function reload(codeText) {
  setInterval(() => {
    let newCode = generateRandomNumber();
    codeText.textContent = newCode;
  }, 30000);
}

// Add a MFA name-code pair and Save to Local Storage

addCodeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let randomNum = generateRandomNumber();

  let code = `<div id="code-card" class="code-card">
                <div id="card-content" class="card-content">
                    <h1 id="codeValue">${randomNum}</h1>
                    <p>${nameValue.value}</p>
                </div>
                <button id="delete-code" class="delete-code" onclick="deleteCode(event,${randomNum})"> <i class="fa-solid fa-trash"></i></button>
              </div>`;

  if (codesContainer != null) {
    const newCode = document.createElement("div");
    newCode.innerHTML = code;
    codesContainer.appendChild(newCode);
  }

  const codeText = document.getElementById("codeValue");

  reload(codeText);

  saveToLocalStorage(randomNum, nameValue.value);

  popup.style.display = "none";
  nameValue.value = "";
});

function generateRandomNumber() {
  let min = 100000;
  let max = 999999;

  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}

function saveToLocalStorage(codeNumber, codeName) {
  let codes = JSON.parse(localStorage.getItem("codes")) || [];
  codes.push({ code: codeNumber, name: codeName });
  localStorage.setItem("codes", JSON.stringify(codes));
}

// Delete an existing MFA name-code pair

function deleteCode(event, code) {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this data!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      const codeCard = event.target.closest(".code-card");
      if (codeCard) {
        codeCard.remove();
        deleteCodeStorage(code);
      }
    }
  });
}

function deleteCodeStorage(codeCard) {
  let codes = JSON.parse(localStorage.getItem("codes")) || [];
  let updatedCodes = codes.filter((code) => code.code !== codeCard);
  localStorage.setItem("codes", JSON.stringify(updatedCodes));
}

//Display Codes From a Public API

//- The name of the new MFA name-code pairs is obtained via call to https://swapi.dev/api/people. Ever made an API call before? “fetch()”-ing information is simple once you get the hang of it.

const url = "https://swapi.dev/api/people";

function getCodesFetch() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayCodesFetch(data.results);
    });
}

function displayCodesFetch(names) {
  names.forEach((element) => {
    let randomNum = generateRandomNumber();

    let code = `<div id="code-card" class="code-card">
                        <div id="card-content" class="card-content">
                            <h1>${randomNum}</h1>
                            <p>${element.name}</p>
                        </div>
                        <button id="delete-code" class="delete-code" onclick="deleteCode(event,${element.code})"> <i class="fa-solid fa-trash"></i></button>
                      </div>`;

    if (codesContainer != null) {
      const newCode = document.createElement("div");
      newCode.innerHTML = code;
      codesContainer.appendChild(newCode);
    }
  });
}

function clearCodes() {
  localStorage.clear();
  window.location.reload();
}
