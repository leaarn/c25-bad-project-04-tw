window.onload = () => {
  document.querySelector(".add-animal").addEventListener("click", addAnimal);
  createOrder();
};

async function addAnimal() {
  console.log("triggered");
  let animalMain = document.querySelector(".animals");
  let template = document.querySelector("#new-animal-column");

  const clone = template.content.cloneNode(true);
  console.log(clone);
  animalMain.appendChild(clone);
}

function createOrder() {
  const form = document.querySelector("#create-order-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pick_up_date = form.date.value;
    const pick_up_time = form.time.value;
    const pick_up_district = form.pickUpDistrict.value;
    //   const pick_up_address =
    //     form.pickUpRoom.value +
    //     ", " +
    //     form.pickUpFloor.value +
    //     ", " +
    //     form.pickUpBuilding.value +
    //     ", " +
    //     form.pickUpStreet.value;
    const pick_up_room = form.pickUpRoom;
    const pick_up_floor = form.pickUpFloor;
    const pick_up_building = form.pickUpBuilding;
    const pick_up_street = form.pickUpStreet;
    // const pick_up_coordinates =form.pick_up_coordinates
    const deliver_district = form.deliver_district.value;
    //   const deliver_address =
    //     form.deliverRoom.value +
    //     ", " +
    //     form.deliverFloor.value +
    //     ", " +
    //     form.deliverBuilding.value +
    //     ", " +
    //     form.deliverStreet.value;
    const deliver_room = form.deliverRoom;
    const deliver_floor = form.deliverFloor;
    const deliver_building = form.deliverBuilding;
    const deliver_street = form.deliverStreet;
    // const deliver_coordinates =form.deliver_coordinates
    const receiver_name = form.receiverName.value;
    const receiver_contact = form.receiver_contact.value;
    const animals_id = [];
    const animals_id_selects = form.querySelectorAll("select[name=animals_id]");
    for (const select of animals_id_selects) {
      animals_id.push(select.value);
    }
    console.log(animals_id);
    const animals_amount = [];
    const animals_amount_selects = form.querySelectorAll("select[name=animals_amount]");
    let total = 0;
    for (const select of animals_amount_selects) {
      animals_amount_selects.push(select.value);
      total += parseInt(select.value);
    }
    if (total > 5) {
      alert("Too many animals la...");
      return;
    }
    console.log(animals_amount);

    const remarks = form.remarks.value;

    const resp = await fetch("/usersMain", {
      method: "POST",
      header: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pick_up_date,
        pick_up_time,
        pick_up_district,
        pick_up_room,
        pick_up_floor,
        pick_up_building,
        pick_up_street,
        deliver_district,
        deliver_room,
        deliver_floor,
        deliver_building,
        deliver_street,
        receiver_name,
        receiver_contact,
        remarks,
        animals_id,
        animals_amount,
      }),
    });
  });
}
