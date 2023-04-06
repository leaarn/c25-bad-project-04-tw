// 己完成訂單詳細資料
window.onload = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("oid")) {
    window.location = "/";
    return;
  }

  const resp = await fetch(`/users/history/${urlSearchParams.get("oid")}`);
  const historyOrderDetails = await resp.json();
  console.log("fetch order details", historyOrderDetails);

  let animalDetails = ``;
  if (Array.isArray(historyOrderDetails.animals_name)) {
    for (let i = 0; i < historyOrderDetails.animals_name.length; i++) {
      animalDetails += historyOrderDetails.animals_name[i] + " X " + historyOrderDetails.animals_amount[i] + " ";
    }
  } else {
    animalDetails += historyOrderDetails.animals_name + " X " + historyOrderDetails.animals_amount + " ";
  }
  let orderStatus = "";
  if (historyOrderDetails.orders_status == "receiver received") {
    orderStatus = "己完成";
  }
  const htmlstr = `
  <p>訂單號碼 : ${historyOrderDetails.reference_code}</p>
  <p>訂單狀態 : ${orderStatus}</p>
  <p>收貨時間 : ${historyOrderDetails.pick_up_date_time}</p>
  <p>收貨地址 : ${historyOrderDetails.pick_up_address}</p>
  <p>送貨地址 : ${historyOrderDetails.deliver_address}</p>
  <p>備註 : ${historyOrderDetails.remarks}</p>
  `;
  document.querySelector(".order-details").innerHTML = htmlstr;
};
