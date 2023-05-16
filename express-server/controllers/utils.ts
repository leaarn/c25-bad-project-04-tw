

export function randomToken() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";

  for (let i = 0; i < 2; i++) {
    const tokenGenerator =
      alphabet[Math.floor(Math.random() * alphabet.length)] +
      Math.floor(Math.random() * 99);
    token += tokenGenerator;
  }
  return token;
}
