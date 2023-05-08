window.onload = () => {
  aiOrManual();
  userInfo();
};
async function userInfo() {
  const resp = await fetch("/users/userinfo");
  const userInfo = await resp.json();
  console.log(userInfo);

  const userInfoStr = `
  <i class="bi bi-person-circle"></i>
  <div class="user-details">
  <p class="user-name"><b>Hi, ${userInfo.first_name}</b></p>
  <p class="role">會員</p>
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
    window.location = "/private/usersPrivate/usersMain.html";
  });
}
