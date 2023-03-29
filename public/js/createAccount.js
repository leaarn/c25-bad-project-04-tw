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
          req.body.newUserBuilding +
          ", " +
          req.body.newUserStreet;

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
      req.body.newUserBuilding +
      ", " +
      req.body.newUserStreet;

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
        newUserDefaultDistrict,
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