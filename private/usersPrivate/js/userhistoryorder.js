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
  for (const order of complete){
    //create element
    const referenceCode = document.createElement("p")
    const orderStatus = document.createElement("p")
    const animals = document.createElement("p")
    //button for more details
    const detailsBtn = document.createElement("button")
    //text content
    referenceCode.textContent = `訂單號碼 : ${order.order_status}`
    orderStatus.textContent = `訂單狀態 : ${}`
    animals.textContent = `${}`
    detailsBtn.textContent = ``

  }
}
