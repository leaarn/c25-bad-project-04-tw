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

   let htmlStr = 
   `<div class="driver-profile">
      <i class="bi bi-person-circle"></i>
      <div class="driver-details">
        <p class="driver-name">Hi, ${driverInfo.first_name}</p>
        <p class="role">Driver</p>
      </div>
   </div>`;

   document.querySelector(".driver-info").innerHTML = htmlStr;
}

async function showCurrentDistrict() {
  console.log("district");
   const resp = await fetch("/driversMain/get-district");
   const districts = await resp.json();
   console.log(districts);

   let htmlStr = 
   `<div class="driver-profile">
      <i class="bi bi-person-circle"></i>
      <div class="driver-details">
        <p class="driver-name">Hi, ${driverInfo.first_name}</p>
        <p class="role">Driver</p>
      </div>
   </div>`;

   document.querySelector(".driver-info").innerHTML = htmlStr;
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