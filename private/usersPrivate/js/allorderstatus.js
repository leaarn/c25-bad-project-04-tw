window.onload = () => {
  allOrderStatus();
};

async function allOrderStatus() {
  const resp = await fetch("/users/orderstatus");
  const notFinish = await resp.json();
  console.log("haven't finish order", notFinish);
}
