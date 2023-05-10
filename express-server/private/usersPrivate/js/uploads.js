const { Script } = require("vm");

window.onload = () => {
  uploadPhotos();
  usersLogout();
  // showForm();
  // aiCreateOrder();
};

function updateUI(result) {
  console.log("updateUI-result", result);
  // Filter result to below classes
  const classes = [
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe",
  ];
  const filtered = result.filter((item) => classes.includes(item));
  console.log(filtered);

  // Dictionary of animal classes
  const animalDict = {
    cat: ["貓",1],
    dog: ["狗",2],
    bird: ["家禽或鳥類",3],
    horse: ["馬",4],
    sheep: ["羊",5],
    cow: ["牛",6],
    elephant: ["大象",7],
    bear: ["熊",8],
    zebra: ["斑馬",9],
    giraffe: ["長頸鹿",10]
  };

  let animalArr = [];
  for (i = 0; i < filtered.length; i++) {
    animalArr.push(animalDict[filtered[i]][0]);
  }

  // Count how many animals
  const counts = {};
  const sampleArray = animalArr;
  sampleArray.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  console.log("counts", counts);

  // Transfer animal array to eg.(羊 X 1 ) format
  const animalName = Object.keys(counts);
  console.log("animalName", animalName);
  const animalCount = Object.values(counts);
  console.log("animalCount", animalCount);

  let animalDetails = ``;
  if (Array.isArray(animalName)) {
    for (let i = 0; i < animalName.length; i++) {
      animalDetails += animalName[i] + " X " + animalCount[i] + " ";
    }
  } else {
    animalDetails += animalName + " X " + animalCount + " ";
  }
  console.log(animalDetails);
  document.querySelector(
    ".ai-result-div"
  ).innerHTML = `<div class="result-title">AI預測結果：
  <div class="animal-result">${animalDetails}</div>
  </div>
  <div class="rate">
  <input type="radio" id="star5" name="rate" value="5" />
  <label for="star5" title="text">5 stars</label>
  <input type="radio" id="star4" name="rate" value="4" />
  <label for="star4" title="text">4 stars</label>
  <input type="radio" id="star3" name="rate" value="3" />
  <label for="star3" title="text">3 stars</label>
  <input type="radio" id="star2" name="rate" value="2" />
  <label for="star2" title="text">2 stars</label>
  <input type="radio" id="star1" name="rate" value="1" />
  <label for="star1" title="text">1 star</label>
  </div>
  <button id="form-toggle">OK</button>
  <button id="form-toggle-manual">Not OK</button>
  `;

  // Count if animals amount is > 5
  let total = 0;
  for (const count of animalCount) {
    total += parseInt(count);
  }
  if (total > 5) {
    alert("Too many animals la...");
  }
  showForm();
}

async function uploadPhotos() {
  let input = document.getElementById("image");
  let imageName = document.getElementById("imageName");

  input.addEventListener("change", () => {
    let inputImage = [];
    let filesArr = document.querySelector("input[type=file]").files;
    for (i = 0; i < filesArr.length; i++) {
      inputImage.push(filesArr[i]);
    }
    console.log("inputImage", inputImage);

    // let imageNameStr = ''
    for (i = 0; i < inputImage.length; i++) {
      imageName.innerHTML += `${inputImage[i].name}</br>`;
    }
  });
  const form = document.querySelector("#upload-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const image = form.image.files[0];

    const formData = new FormData();
    formData.append("image", image);

    const resp = await fetch("/users/uploads", {
      method: "POST",
      body: formData,
    });
    const result = await resp.json();
    if (resp.status === 200) {
      alert("成功上載！");
      console.log(`result: ${result}`);
      console.log("type of", result);
      updateUI(result);
      showForm();
      // showResults()
    }
  });
}

async function usersLogout() {
  const logout = document.querySelector("#logout");
  logout.addEventListener("click", async (e) => {
    e.preventDefault();
    const resp = await fetch(`/logout/users`);
    if (resp.status === 200) {
      window.location = "/private/usersPrivate/usersLogin.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}

async function showForm() {
  const btn = document.querySelector("#form-toggle");
  console.log("1");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("2");
    let x = document.querySelector("#order-form-div");
    if (x.style.display === "none") {
      x.style.display = "block";
    }
  });
}

async function aiCreateOrder() {
  const form = document.querySelector("#create-order-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pick_up_date = form.date.value;
    const pick_up_time = form.time.value;
    const pick_up_district = form.pickUpDistrict.value;
    const pick_up_room = form.pickUpRoom.value;
    const pick_up_floor = form.pickUpFloor.value;
    const pick_up_building = form.pickUpBuilding.value;
    const pick_up_street = form.pickUpStreet.value;
    // const pick_up_coordinates =form.pick_up_coordinates
    const deliver_district = form.deliverDistrict.value;
    const deliver_room = form.deliverRoom.value;
    const deliver_floor = form.deliverFloor.value;
    const deliver_building = form.deliverBuilding.value;
    const deliver_street = form.deliverStreet.value;
    // const deliver_coordinates =form.deliver_coordinates
    const receiver_name = form.receiverName.value;
    const receiver_contact = form.receiverContact.value;
    const remarks = form.remarks.value;
    const rate = form.rate.value;
     const animals_id = [];
     const animals_id_selects = form.querySelectorAll(
       "select[name=animals_id]"
     );
     for (const select of animals_id_selects) {
       animals_id.push(select.value);
     }
     console.log("here is id", animals_id);
     const animals_amount = [];
     const animals_amount_selects = form.querySelectorAll(
       "select[name=animals_amount]"
     );
     let total = 0;
     for (const select of animals_amount_selects) {
       animals_amount.push(select.value);
       total += parseInt(select.value);
     }
     if (total > 5) {
       alert("Too many animals la...");
       return;
     }



    const resp = await fetch("/aiCreateOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pick_up_date,
        pick_up_time,
        pick_up_district,
        pick_up_room,
        pick_up_floor,
        pick_up_building,
        pick_up_street,
        deliver_district,
        deliver_room,
        deliver_floor,
        deliver_building,
        deliver_street,
        receiver_name,
        receiver_contact,
        remarks,
        rate,
      }),
    });

    if ((resp.status = 200)) {
      window.location = "/private/usersPrivate/ordertopay.html";
    }
  });
}
