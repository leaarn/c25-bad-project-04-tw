window.onload = () => {
  allOrderStatus();
};

async function allOrderStatus() {
  const resp = await fetch("/users/orderstatus");
  const notFinish = await resp.json();
  console.log("haven't finish order", notFinish);
  //big container
  const orderContainer = document.querySelector(".all-order-status");
  //title
  const title = document.createElement("h3");
  title.textContent = `實時訂單狀態`;
  orderContainer.appendChild(title);
  //iterate orders haven't complete
  for (const order of notFinish) {
    const orderId = document.createElement("p");
    const createTime = document.createElement("p");
    const pickUpDateTime = document.createElement("p");
    const pickUpAddress = document.createElement("p");
    const deliverAddress = document.createElement("p");
    const animals = document.createElement("p");
    const remarks = document.createElement("p");
    // 訂單狀態 :
    const orderStatusTitle = document.createElement("p");
    const orderStatusDiv = document.createElement("div");
    const pending = document.createElement("p");
    const driverAccepts = document.createElement("p");
    const driverDelivering = document.createElement("p");
    const receiverReceived = document.createElement("p");

    //button for more details
    const detailsBtn = document.createElement("button");
    const cancelOrderBtn = document.createElement("button");
    //text content
    orderId.textContent = `訂單號碼 : ${order.id}`;
    createTime.textContent = `訂單建立時間 : ${order.created_at}`;
    pickUpDateTime.textContent = `預計收貨時間 : ${order.pick_up_date_time}`;
    pickUpAddress.textContent = `收貨地址 : ${order.pick_up_address}`;
    deliverAddress.textContent = `送貨地址 : ${order.deliver_address}`;
    //for loop animals
    let animalDetails = ``;
    if (Array.isArray(order.animals_name)) {
      for (let i = 0; i < order.animals_name.length; i++) {
        animalDetails += order.animals_name[i] + " X " + order.animals_amount[i] + " ";
      }
    } else {
      animalDetails += order.animals_name + " X " + order.animals_amount + " ";
    }
    animals.textContent = `動物 : ${animalDetails}`;
    remarks.textContent = `備註: ${order.remarks}`;
    orderStatusTitle.textContent = `訂單狀態 : `;
    // 訂單狀態 :
    pending.textContent = `正在等待司機接單`;
    driverAccepts.textContent = `司機正在前往接貨`;
    driverDelivering.textContent = `司機正前往送貨`;
    receiverReceived.textContent = `客人己收貨`;
    //button
    detailsBtn.textContent = `查看你的司機資訊及位置`;
    cancelOrderBtn.textContent = `取消訂單`;

    //each order
    const orderDiv = document.createElement("div");
    orderDiv.className = "each-order";
    orderStatusDiv.className = "order-status";
    orderStatusDiv.appendChild(pending);
    orderStatusDiv.appendChild(driverAccepts);
    orderStatusDiv.appendChild(driverDelivering);
    orderStatusDiv.appendChild(receiverReceived);
    orderDiv.appendChild(orderId);
    orderDiv.appendChild(createTime);
    orderDiv.appendChild(pickUpDateTime);
    orderDiv.appendChild(pickUpAddress);
    orderDiv.appendChild(deliverAddress);
    orderDiv.appendChild(animals);
    orderDiv.appendChild(remarks);
    orderDiv.appendChild(orderStatusTitle);
    orderDiv.appendChild(orderStatusDiv);
    orderDiv.appendChild(detailsBtn);
    orderDiv.appendChild(cancelOrderBtn);
    orderContainer.appendChild(orderDiv);
  }
}
