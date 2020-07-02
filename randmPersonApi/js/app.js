const btn = document.getElementById("btn");

btn.addEventListener("click", () => {
  getPerson(getData);
});

const getPerson = (cb) => {
  const url = `https://randomuser.me/api/`;
  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (this.status === 200) {
      cb(this.responseText, showData);
    } else {
      console.log(this.statusText);
    }
  };

  xhr.onerror = function () {
    console.log("there was an error");
  };
  xhr.send();
};

function getData(response, cb) {
  const data = JSON.parse(response);

  const {
    name: { first },
    name: { last },
    picture: { large },
    location: { city },
    phone,
    email,
  } = data.results[0];

  cb(first, last, large, city, phone, email);
}

function showData(first, last, large, street, phone, email) {
  document.getElementById("first").textContent = first;
  document.getElementById("last").textContent = last;
  document.getElementById("street").textContent = street;
  document.getElementById("phone").textContent = phone;
  document.getElementById("email").textContent = email;
  document.getElementById("photo").src = large;
}
