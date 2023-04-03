window.onload = () => {
  loadOrderToPay();
  //   confirmToPay();
};

async function loadOrderToPay() {
  const resp = await fetch("/users/payorder");
  const data = await resp.json();

  console.log("here is payorder", data);

  let animalDetails = ``;
  for (let i = 0; i < data.animals_name.length; i++) {
    animalDetails += data.animals_name[i] + " X " + data.animals_amount[i] + " ";
    console.log(animalDetails);
  }

  //確認你的訂單
  const htmlstr1 = `
  <p>收貨時間 : ${data.pick_up_date_time}</p>
  <p>收貨地址 : ${data.pick_up_address}</p>
  <p>送貨地址 : ${data.deliver_address}</p>
  <p>動物 : ${animalDetails}</p>
  <p>備註: ${data.remarks}</p>
  `;

  //訂單總價
  const htmlstr2 = `
  <p>距離 : ${data.distance_km}km - HK$${data.distance_total_price} </p>
  <p>動物 : ${animalDetails}</p> 
  <p>動物總價 : HK$${data.animals_total_price}</p>
  <p>合共價格 : HK$${data.total_price}</p>
  `;

  document.querySelector(".confirm-order").innerHTML = htmlstr1;
  document.querySelector(".total-price").innerHTML = htmlstr2;
}

// async function confirmToPay() {}
// if ((resp.status = 200)) {
//   Swal.fire({
//     icon: "success",
//     title: "Submitted",
//     showConfirmButton: false,
//     timer: 1500,
//   });
//   setTimeout(() => {
//     window.location = "/usersMain.html";
//   }, 1501);
// }
