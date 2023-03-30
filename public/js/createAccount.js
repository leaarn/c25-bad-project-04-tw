window.onload = () => {
  createUsers();
  createDrivers();
};

function createUsers() {
  const form = document.querySelector("#create-users");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const lastName = form.newUserLastName.value;
    const firstName = form.newUserFirstName.value;
    const title = form.newUserTitle.value;
    const email = form.newUserEmail.value;
    const password = form.newUserPassword.value;
    const contactNum = form.newUserContactNum.value;
    const defaultDistrict = form.newUserDefaultDistrict.value;
    const pick_up_room = form.newPickUpRoom;
    const pick_up_floor = form.mewPickUpFloor;
    const pick_up_building = form.nickUpBuilding;
    const pick_up_street = form.pickUpStreet;

    const resp = await fetch("/usersLogin/createAccount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lastName,
        firstName,
        title,
        email,
        password,
        contactNum,
        defaultDistrict,
        pick_up_room,
        pick_up_building,
        pick_up_street,
      }),
    });
    if (resp.status === 200) {
      window.location = "./private/usersPrivate/usersMain.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}

function createDrivers() {
  const form = document.querySelector("#create-users");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const lastName = form.newDriverLastName.value;
    const firstName = form.newDriverFirstName.value;
    const title = form.newDriverTitle.value;
    const email = form.newDriverEmail.value;
    const password = form.newDriverPassword.value;
    const contactNum = form.newDriverContactNum.value;
    const carLicenseNum = form.newDriverCarLicenseNum.value;
    const carType = form.newDriverCarType.value;

    const resp = await fetch("/driversLogin/createAccount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lastName,
        firstName,
        title,
        email,
        password,
        contactNum,
        carLicenseNum,
        carType,
      }),
    });
    if (resp.status === 200) {
      window.location = "./private/driversPrivate/driversMain.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}
