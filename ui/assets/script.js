const password_show_btn = document.querySelector(".password-show");
const password = document.querySelector(".password input");
let show_password = false;

password_show_btn &&
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

const modal_backdrop = document.querySelector(".backdrop");
const loan_details = document.querySelector("#loan-details");

const modals = {
  loan_details,
};

modal_backdrop.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    modals[e.currentTarget.dataset["modal"]].style.display = "none";
  }
});

function openModal(modal) {
  modals[modal].style.display = "block";
  document.body.style.height = "100vh";
}

function closeModal(modal) {
  modals[modal].style.display = "none";
}
