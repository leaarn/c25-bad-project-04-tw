window.onload = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("oid")) {
    window.location = "/";
    return;
  }
  let ongoingBtn = document.querySelector("#to_ongoing_orders");
  ongoingBtn.addEventListener("click", showOngoingOrders);
  let historyBtn = document.querySelector("#to_order_history");
  historyBtn.addEventListener("click", showHistoryOrders);
};

document.querySelector(".return-btn").addEventListener("click", () => {
  console.log("hihihihi");
  window.location = "./driversMain.html"
})

async function showOngoingOrders() {
  window.location = "/driverOngoing.html"
}

async function showHistoryOrders() {
  window.location = "/driverHistory.html"
}