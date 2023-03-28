window.onload = () => {
    initLoginForm();
}


function initLoginForm() {
  const form = document.querySelector("#login-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = form.email.value;
    const password = form.password.value;
    const resp = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (resp.status === 200) {
      window.location = "/admin.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}