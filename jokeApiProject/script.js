const mainbtn = document.getElementById("mainBtn");
const result = document.getElementById("result");
const imgContainer = document.getElementById("img");

mainbtn.addEventListener("click", () => {
  const xhr = new XMLHttpRequest();
  // url from the chuck norris API
  const url = "https://api.chucknorris.io/jokes/random";

  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (this.status === 200) {
      let response = JSON.parse(this.responseText);
      // destructuring of the data that we get from the api
      const { icon_url: img, value: joke } = response;
      result.textContent = joke;
      imgContainer.src = img;
    } else {
    }
  };

  xhr.onerror = function () {
    console.log("It has been an error");
  };
  xhr.send();
});
