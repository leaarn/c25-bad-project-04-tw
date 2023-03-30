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
     const pickUpRoom = form.pickUpRoom;
     const pickUpFloor = form.pickUpFloor;
     const pickUpBuilding = form.pickUpBuilding;
     const pickUpStreet = form.pickUpStreet;

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
         pickUpRoom,
         pickUpFloor,
         pickUpBuilding,
         pickUpStreet
       }),
       // const userForm = e.target;
       // const formData = new FormData(userForm);

       // const resp = await fetch("/usersLogin/createAccount", {
       //   method: "POST",
       //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
       //   body: formData,
     });
    if (resp.status === 200) {
      window.location = "../usersMain.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}

  const form = document.querySelector("#create-drivers");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
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
        carType
      }),
    // const userForm = e.target;
    // const formData = new FormData(userForm);
    // const resp = await fetch("/driversLogin/createAccount", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   body:formData,
    //   }),
    });
    if (resp.status === 200) {
      window.location = "../driversMain.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });

