const form = document.querySelector("#updateAccountForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    })

const passwordButton = document.querySelector('#passwordButton');

passwordButton.addEventListener("click", function () {
    const passwordInput = document.querySelector('#account_password');
    const type = passwordInput.getAttribute("type");
    if (type == "password") {
        passwordInput.setAttribute("type", "text");
        passwordButton.innerHTML = "Hide Password";
    } else {
        passwordInput.setAttribute("type", "password");
        passwordButton.innerHTML = "Show password"
    }
})