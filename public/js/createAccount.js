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
        const defaultAddress =
          form.newUserRoom.value +
          ", " +
          form.newUserFloor.value +
          ", " +
          form.newUserBuilding +
          ", " +
          form.newUserStreet;

        const resp = await fetch("/driversLogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newUserLastName,
            newUserFirstName,
            newUserTitle,
            newUserEmail,
            newUserPassword,
            newUserContactNum,
            newUserDefaultDistrict
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
   lastName = form.newDriverLastName.value;
   firstName = form.newDriverFirstName.value;
   title = form.newDriverTitle.value;
   email = form.newDriverEmail.value;
   password = form.newDriverPassword.value;
   contactNum = form.newDriverContactNum.value;
   carLicenseNum = form.newDriverCarLicenseNum.value;
   carType = form.newDriverCarType.value

    const resp = await fetch("/driversLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newDriverLastName,
        newDriverFirstName,
        newDriverTitle,
        newDriverEmail,
        newDriverPassword,
        newDriverContactNum,
        newDriverCarLicenseNum,
        newDriverCarType
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