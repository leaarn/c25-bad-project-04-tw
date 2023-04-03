window.onload = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("oid")) {
    window.location = "/";
    return;
  }
  toAcceptOrder(urlSearchParams.get("oid"));
  driverEarns(urlSearchParams.get("oid"));
  // document.querySelector("").addEventListener("click", confirmAcceptOrder());
  // document.querySelector("").addEventListener("click", showOrdersHistory());
  // document.querySelector("").addEventListener("click", showSingleHistory());
  // document.querySelector("").addEventListener("click", showOrdersHistory());
};

async function toAcceptOrder(id) {
  console.log("accept orders");
  const resp = await fetch(`/driversMain/get-orders/${id}`);
  const acceptOrder = await resp.json();
  console.log("accept orders", acceptOrder);

  for (let i = 0; i < acceptOrder.animals_name.length; i++) {
    for (let j = 0; j < acceptOrder.animals_amount.length; j++) {
      let htmlStr = `
  客人姓名: ${acceptOrder.user_full_name} <br>
  客人聯絡電話: ${acceptOrder.contact_num} <br>
  送貨時間: ${acceptOrder.pick_up_date_time} <br>
  收貨地址: ${acceptOrder.pick_up_address} <br>
  送貨地址: ${acceptOrder.deliver_address} <br>
  動物: ${acceptOrder.animals_name[i]} X ${acceptOrder.animals_amount[j]} <br>
  備註: ${acceptOrder.remarks}
  `;
      document.querySelector(".confirm_order_text").innerHTML = htmlStr;
    }
  }
}

async function driverEarns(id) {
  console.log("driver earns");
  const resp = await fetch(`/driversMain/driver-earns/${id}`);
  const driverEarnsTotal = await resp.json();
  console.log("driverEarnsTotal", driverEarnsTotal);

  for (let i = 0; i < driverEarnsTotal.animals_name.length; i++) {
    for (let j = 0; j < driverEarnsTotal.animals_amount.length; j++) {
      let htmlStr = `
      距離: ${driverEarnsTotal.distance_km}km - HK$${driverEarnsTotal.distance_total_price}<br>
      動物: ${driverEarnsTotal.animals_name[i]} X ${driverEarnsTotal.animals_amount[j]} <br>
      合共價格: HK$${driverEarnsTotal.total_price} <br>
      平台收費(20%): HK$${driverEarnsTotal.platform_fee} <br>
      司機實收: HK$${driverEarnsTotal.driver_earns} <br>
      `;
      document.querySelector(".driver_fee_text").innerHTML = htmlStr;
    }
  }
}
