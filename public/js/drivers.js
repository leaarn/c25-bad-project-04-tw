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
                <div class="deli_datetime"></div>
            </div>
            <p class="to">TO</p>
            <div class="pick_up_district_animals">
                <div class="pick_up_district"></div>
                <div class="animals"></div>
            </div>
        </div>
        ${acceptOrder}
      </div>
      <h1>${pokemon.name}</h1>
      <p>Type 1: ${pokemon.type1}</p>
      <p>Type 2: ${pokemon.type2}</p>
      <p>HP: ${pokemon.hp}</p>
      ${(await checkLogin()) ? addPokemon : loginBtn}
    `;

  document.querySelector(".container").innerHTML = htmlStr;
};


