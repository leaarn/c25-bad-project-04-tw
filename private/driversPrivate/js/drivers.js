window.onload = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("oid")) {
    window.location = "/";
    return;
  }

  const resp = await fetch(`/drivers/${urlSearchParams.get("oid")}`);
  const orders = await resp.json();
  console.log(orders);

  const acceptOrder = `<button onClick="acceptOrder(${orders.id})">接單</button>`;

  let htmlStr = `
      <div class="available_orders">
        <div class="order_details">
            <p class="from">FROM</p>
            <div class="deli_district_datetime">
                <div class="deli_district">${orders.deliver_district}</div>
                <div class="deli_date">${orders.pick_up_date}</div>
                <div class="deli_time">${orders.pick_up_time}</div>
            </div>
            <p class="to">TO</p>
            <div class="pick_up_district_animals">
                <div class="pick_up_district">${orders.pick_up_district}</div>
                <div class="animals">${orders.pick_up_district}</div>
            </div>
        </div>
        ${acceptOrder}
      </div>
    `;

  document.querySelector(".container").innerHTML = htmlStr;
};


