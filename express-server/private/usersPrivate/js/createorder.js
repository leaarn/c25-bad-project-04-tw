// 用戶落單版面
window.onload = () => {
  dateMinCurrentDay()
  defaultAddress();
  addAnimal();
  usersLogout() ;
};

function dateMinCurrentDay(){
  let date =  document.querySelector(".date")
  date.min = new Date().toISOString().split('T')[0]
}

// add a button(hide), when click call get default address function and append the value in it

async function defaultAddress() {
  const resp = await fetch("/users/address");
  const address = await resp.json();
  console.log(address);
  const pickUpDistrict = address.default_district;
  const pickUpRoom = address.default_room;
  const pickUpFloor = address.default_floor;
  const pickUpBuilding = address.default_building;
  const pickUpStreet = address.default_street;
  document.querySelector(".pick-up-district").value = pickUpDistrict;
  document.querySelector(".pick-up-room").value = pickUpRoom;
  document.querySelector(".pick-up-floor").value = pickUpFloor;
  document.querySelector(".pick-up-building").value = pickUpBuilding;
  document.querySelector(".pick-up-street").value = pickUpStreet;
}

async function addAnimal() {
  document.querySelector(".add-animal").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("triggered");
    let animalSection = document.querySelector(".animals-section");
    let template = document.querySelector("#new-animal-column");

    const clone = template.content.cloneNode(true);
    console.log(clone);

    clone.querySelector(".remove-animal").addEventListener("click", (e) => {
      e.preventDefault();
      const deleteTarget = e.target.closest(".clone-animal");
      animalSection.removeChild(deleteTarget);
    });
    animalSection.appendChild(clone);
  });
}

const form = document.getElementById('create-order-form');

form.addEventListener('blur', (event) => {
  const input = event.target;

  if (input.value.trim() === '' && input.name !== 'remarks') {
    input.classList.add('is-invalid');
    const errorElement = input.nextElementSibling;
    if (errorElement) {
      errorElement.innerHTML = '<em style="color: red;">此欄必須填寫</em>';
    }
    input.style.borderColor = 'red';
    input.style.borderWidth = "medium";
  } else {
    input.classList.remove('is-invalid');
    const errorElement = input.nextElementSibling;
    if (errorElement) {
      errorElement.innerHTML = '';
    }
    input.style.borderColor = '';
  }
}, true);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const inputs = form.querySelectorAll('input:not([name="remarks"]), select');

  let isValid = true;

  inputs.forEach((input) => {
    if (input.value.trim() === '') {
      input.classList.add('is-invalid');
      const errorElement = input.nextElementSibling;
      if (errorElement) {
        errorElement.innerHTML = '<em style="color: red;">此欄必須填寫</em>';
      }
      input.style.borderColor = 'red';
      input.style.borderWidth = "medium";
      isValid = false;
    } else {
      input.classList.remove('is-invalid');
      const errorElement = input.nextElementSibling;
      if (errorElement) {
        errorElement.innerHTML = '';
      }
      input.style.borderColor = '';
    }
  });

  if (isValid) {
    createOrder()
  }
});




function createOrder() {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pick_up_date = form.date.value;
    const pick_up_time = form.time.value;
    const pick_up_district = form.pickUpDistrict.value;
    console.log("pick up", typeof pick_up_district);

    const pick_up_room = form.pickUpRoom.value;
    const pick_up_floor = form.pickUpFloor.value;
    const pick_up_building = form.pickUpBuilding.value;
    const pick_up_street = form.pickUpStreet.value;
    // const pick_up_coordinates =form.pick_up_coordinates
    const deliver_district = form.deliverDistrict.value;

    const deliver_room = form.deliverRoom.value;
    const deliver_floor = form.deliverFloor.value;
    const deliver_building = form.deliverBuilding.value;
    const deliver_street = form.deliverStreet.value;
    const receiver_name = form.receiverName.value;
    const receiver_contact = form.receiver_contact.value;
    const animals_id = [];
    const animals_id_selects = form.querySelectorAll("select[name=animals_id]");
    for (const select of animals_id_selects) {
      animals_id.push(select.value);
    }
    console.log("here is id", animals_id);
    const animals_amount = [];
    const animals_amount_selects = form.querySelectorAll("select[name=animals_amount]");
    let total = 0;
    for (const select of animals_amount_selects) {
      animals_amount.push(select.value);
      total += parseInt(select.value);
    }
    if (total > 5) {
      alert("Too many animals la...");
      return;
    }
    console.log("here is amount", animals_amount);

    const remarks = form.remarks.value;

    const resp = await fetch("/users/createorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    if ((resp.status = 200)) {
      window.location = "/private/usersPrivate/ordertopay.html";
    }
  });
}


async function usersLogout() {
  const logout = document.querySelector("#logout");
  logout.addEventListener("click", async (e) => {
    e.preventDefault();
    const resp = await fetch(`/logout/users`);
    if (resp.status === 200) {
      window.location = "/private/usersPrivate/usersLogin.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}