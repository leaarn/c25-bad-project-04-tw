window.onload = () => {
  // driver main page
  showDriverInfo();
  showCurrentDistrict();
  showAllOrders();
  // document.querySelector("").addEventListener("click", toAcceptOrder());
  // document.querySelector("").addEventListener("click", confirmAcceptOrder());
  // document.querySelector("").addEventListener("click", showOrdersHistory());
  // document.querySelector("").addEventListener("click", showSingleHistory());
  // document.querySelector("").addEventListener("click", showOrdersHistory());
};

async function showDriverInfo() {
  console.log("driver info");
  const resp = await fetch("/driversMain/get-driver-info");
  const driverInfo = await resp.json();
  console.log(driverInfo);

  let htmlStr = `<i class="bi bi-person-circle"></i>
      <div class="driver-details">
        <p class="driver-name">Hi, ${driverInfo.first_name}</p>
        <p class="role">Driver</p>
      </div>`;

  document.querySelector(".driver-info").innerHTML = htmlStr;
} 

async function showCurrentDistrict() {
  console.log("district");
  const resp = await fetch("/driversMain/get-district");
  const districts = await resp.json();
  console.log(districts);

  // js set unique
  const districtsArr = Object.values(districts);
  let uniqueDistrict = [...new Set(districtsArr)];
  console.log('uniqueDistrict', uniqueDistrict);

  // Create an "option" node:
  // what is i?
  // how to put i into the loop
  // object{} vs array[] (for objKey in obj// for arrayValue of arr) <-- directly take value inside
  for (let i = 0; i < uniqueDistrict.length; i++) {
    const opt = document.createElement("option");
    opt.innerText += uniqueDistrict[i];
    document.querySelector(".district-menu").appendChild(opt);
  }
  // // Create a text node:
  // const textnode = document.createTextNode(`${uniqueDistrict}`);

  // // Append the text node to the "li" node:
  // node.appendChild(textnode);

  // Append the "li" node to the list:

  //   let htmlStr = ``;
  //   for (const district in districts) {
  //     htmlStr += `
  //     <option value="">${districts.deliver_district}</option>
  //     <option value="">${districts.pick_up_district}</option>
  //     `;
  //   }
  //   node.appendChild()
  //   document.querySelector(".get-district").appendChild();
}

// const urlSearchParams = new URLSearchParams(window.location.search);
//   if (!urlSearchParams.has("oid")) {
//     window.location = "/";
//     return;
//   }

//   const resp = await fetch(`/drivers/${urlSearchParams.get("oid")}`);
//   const orders = await resp.json();
//   console.log(orders);

//   const acceptOrder = `<button onClick="acceptOrder(${orders.id})">接單</button>`;

//   let htmlStr = `
//       <div class="available_orders">
//         <div class="order_details">
//             <p class="from">FROM</p>
//             <div class="deli_district_datetime">
//                 < div class="deli_district">${orders.deliver_district}</div>
//                 <div class="deli_date">${orders.pick_up_date}</div>
//                 <div class="deli_time">${orders. pick_up_time}</div>
//             </div>
//             <p class="to">TO</p>
//             <div class="pick_up_district_animals">
//                 <div class="pick_up_district">${orders.pick_up_district}</div>
//                 <div class="animals">${orders.pick_up_district}</div>
//             </div>
//         </div>
//         ${acceptOrder}
//       </div>
//     `;

//   document.querySelector(".container").innerHTML = htmlStr;
