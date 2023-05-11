window.onload = () => {
  uploadPhotos();
  usersLogout();
  // showForm();
  // aiCreateOrder();
};

let confirmedAnimals = {}

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
    cat: "貓",
    dog: "狗",
    bird: "家禽或鳥類",
    horse: "馬",
    sheep: "羊",
    cow: "牛",
    elephant: "大象",
    bear: "熊",
    zebra: "斑馬",
    giraffe: "長頸鹿",
  };

  // Dictionary of animal Ids
  const IdsAnimalDict = {
    貓: 1,
    狗: 2,
    家禽或鳥類: 3,
    馬: 4,
    羊: 5,
    牛: 6,
    大象: 7,
    熊: 8,
    斑馬: 9,
    長頸鹿: 10,
  };

  let animalArr = [];
  for (i = 0; i < filtered.length; i++) {
    animalArr.push(animalDict[filtered[i]]);
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

  let dbAnimalArr = [];
  for (i = 0; i < animalName.length; i++) {
    dbAnimalArr.push(IdsAnimalDict[animalName[i]]);
  }
  console.log("anm with id", dbAnimalArr);

  //get confirmedAnimals
  confirmedAnimals.anmId = dbAnimalArr;
  confirmedAnimals.anmAmount = animalCount;

  let animalDetails = ``;
  if (Array.isArray(animalName)) {
    for (let i = 0; i < animalName.length; i++) {
      animalDetails += animalName[i] + " X " + animalCount[i] + " ";
    }
  } else {
    animalDetails += animalName + " X " + animalCount + " ";
  }
  console.log(animalDetails);

  // Count if animals amount is > 5
  let total = 0;
  for (const count of animalCount) {
    total += parseInt(count);
  }
  if (total > 5) {
    Swal.fire({
      icon: "warning",
      title: "動物數量超出訂單上限",
      html: `AI預測結果：${animalDetails} </br></br> 請重新上載圖片 或 手動建立訂單`,
      // showConfirmButton: false,
      // timer: 2500,
    }).then(function () {
      window.location = "/private/usersPrivate/uploads.html";
    });
  } else {
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
  }
  // showForm();

  return confirmedAnimals;
}

// console.log("here is confirmed animals",confirmedAnimals)

async function uploadPhotos() {
  let input = document.getElementById("image");
  let imageName = document.getElementById("imageName");

  input.addEventListener("change", () => {
    let inputImage = document.querySelector("input[type=file]").files[0];

    imageName.innerText = inputImage.name;
  });

  // let input = document.getElementById("image");
  // let imageName = document.getElementById("imageName");

  // input.addEventListener("change", () => {
  //   let inputImage = [];
  //   let filesArr = document.querySelector("input[type=file]").files;
  //   for (i = 0; i < filesArr.length; i++) {
  //     inputImage.push(filesArr[i]);
  //   }
  //   console.log("inputImage", inputImage);

  //   // let imageNameStr = ''
  //   for (i = 0; i < inputImage.length; i++) {
  //     imageName.innerHTML += `${inputImage[i].name}</br>`;
  //   }
  // });
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
      confirmedAnimals = updateUI(result);
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
      aiCreateOrder()
    }
  });
}

async function defaultAddress() {
  const resp = await fetch("/users/address");
  const address = await resp.json();
  console.log(address);
  const pickUpDistrict = address.default_district;
  const pickUpRoom = address.default_room;
  const pickUpFloor = address.default_floor;
  const pickUpBuilding = address.default_building;
  const pickUpStreet = address.default_street;
  document.querySelector(".pick-up-district").value = pickUpDistrict;
  document.querySelector(".pick-up-room").value = pickUpRoom;
  document.querySelector(".pick-up-floor").value = pickUpFloor;
  document.querySelector(".pick-up-building").value = pickUpBuilding;
  document.querySelector(".pick-up-street").value = pickUpStreet;
}


async function aiCreateOrder() {
  const form = document.querySelector("#create-order-form");
  defaultAddress()
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
    const anmId = confirmedAnimals.anmId
    const anmAmount = confirmedAnimals.anmAmount

    console.log(`yyyyyy~~~${JSON.stringify(anmId[0])}`);
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
        anmId,
        anmAmount
      }),
    });

    if ((resp.status = 200)) {
      window.location = "/private/usersPrivate/ordertopay.html";
    }
  });
}
