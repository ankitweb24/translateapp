let from_text = document.querySelector(".from_text");
let to_text = document.querySelector(".to_text");
let select = document.querySelectorAll("select");
let translateBtn = document.querySelector(".translate");
let exChange = document.querySelector(".fa-exchange");
let iconsRoom = document.querySelectorAll(".iconsRoom");
select.forEach((tagName, id) => {
  for (const key in countries) {
    let selected =
      id == 0
        ? key == "en-GB"
          ? "selected"
          : ""
        : key == "hi-IN"
        ? "selected"
        : "";
    let option = ` <option ${selected} value=${key}>${countries[key]}</option>`;
    tagName.insertAdjacentHTML("beforeend", option);
  }
});

translateBtn.addEventListener("click", () => {
  let text = from_text.value.trim();
  let transFrom = select[0].value;
  let toFrom = select[1].value;
  if (!text) return;
  to_text.setAttribute("placeholder", "translating....");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${transFrom}|${toFrom}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((result) => getData(result));
});

const getData = (data) => {
  console.log(data);
  to_text.value = `${data.responseData.translatedText}`;
  data.matches.forEach((data) => {
    if (data.id === 0) {
      to_text.value = data.translation;
    }
  });
  to_text.setAttribute("placeholder", "translate");
};

exChange.addEventListener("click", () => {
  let tempValuefrom = from_text.value;
  let tempLang = select[0].value;
  from_text.value = to_text.value;
  to_text.value = tempValuefrom;
  select[0].value = select[1].value;
  select[1].value = tempLang;
});

from_text.addEventListener("keyup", () => {
  if (!from_text.value) {
    to_text.value = "";
  }
});

iconsRoom.forEach((element) => {
  element.addEventListener("click", ({ target }) => {
    if (!from_text.value || !to_text.value) return;
    // console.log(target.classList.contains('fa-clone'));
    if (target.classList.contains("fa-clone")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(from_text.value);
      } else {
        navigator.clipboard.writeText(to_text.value);
      }
    } else {
      let utter;
      if (target.id == "from") {
        utter = new SpeechSynthesisUtterance(from_text.value);
        utter.lang = select[0].value;
      } else {
        utter = new SpeechSynthesisUtterance(to_text.value);
        utter.lang = select[1].value;
      }
      speechSynthesis.speak(utter);
    }
  });
});
