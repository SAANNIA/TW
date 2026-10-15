let loginForm = document.getElementById("loginForm");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // prenume.nume + 2 cifre opționale + @e-uvt.ro (ex: ion.popescu23@e-uvt.ro)
  const emailRegex = /^[a-z]+\.[a-z]+(\d{2})?@e-uvt\.ro$/i;
  // minim 7 caractere: literă mică, literă mare, cifră și caracter special
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;

  if (!emailRegex.test(email)) {
    alert("Email invalid! Folosește formatul prenume.nume@e-uvt.ro (opțional 2 cifre înainte de @).");
    return;
  }

  if (!passwordRegex.test(password)) {
    alert("Parola trebuie să aibă minim 7 caractere, cu literă mare, literă mică, cifră și caracter special.");
    return;
  }

  alert("Login reușit!");
  window.location.href = "loading.html";
});
