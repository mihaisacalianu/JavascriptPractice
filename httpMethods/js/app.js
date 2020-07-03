const itemList = document.querySelector(".items");
const httpForm = document.getElementById("httpForm");
const itemInput = document.getElementById("itemInput");
const imageInput = document.getElementById("imageInput");
const feedback = document.querySelector(".feedback");
const submitBtn = document.getElementById("submitBtn");
let editedItemID = 0;

httpForm.addEventListener("submit", submitItem);

//submit Item

function submitItem(event) {
  // prevents the page to reload when the add item button on form is pressed
  event.preventDefault();
  // we getting values from form with itemInput.value
  const itemValue = itemInput.value;
  const imageValue = imageInput.value;

  if (itemValue.length === 0 || imageValue.length === 0) {
    showFeedback("please enter valid values");
  } else {
    postItem(imageValue, itemValue);
    // clearing the values after we posted them
    imageInput.value = "";
    itemInput.value = "";
  }
}

//load items
document.addEventListener("DOMContentLoaded", () => {
  getItems(showItems);
});

// show feedback

function showFeedback(text) {
  feedback.classList.add("showItem");
  feedback.innerHTML = `<p>${text}</p>`;
  //removes the feedback after 3 seconds
  setTimeout(() => {
    feedback.classList.remove("showItem");
  }, 3000);
}
//get items
function getItems(cb) {
  const url = "https://5efeebf9d18ced0016e40d0d.mockapi.io/items";
  const ajax = new XMLHttpRequest();

  ajax.open("GET", url, true);
  ajax.onload = function () {
    if (this.status === 200) {
      cb(this.responseText);
    } else {
      console.log(this.status);
    }
  };
  ajax.onerror = function () {
    console.log("There was an error");
  };
  ajax.send();
}

//show items
function showItems(data) {
  let parsedData = JSON.parse(data);
  let info = "";
  parsedData.forEach((item) => {
    info += `<li class="list-group-item d-flex align-items-center justify-content-between flex-wrap item my-2">
                            <img src="${item.avatar}" id='itemImage' class='itemImage img-thumbnail' alt="">
                            <h6 id="itemName" class="text-capitalize itemName">${item.name}</h6>
                            <div class="icons">

                                <a href='#' class="itemIcon mx-2 edit-icon" data-id=${item.id}>
                                    <i class="fas fa-edit"></i>
                                </a>
                                <a href='#' class="itemIcon mx-2 delete-icon" data-id=${item.id}>
                                    <i class="fas fa-trash"></i>
                                </a>
                            </div>
                        </li>`;
  });

  itemList.innerHTML = info;

  //getIcons
  getIcons();
}

//post items
function postItem(img, itemName) {
  const avatar = `img/${img}.jpeg`;
  const name = itemName;

  const url = "https://5efeebf9d18ced0016e40d0d.mockapi.io/items";
  const ajax = new XMLHttpRequest();

  ajax.open("POST", url, true);

  // so we need to include ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") in order to post something to API
  ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  ajax.onload = function () {
    getItems(showItems);
  };
  ajax.onerror = function () {
    console.log("There was an error");
  };
  // to post items we have specify what we adding to the API
  ajax.send(`avatar=${avatar}&name=${name}`);
}

//get icons
function getIcons() {
  const editIcon = document.querySelectorAll(".edit-icon");
  const deleteIcon = document.querySelectorAll(".delete-icon");

  deleteIcon.forEach((icon) => {
    // const itemId = icon.dataset.id acceses the data-id  from html form
    const itemId = icon.dataset.id;
    icon.addEventListener("click", function (event) {
      event.preventDefault();
      deleteItem(itemId);
    });
  });
  editIcon.forEach((icon) => {
    const itemId = icon.dataset.id;
    icon.addEventListener("click", function (event) {
      event.preventDefault();
      // when we press edit button we want to select the hole container not the edit button so we do it by using parentElement *3 to traverse the DOM
      const parent = event.target.parentElement.parentElement.parentElement;
      const img = parent.querySelector(".itemImage").src;
      const name = parent.querySelector(".itemName").textContent;
      editItemUI(parent, img, name, itemId);
    });
  });
}

//delete item

function deleteItem(id) {
  // we adding the id of the item we want to delete
  const url = `https://5efeebf9d18ced0016e40d0d.mockapi.io/items/${id}`;
  const ajax = new XMLHttpRequest();

  ajax.open("DELETE", url, true);
  ajax.onload = function () {
    if (this.status === 200) {
      getItems(showItems);
    } else {
      console.log(this.status);
    }
  };
  ajax.onerror = function () {
    console.log("There was an error");
  };
  ajax.send();
}

//edit item UI
function editItemUI(parent, itemImg, name, itemId) {
  event.preventDefault();
  itemList.removeChild(parent);
  //this how we select the image from the source
  const imgIndex = itemImg.indexOf("img/");
  const jpegIndex = itemImg.indexOf(".jpeg");
  const img = itemImg.slice(imgIndex + 4, jpegIndex);
  console.log(img);
  itemInput.value = name.trim();
  imageInput.value = img;
  editedItemID = itemId;
  submitBtn.innerHTML = "Edit Item";
  httpForm.removeEventListener("submit", submitItem);
  httpForm.addEventListener("submit", editItemAPI);
}

//edit item API
function editItemAPI() {
  event.preventDefault();
  const id = editedItemID;

  const itemValue = itemInput.value;
  const imageValue = imageInput.value;

  if (itemValue.length === 0 || imageValue.length === 0) {
    showFeedback("please enter valid values");
  } else {
    const img = `img/${imageValue}.jpeg`;
    const name = itemValue;
    const url = `https://5efeebf9d18ced0016e40d0d.mockapi.io/items/${id}`;
    const ajax = new XMLHttpRequest();

    ajax.open("PUT", url, true);

    // so we need to include ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") in order to put something to API
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ajax.onload = function () {
      getItems(showItems);
      reverseForm();
    };
    ajax.onerror = function () {
      console.log("There was an error");
    };
    // to post items we have specify what we adding to the API
    ajax.send(`avatar=${img}&name=${name}`);
  }
}

function reverseForm() {
  itemInput.value = "";
  imageInput.value = "";
  submitBtn.innerHTML = "Add Item";
  httpForm.removeEventListener("submit", editItemAPI);
  httpForm.addEventListener("submit", submitItem);
  getItems(showItems);
}
