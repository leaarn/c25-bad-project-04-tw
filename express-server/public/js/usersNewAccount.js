
window.onload = () => {
  createUsers();
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
    const defaultRoom = form.newDefaultRoom.value;
    const defaultFloor = form.newDefaultFloor.value;
    const defaultBuilding = form.newDefaultBuilding.value;
    const defaultStreet = form.newDefaultStreet.value;

    const resp = await fetch("/userslogin/createAccount", {
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
        defaultRoom,
        defaultFloor,
        defaultBuilding,
        defaultStreet,
      }),
    });
    if (resp.status === 200) {
      alert("登記成功!");
      window.location = "/usersLogin.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}
