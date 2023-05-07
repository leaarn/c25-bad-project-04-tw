window.onload = () => {
  uploadPhotos();
  usersLogout();
};

async function uploadPhotos() {
  const form = document.querySelector("#upload-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const image = form.image.files[0];

    const formData = new FormData();
    formData.append("image", image);

    const resp = await fetch("/uploads", {
      method: "POST",
      body: formData,
    });
    const result = await resp.json();
    if (resp.status === 200) {
      alert("成功上載！");
    }
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
  