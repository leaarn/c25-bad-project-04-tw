window.onload = () => {
  // driver main page
  showDriverInfo();
  // showCurrentDistrict();
  showAllOrders();
  // let selectedDistrict = document.querySelector(".district-menu");
  // selectedDistrict.addEventListener("change", showSelected);
  // document.querySelector("").addEventListener("click", confirmAcceptOrder());
  // document.querySelector("").addEventListener("click", showOrdersHistory());
  // document.querySelector("").addEventListener("click", showSingleHistory());
  // document.querySelector("").addEventListener("click", showOrdersHistory());
};

async function showDriverInfo() {
  console.log("driver info");
  const resp = await fetch("/driversMain/get-driver-info");
  const driverInfo = await resp.json();
  console.log("driver info", driverInfo);

  let htmlStr = `<i class="bi bi-person-circle"></i>
      <div class="driver-details">
        <p class="driver-name"><b>Hi, ${driverInfo.first_name}</b></p>
        <p class="role">Driver</p>
      </div>`;

  document.querySelector(".driver-info").innerHTML = htmlStr;
}

// async function showCurrentDistrict() {
//   console.log("district");
//   const resp = await fetch("/driversMain/get-district");
//   const districts = await resp.json();
//   console.log("district", districts);

//   // arr.map to obtain objects values and turn to array
//   const districtsArr = districts.map((item) => Object.values(item));
//   console.log("districtsArr", districtsArr);
//   // arr.flat -> [[_,_],[_,_]] -> [_,_,_,_]
//   let flattedDistrictsArr = districtsArr.flat();
//   // js set unique
//   let uniqueDistrict = [...new Set(flattedDistrictsArr)];
//   console.log("uniqueDistrict", uniqueDistrict);

//   // Create an "option" node:
//   // what is i?
//   // how to put i into the loop
//   // object{} vs array[] (for objKey in obj// for arrayValue of arr) <-- directly take value inside
//   for (let i = 0; i < uniqueDistrict.length; i++) {
//     const opt = document.createElement("option");
//     opt.innerText += uniqueDistrict[i];
//     document.querySelector(".district-menu").appendChild(opt);
//   }
// }

async function showAllOrders() {
  console.log("all orders");
  const resp = await fetch("/driversMain/get-orders");
  const allOrders = await resp.json();
  console.log("all orders", allOrders);

  for (let i = 0; i < allOrders.length; i++) {
    const acceptBtn = `<button class="accept-order" onClick="acceptOrdersDetail(${allOrders[i].id})">接單</button>`;
    const dateStr = new Date(allOrders[i].pick_up_date).toDateString()
    let htmlStr = `
    <div class="single_order">
      <p class="order-text">FROM</p>
      <div class="pick_up_district_time">
        <div class="pick_up_district">${allOrders[i].pick_up_district}</div>
        <div class="pick_up_time">${dateStr} ${allOrders[i].pick_up_time}</div>
      </div>
      <p class="order-text">TO</p>
      <div class="deli_district_animal">
        <div class="deli_district">${allOrders[i].deliver_district}</div>
        <div class="animal">${allOrders[i].animals_name} ${allOrders[i].animals_amount}</div>
      </div>
      ${acceptBtn}
    </div>
  `;
    document.querySelector(".orders").innerHTML += htmlStr;
  }
}

async function acceptOrdersDetail(id) {
  window.location = `/driversAcceptOrder.html?oid=${id}`;
}
