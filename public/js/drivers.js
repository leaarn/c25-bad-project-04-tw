window.onload = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("oid")) {
    window.location = "/";
    return;
  }

  const resp = await fetch(`/pokemon/${urlSearchParams.get("pid")}`);
  const pokemon = await resp.json();
  console.log(pokemon);

  const loginBtn = `<button onClick="login()">Login</button>`;
  const addPokemon = `<button onClick="addPokemon(${pokemon.id})">Add Pokemon</button>`;

  let htmlStr = `
      <h1>${pokemon.name}</h1>
      <p>Type 1: ${pokemon.type1}</p>
      <p>Type 2: ${pokemon.type2}</p>
      <p>HP: ${pokemon.hp}</p>
      ${(await checkLogin()) ? addPokemon : loginBtn}
    `;

  document.querySelector(".container").innerHTML = htmlStr;
};


