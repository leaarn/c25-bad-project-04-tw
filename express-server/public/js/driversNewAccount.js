window.onload = () => {
  createDrivers();
};
function createDrivers() {
  const form = document.querySelector("#create-drivers");
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

    const resp = await fetch("/driverslogin/createaccount", {
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
      alert("登記成功!");
      window.location = "/driversLogin.html";
    } else {
      const data = await resp.json();
      alert("請輸入資料!");
    }
  });
}

