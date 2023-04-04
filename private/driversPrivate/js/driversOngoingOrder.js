window.onload = async () => {
  showOngoingOrder();
};

async function showOngoingOrder() {
  console.log("ongoing orders");
  const resp = await fetch(`/driversMain/ongoing`);
  const ongoingOrder = await resp.json();
  console.log("ongoing orders", ongoingOrder);

  for (let i = 0; i < ongoingOrder.length; i++) {
    for (let j = 0; j < ongoingOrder.animals_amount.length; j++) {
      let animalDetails = ``;
      if (Array.isArray(ongoingOrder.animals_amount[j])) {
        animalDetails +=
          ongoingOrder.animals_name[j] +
          " X " +
          ongoingOrder.animals_amount[j] +
          " ";
      } else {
        animalDetails +=
          ongoingOrder.animals_name + " X " + ongoingOrder.animals_amount + " ";
      }
      let htmlStr = `<div class="confirm_order_title"><b>實時訂單狀態</b></div>
      <div class="confirm_order_text">
      <p>訂單號碼: #${ongoingOrder.reference_code[i]}
      <p>客人姓名: ${ongoingOrder.user_full_name[i]} </p>
      <p>客人聯絡電話: ${ongoingOrder.contact_num[i]} </p>
      <p>送貨時間: ${ongoingOrder.pick_up_date_time[i]} </p>
      <p>收貨地址: ${ongoingOrder.pick_up_address[i]} </p>
      <p>送貨地址: ${ongoingOrder.deliver_address[i]} </p>
      <p>動物: ${animalDetails[i]} </p>
      <p>備註: ${ongoingOrder.remarks[i]}</p></div>
      <button class="cfm-accept-order" onClick="deliveringStatus(${ongoingOrder.id[i]})">我已接貨！</button>
  `;
      document.querySelector("#ongoing_orders").innerHTML += htmlStr;
    }
  }
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
