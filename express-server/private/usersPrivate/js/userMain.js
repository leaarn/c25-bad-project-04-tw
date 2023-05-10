window.onload = () => {
  aiOrManual();
  userInfo();
  usersLogout();
};
async function userInfo() {
  const resp = await fetch("/users/userinfo");
  const userInfo = await resp.json();
  console.log(userInfo);

  const userInfoStr = `
  <i class="bi bi-person-circle"></i>
  <div class="user-details">
  <h2 class="u-text u-text-palette-1-base u-text-1">Hi, ${userInfo.first_name}</h2>
  <p class="u-text u-text-palette-1-dark-1 u-text-2">會員</p>
  </div>
  `;
  document.querySelector(".user-info").innerHTML = userInfoStr;
}
function aiOrManual() {
  const ai = document.querySelector("#ai");
  const manual = document.querySelector("#manual");

  ai.addEventListener("click", (event) => {
    window.location = "/private/usersPrivate/uploads.html";
  });

  manual.addEventListener("click", (event) => {
    window.location = "/private/usersPrivate/usersManual.html";
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


