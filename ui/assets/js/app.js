// import { data } from "./data.js";
import { createAdminTable } from "./tableFactory.js";
import modals from "./modalFactory.js";
import * as API from "./api.js";

const dataContainer = document.querySelector(".data");
const tableToDisplay =
  dataContainer && dataContainer.getAttribute("data-to-display");

let url = new URL(`http://127.0.0.1:3000/db`);
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    tableToDisplay && createAdminTable(tableToDisplay, data[tableToDisplay]);

    // display data count on admin dashboard
    let users = document.querySelectorAll(".actions .users p")[1];
    users && (users.innerText = data.users.length);

    let loan_applications = document.querySelectorAll(
      ".actions .loan-applications p"
    )[1];
    loan_applications &&
      (loan_applications.innerText = data["loan-applications"].length);

    let loans = document.querySelectorAll(".actions .loans p")[1];
    loans && (loans.innerText = data["admin-loans"].length);

    let loanOffers = document.querySelectorAll(".actions .loan-offers p")[1];
    loanOffers && (loanOffers.innerText = data["loan-offers"].length);
  })
  .catch((err) => {
    let errorMessage = document.createElement("p");
    errorMessage.innerText = err.message;
    dataContainer.append(errorMessage);
  });

/**
 *  Password show and hide logic
 */
const password_show_btn = document.querySelector(".password-show");
const password = document.querySelector(".password input");

password_show_btn?.addEventListener("click", (e) => {
  const isHidden = password.type === "password";
  e.target.src = isHidden
    ? "./assets/images/eye-off.svg"
    : "./assets/images/eye-on.svg";
  password.type = isHidden ? "text" : "password";
});

// login logic
let login_form = document.querySelector("form#login");
login_form?.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = e.target.querySelectorAll("input")[0].value;
  let password = e.target.querySelectorAll("input")[1].value;
  if (email === "admin@qc.com" && password === "qcadmin")
    window.location.href = "./admin.html";

  if (email === "user@qc.com" && password === "qcuser")
    window.location.href = "./user.html";
});

// go back button logic
let go_back_btn = document.querySelector(".go-back");
go_back_btn?.addEventListener("click", () => {
  history.back();
});

let loanRequestForm = document.querySelector("#request-loan > form");

loanRequestForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  let form = e.target;
  let formFields = form.elements;
  let loanOffer = formFields["loan-offer"].value;
  let reason = formFields["reason"].value;

  modals.success.render("Loan application successful");

  console.log({ loanOffer, reason });
  loanOffer = "";
  reason = "";
});

let loanOffers = document.querySelector("#request-loan #loan-offers");
loanOffers &&
  API.getLoanOffers()
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Status code error :" + res.status);
    })
    .then((offers) => {
      for (let offer of offers) {
        let loanOffer = document.createElement("option");
        loanOffer.setAttribute("value", offer.id);
        loanOffer.textContent = `${offer.amount} - ${offer.interestRate} - ${offer.tenor}`;
        loanOffers.append(loanOffer);
      }
    })
    .catch((err) => {
      modals.failure.render(err);
    });

let loanOfferForm = document.querySelector("#create-loan-offer > form");
loanOfferForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  let form = e.target;
  let formFields = form.elements;
  let amount = formFields["amount"].value;
  let interestRate = formFields["interestRate"].value;
  let tenor = formFields["tenor"].value;

  let offer = { amount, interestRate, tenor };

  API.createLoanOffer(offer)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Status code error :" + res.status);
    })
    .then(() => {
      modals.success.render("Loan offer created successfully");
    })
    .catch((err) => {
      modals.failure.render("Loan offer creation failed");
    });
});

//logout
let logoutButton = document.querySelector(".logout");
logoutButton?.addEventListener("click", () => {
  location.href = "login.html";
});
