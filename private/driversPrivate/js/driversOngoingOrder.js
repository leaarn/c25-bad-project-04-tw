window.onload = async () => {
  showOngoingOrder();
  let ongoingBtn = document.querySelector("#to_ongoing_orders");
  ongoingBtn.addEventListener("click", showOngoingOrders);
  let historyBtn = document.querySelector("#to_order_history");
  historyBtn.addEventListener("click", showHistoryOrders);
};

async function showOngoingOrder() {
  console.log("ongoing orders");
  const resp = await fetch(`/driversMain/ongoing`);
  const ongoingOrder = await resp.json();
  console.log("accept orders", ongoingOrder);

  // for (let i = 0; i < acceptOrder.animals_name.length; i++) {
  //   let animalDetails = ``;
  //   if (Array.isArray(acceptOrder.animals_name[i])) {
  //     animalDetails +=
  //       acceptOrder.animals_name[i] +
  //       " X " +
  //       acceptOrder.animals_amount[i] +
  //       " ";
  //   } else {
  //     animalDetails +=
  //       acceptOrder.animals_name + " X " + acceptOrder.animals_amount + " ";
  //   }
  //   let htmlStr = `<div class="confirm_order_title"><b>確認將接下的訂單</b></div>
  //     <div class="confirm_order_text"><p>客人姓名: ${acceptOrder.user_full_name} </p>
  //     <p>客人聯絡電話: ${acceptOrder.contact_num} </p>
  //     <p>送貨時間: ${acceptOrder.pick_up_date_time} </p>
  //     <p>收貨地址: ${acceptOrder.pick_up_address} </p>
  //     <p>送貨地址: ${acceptOrder.deliver_address} </p>
  //     <p>動物: ${animalDetails} </p>
  //     <p>備註: ${acceptOrder.remarks}</p></div>
  //     <div class="driver_fee_title"><b>司機收費</b></div>
  //     <div class="driver_fee_text"></div>
  //     <button class="cfm-accept-order" onClick="confirmAcceptOrder(${acceptOrder.id})">確認接單</button>
  // `;
  //   document.querySelector(".confirm_order").innerHTML = htmlStr;
  // }
}

// async function driverEarns(id) {
//   console.log("driver earns");
//   const resp = await fetch(`/driversMain/driver-earns/${id}`);
//   const driverEarnsTotal = await resp.json();
//   console.log("driverEarnsTotal", driverEarnsTotal);

//   for (let i = 0; i < driverEarnsTotal.animals_name.length; i++) {
//     let animalDetails = ``;
//     if (Array.isArray(driverEarnsTotal.animals_name[i])) {
//       animalDetails +=
//         driverEarnsTotal.animals_name[i] +
//         " X " +
//         driverEarnsTotal.animals_amount[i] +
//         " ";
//     } else {
//       animalDetails +=
//         driverEarnsTotal.animals_name +
//         " X " +
//         driverEarnsTotal.animals_amount +
//         " ";
//     }
//     let htmlStr = `
//       <p>距離: ${driverEarnsTotal.distance_km}km - HK$${driverEarnsTotal.distance_total_price}</p>
//       <p>動物: ${animalDetails} - HK$${driverEarnsTotal.animals_total_price}</p>
//       <p>合共價格: HK$${driverEarnsTotal.total_price} </p>
//       <p>平台收費(20%): HK$${driverEarnsTotal.platform_fee} </p>
//       <p>司機實收: HK$${driverEarnsTotal.driver_earns} </p>
//       `;
//     document.querySelector(".driver_fee_text").innerHTML = htmlStr;
//   }
// }

// async function confirmAcceptOrder(id) {
//   const resp = await fetch(`/driversMain/cfm-orders/${id}`, { method: "PUT" });
//   if (resp.status == 200) {
//     await fetch(`/receivertoken`, { method: "POST" });
//     window.location = `/driverSuccess.html?oid=${id}`;
//   }
  
// }

async function showOngoingOrders() {
  window.location = "/driverOngoing.html"
}

async function showHistoryOrders() {
  window.location = "/driverHistory.html"
}