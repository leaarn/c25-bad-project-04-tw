window.onload = () => {
  initUsersLoginForm();
  // initDriversLoginForm()
};

function initUsersLoginForm() {
  const form = document.querySelector("#users-login-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usersEmail = form.userEmail.value;
    const password = form.password.value;
    const resp = await fetch("/usersLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usersEmail, password }),
    });

    //  if (resp.status === 200) {
    //    const urlSearchParams = new URLSearchParams(window.location.search);
    //    if (!urlSearchParams.has("path")) {
    //      window.location = "/";
    //      return;
    //    }
    //    window.location = urlSearchParams.get("path");
    //  } else {
    //    const data = await resp.json();
    //    alert(data.message);
    //  }

    if (resp.status === 200) {
      window.location = "/usersMain.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}

// function initDriversLoginForm() {
//   const form = document.querySelector("#drivers-login-form");
//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const driversEmail = form.driversEmail.value;
//     const password = form.password.value;
//     const resp = await fetch("/driversLogin", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ driversEmail, password }),
//     });

//     if (resp.status === 200) {
//       window.location = "./private/driversPrivate/driversMain.html";
//     } else {
//       const data = await resp.json();
//       alert(data.message);
//     }
//   });
// }
