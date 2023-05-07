const password_show_btn = document.querySelector(".password-show");
const password = document.querySelector(".password input");
let show_password = false;

password_show_btn.addEventListener("click", () => {
  if (!show_password) {
    password_show_btn.src = "./assets/images/eye-off.svg";
    password.type = "text";
    show_password = true;
    return;
  }
  password_show_btn.src = "./assets/images/eye-on.svg";
  password.type = "password";
  show_password = false;
});
