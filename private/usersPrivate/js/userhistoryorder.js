// 己完成訂單
window.onload = () => {
  loadCompleteOrder();
};

async function loadCompleteOrder() {
  const resp = await fetch("/users/history");
  const complete = await resp.json();
  console.log("complete orders", complete);
  //  big container
  const orderContainer = document.querySelector(".all-complete-order");
  //   title
  const title = document.createElement("h3");
  orderContainer.appendChild(title);
  //iterate orders complete
  for (const order of complete) {
    //create element
    const referenceCode = document.createElement("p");
    const orderStatus = document.createElement("p");
    const animals = document.createElement("p");
    //button for more details
    const detailsBtn = document.createElement("button");
    //text content
    referenceCode.textContent = `訂單號碼 : ${order.reference_code}`;
    orderStatus.textContent = `訂單狀態 : ${order.order_status}`;
    let animalDetails = ``;
    if (Array.isArray(order.animals_name)) {
      for (let i = 0; i < order.animals_name.length; i++) {
        animalDetails += order.animals_name[i] + " X " + order.animals_amount[i] + " ";
      }
    } else {
      animalDetails += order.animals_name + " X " + order.animals_amount + " ";
    }
    animals.textContent = `動物 : ${animalDetails}`;
    detailsBtn.textContent = `查看更多`;
  }
}
