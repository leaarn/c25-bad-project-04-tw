window.onload = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("oid")) {
    window.location = "/";
    return;
  }
  singleHistory(urlSearchParams.get("oid"))
};

async function singleHistory(id) {
  const resp = await fetch(`/driversMain/history/${id}`);
  const singleHistoryResult = await resp.json()
  console.log("singleHistoryResult", singleHistoryResult);

    let animalDetails = ``;
    if (Array.isArray(singleHistoryResult.animals_amount)) {
      for (let j = 0; j < singleHistoryResult.animals_amount.length; j++) {
        animalDetails +=
        singleHistoryResult.animals_name[j] +
          " X " +
          singleHistoryResult.animals_amount[j] +
          " ";
      }
    } else {
      animalDetails +=
      singleHistoryResult.animals_name + " X " + singleHistoryResult.animals_amount + " ";
    }
    // if (singleHistoryResult.orders_status === "driver accepts") {
    // }
    let htmlStr = `
      <div class="confirm_order_text">
      <p><b>訂單號碼: #${singleHistoryResult.reference_code}</b></p>
      <p>訂單狀態: ${singleHistoryResult.orders_status}</p>
      <p>送貨時間: ${singleHistoryResult.pick_up_date_time} </p>
      <p>收貨地址: ${singleHistoryResult.pick_up_address} </p>
      <p>送貨地址: ${singleHistoryResult.deliver_address} </p>
      <p>動物: ${animalDetails} </p>
      <p>備註: ${singleHistoryResult.remarks}</p>
      <button class="return-btn" href="./driversMain.html">返回主頁</button>
      </div>
  `;
    document.querySelector(".history_each_details").innerHTML += htmlStr;
}
