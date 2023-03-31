window.onload = () => {
  initDriversLoginForm();
};

function initDriversLoginForm() {
  const form = document.querySelector("#drivers-login-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const driversEmail = form.driversEmail.value;
    const password = form.password.value;
    const resp = await fetch("/driversLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driversEmail, password }),
    });

    if (resp.status === 200) {
      window.location = "../driversMain.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}
