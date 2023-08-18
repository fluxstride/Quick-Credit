import * as API from "./api.js";

class Modal {
  constructor() {}

  render() {
    throw Error("Subclasses must implement the render method");
  }

  drop() {
    let modal = document.querySelector(".modal");
    modal.remove();
  }
}

class Success extends Modal {
  render(message) {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
      location.reload();
    });

    let content = document.createElement("div");
    content.classList.add("content");

    let header = document.createElement("div");
    header.classList.add("header");
    let title = document.createElement("h2");
    title.classList.add("title");
    let close = document.createElement("div");
    close.classList.add("close");
    let closeIcon = document.createElement("img");
    closeIcon.setAttribute("src", "./assets/images/cross.svg");
    close.append(closeIcon);
    close.addEventListener("click", this.drop);
    header.append(title, close);

    let body = document.createElement("div");
    body.classList.add("body");
    let messageText = document.createElement("p");
    messageText.classList.add("message");
    messageText.textContent = message + " ✅";
    body.append(messageText);

    content.append(header, body);
    modal.append(content);
    document.body.append(modal);
  }
}

class Failure extends Modal {
  render(message) {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
      location.reload();
    });

    let content = document.createElement("div");
    content.classList.add("content");

    let header = document.createElement("div");
    header.classList.add("header");
    let title = document.createElement("h2");
    title.classList.add("title");
    let close = document.createElement("div");
    close.classList.add("close");
    let closeIcon = document.createElement("img");
    closeIcon.setAttribute("src", "./assets/images/cross.svg");
    close.append(closeIcon);
    close.addEventListener("click", this.drop);
    header.append(title, close);

    let body = document.createElement("div");
    body.classList.add("body");
    let messageText = document.createElement("p");
    messageText.classList.add("message");
    messageText.textContent = message + " ❌";
    body.append(messageText);

    content.append(header, body);
    modal.append(content);
    document.body.append(modal);
  }
}

class PostRepayment extends Modal {
  render() {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
    });

    let content = document.createElement("div");
    content.classList.add("content");
    let header = document.createElement("div");
    header.classList.add("header");
    let title = document.createElement("h2");
    title.classList.add("title");
    let titleIcon = document.createElement("img");
    titleIcon.setAttribute("src", "./assets/images/loan_details.svg");
    let titleText = document.createElement("h3");
    titleText.innerText = "Post Repayment";
    title.append(titleIcon, titleText);
    let close = document.createElement("div");
    close.classList.add("close");
    let closeIcon = document.createElement("img");
    closeIcon.setAttribute("src", "./assets/images/cross.svg");
    close.append(closeIcon);
    close.addEventListener("click", this.drop);
    header.append(title, close);

    let body = document.createElement("div");
    body.classList.add("body");
    let formContainer = document.createElement("div");
    formContainer.classList.add("form-container");
    formContainer.setAttribute("id", "post-repayment");

    let form = document.createElement("form");
    let amountInput = document.createElement("input");
    amountInput.setAttribute("type", "number");
    amountInput.setAttribute("placeholder", "Amount");
    amountInput.setAttribute("required", true);
    amountInput.value = 43750;
    let submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("value", "Post");
    form.append(amountInput, submitButton);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let success = new Success();
      let failure = new Failure();
      let amount = amountInput.value;
      submitButton.value = "Posting...";
      submitButton.disabled = true;

      let repayment = {
        amount,
        date: "5/24/2023",
      };

      API.postRepayment(repayment)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Status code error :" + res.status);
        })
        .then(() => {
          success.render(`${amount} posted successfully`);
        })
        .catch((err) => {
          failure.render("Repayment failed");
        })
        .finally(() => this.drop());
    });

    formContainer.append(form);
    body.append(formContainer);
    content.append(header, body);
    modal.append(content);
    document.body.append(modal);
  }
}

class Confirm extends Modal {
  render(data, type = "verify") {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
    });

    let content = document.createElement("div");
    content.classList.add("content");

    let header = document.createElement("div");
    header.classList.add("header");
    let title = document.createElement("h2");
    title.classList.add("title");
    title.append("⚠️");
    header.append(title);

    let body = document.createElement("div");
    body.classList.add("body");
    let message = document.createElement("p");
    message.classList.add("message");
    let messageText;

    switch (type) {
      case "verify":
        messageText = `Are you sure you want to ${type} `;
        break;
      case "revert":
        messageText = `Are you sure you want to ${type} verification for `;
        break;
      case "approve":
      case "reject":
        messageText = `Are you sure you want to ${
          type === "approve" ? "approve" : "reject"
        } loan for `;
        break;
      default:
        break;
    }
    let username = document.createElement("p");
    username.classList.add("username");
    let usernameText = `${data.firstName} ${data.lastName}?`;
    username.append(usernameText);
    message.append(messageText, username);
    let buttons = document.createElement("div");
    buttons.classList.add("buttons");
    let confirmButton = document.createElement("button");
    confirmButton.classList.add("button", `button--${type}`);
    confirmButton.textContent = type;
    confirmButton.addEventListener("click", () => {
      let success = new Success();
      let failure = new Failure();
      confirmButton.textContent = "loading...";
      confirmButton.disabled = true;

      let messages = {
        verify: {
          success: "User verification successful",
          failure: "User verification failed",
        },
        revert: {
          success: "User verification revert successful",
          failure: "User verification revert failed",
        },
        approve: {
          success: "Loan approval successful",
          failure: "Loan approval failed",
        },
        reject: {
          success: "Loan rejection successful",
          failure: "Loan rejection failed",
        },
      };
      let message = messages[type];

      API.confirmAction(data, type)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Status code error :" + res.status);
        })
        .then(() => {
          success.render(message.success);
        })
        .catch((err) => {
          failure.render(message.failure);
        })
        .finally(() => this.drop());
    });

    let cancleButton = document.createElement("button");
    cancleButton.classList.add("button");
    cancleButton.textContent = "cancle";
    cancleButton.addEventListener("click", () => {
      this.drop();
    });
    buttons.append(confirmButton, cancleButton);

    body.append(message, buttons);

    content.append(header, body);
    modal.append(content);
    document.body.append(modal);
  }
}
class ConfirmOfferDeletion extends Modal {
  render(offer) {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
    });

    let content = document.createElement("div");
    content.classList.add("content");

    let header = document.createElement("div");
    header.classList.add("header");
    let title = document.createElement("h2");
    title.classList.add("title");
    title.append("⚠️");
    header.append(title);

    let body = document.createElement("div");
    body.classList.add("body");
    let message = document.createElement("p");
    message.classList.add("message");
    let messageText = "Delete loan offer?";

    message.append(messageText);
    let buttons = document.createElement("div");
    buttons.classList.add("buttons");
    let confirmButton = document.createElement("button");
    confirmButton.classList.add("button", `button--delete`);
    confirmButton.textContent = "delete";
    confirmButton.addEventListener("click", () => {
      let success = new Success();
      let failure = new Failure();
      confirmButton.textContent = "loading...";
      confirmButton.disabled = true;

      API.deleteLoanOffer(offer.id)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Status code error :" + res.status);
        })
        .then(() => {
          success.render("Loan offer deleted successfully");
        })
        .catch((err) => {
          failure.render("Error deleting loan offer");
        })
        .finally(() => this.drop());
    });

    let cancleButton = document.createElement("button");
    cancleButton.classList.add("button");
    cancleButton.textContent = "cancle";
    cancleButton.addEventListener("click", () => {
      this.drop();
    });
    buttons.append(confirmButton, cancleButton);

    body.append(message, buttons);

    content.append(header, body);
    modal.append(content);
    document.body.append(modal);
  }
}

class EditLoanOffer extends Modal {
  render(offer) {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
    });

    let content = document.createElement("div");
    content.classList.add("content");
    let header = document.createElement("div");
    header.classList.add("header");
    let title = document.createElement("h2");
    title.classList.add("title");
    let titleIcon = document.createElement("img");
    titleIcon.setAttribute("src", "./assets/images/loan_details.svg");
    let titleText = document.createElement("h3");
    titleText.innerText = "Edit loan offer";
    title.append(titleIcon, titleText);
    let close = document.createElement("div");
    close.classList.add("close");
    let closeIcon = document.createElement("img");
    closeIcon.setAttribute("src", "./assets/images/cross.svg");
    close.append(closeIcon);
    close.addEventListener("click", this.drop);
    header.append(title, close);

    let body = document.createElement("div");
    body.classList.add("body");
    let formContainer = document.createElement("div");
    formContainer.classList.add("form-container");
    formContainer.setAttribute("id", "post-repayment");

    let form = document.createElement("form");
    let amountInput = document.createElement("input");
    amountInput.setAttribute("type", "number");
    amountInput.setAttribute("placeholder", "Amount");
    amountInput.setAttribute("required", true);
    amountInput.value = offer.amount;

    let interestRate = document.createElement("select");
    let defaultInterestOption = document.createElement("option");
    defaultInterestOption.setAttribute("value", "");
    defaultInterestOption.textContent = "Select interest rate";
    interestRate.append(defaultInterestOption);
    ["5%", "10%"].forEach((rate) => {
      let rateOption = document.createElement("option");
      rateOption.value = rate;
      rateOption.textContent = rate;
      interestRate.append(rateOption);
    });
    interestRate.value = offer.interestRate;

    let loanTenor = document.createElement("select");
    let defaultTenorOption = document.createElement("option");
    defaultTenorOption.setAttribute("value", "");
    defaultTenorOption.textContent = "Select interest rate";
    loanTenor.append(defaultTenorOption);

    ["6 months", "12 months"].forEach((tenor) => {
      let tenorOption = document.createElement("option");
      tenorOption.value = tenor;
      tenorOption.textContent = tenor;
      loanTenor.append(tenorOption);
    });
    loanTenor.value = offer.tenor;

    let submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("value", "Save");
    form.append(amountInput, interestRate, loanTenor, submitButton);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let success = new Success();
      let failure = new Failure();
      let amount = amountInput.value;
      let interest = interestRate.value;
      let tenor = loanTenor.value;

      submitButton.value = "Saving...";
      submitButton.disabled = true;

      let data = {
        amount,
        interestRate: interest,
        tenor,
      };

      API.editLoanOffer(offer.id, data)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Status code error :" + res.status);
        })
        .then(() => {
          success.render(`Offer edited successfully`);
          return false;
        })
        .catch((err) => {
          failure.render("Repayment failed");
        })
        .finally(() => this.drop());
    });

    formContainer.append(form);
    body.append(formContainer);
    content.append(header, body);
    modal.append(content);
    document.body.append(modal);
  }
}

export default {
  success: new Success(),
  failure: new Failure(),
  confirm: new Confirm(),
  repayment: new PostRepayment(),
  editLoanOffer: new EditLoanOffer(),
  confirmOfferDeletion: new ConfirmOfferDeletion(),
};
