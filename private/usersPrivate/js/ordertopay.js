window.onload = () => {
  loadOrderToPay();
  //   confirmToPay();
};

async function loadOrderToPay() {
  const resp = await fetch("/users/payorder");
  const data = await resp.json();
  console.log("hihi");
  console.log("here is payorder", data);
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
