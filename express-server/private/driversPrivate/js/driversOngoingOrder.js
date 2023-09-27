window.onload= () => {
  showOngoingOrder();
  driversLogout();
};

async function showOngoingOrder() {
  const resp = await fetch(`/driversMain/ongoing`);
  const ongoingOrder = await resp.json();

  for (let i = 0; i < ongoingOrder.length; i++) {
    let animalDetails = ``;
    if (Array.isArray(ongoingOrder[i].animals_amount)) {
      for (let j = 0; j < ongoingOrder[i].animals_amount.length; j++) {
        animalDetails +=
          ongoingOrder[i].animals_name[j] +
          " X " +
          ongoingOrder[i].animals_amount[j] +
          " ";
      }
    } else {
      animalDetails +=
        ongoingOrder.animals_name + " X " + ongoingOrder.animals_amount + " ";
    }
    if (ongoingOrder.orders_status === "driver accepts") {
    }
    let htmlStr = `
      <div class="confirm_order_text">
      <p><b>訂單號碼：#${ongoingOrder[i].reference_code}</b></p>
      <p>客人姓名：${ongoingOrder[i].user_full_name} </p>
      <p>客人聯絡電話：${ongoingOrder[i].contact_num} </p>
      <p>接收寵物時間：${ongoingOrder[i].pick_up_date_time} </p>
      <p>司機提取寵物地址：${ongoingOrder[i].pick_up_address} </p>
      <p>客人接收寵物地址：${ongoingOrder[i].deliver_address} </p>
      <p>動物：${animalDetails} </p>
      <p>備註：${ongoingOrder[i].remarks}</p>
      <div class="btn-div"><button class="cfm-change-status" order-id="${ongoingOrder[i].id}">${
      ongoingOrder[i].orders_status == "driver delivering"
        ? "已接收寵物"
        : "確認接收寵物"
    }</button></div>
      </div>
  `;
    document.querySelector(".ongoing_each").innerHTML += htmlStr;
    document.querySelectorAll(".cfm-change-status").forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const orderId = e.target.getAttribute("order-id");
        const resp = await fetch(`/driversMain/ongoing/${orderId}`, {
          method: "PUT",
        });
        if (resp.status == 200) {
          let result = confirm("你確定嗎？");
          if (result) {
            alert("確認已接收寵物！");
            button.innerHTML = "已接收寵物";
          } else {
            alert("尚未接收寵物！");
          }
        }
      });
    });
  }
}

async function driversLogout() {
  const logout = document.querySelector("#logout");
  logout.addEventListener("click", async (e) => {
    e.preventDefault();
    const resp = await fetch(`/logout/drivers`);
    if (resp.status === 200) {
      window.location = "/driversLogin.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}