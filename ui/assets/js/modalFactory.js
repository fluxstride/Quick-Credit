import * as API from "./api.js";
import { capitalize } from "./util.js";

class Modal {
  constructor() {}

  render() {
    throw Error("Subclasses must implement the render method");
  }

  createElementFromString(elementString) {
    let range = document.createRange();
    return range.createContextualFragment(elementString).children[0];
  }

  drop() {
    let modal = document.querySelector(".modal");
    modal.remove();
  }
}

class Status extends Modal {
  constructor(status) {
    super();
    this.status = status;
  }

  render(message) {
    let element = `
      <div class="modal">
        <div class="content">
          <div class="header">
            <h2 class="title"></h2>
            <div class="close">
              <img src="./assets/images/cross.svg" />
            </div>
          </div>
          <div class="body">
            <p class="message"></p>
          </div>
        </div>
      </div>  
    `;

    let modal = this.createElementFromString(element);
    let modalContent = modal.children[0];
    let modalHeader = modalContent.children[0];
    let modalClose = modalHeader.children[1];
    let modalBody = modalContent.children[1];
    let messageElement = modalBody.children[0];
    messageElement.textContent =
      message + (this.status === "success" ? " ✅" : " ❌");

    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
      this.status === "success" && location.reload();
    });
    modalClose.addEventListener("click", this.drop);

    document.body.append(modal);
  }
}

class PostRepayment extends Modal {
  render() {
    let element = `
      <div class="modal">
        <div class="content">
          <div class="header">
            <span class="title">
              <img src="./assets/images/loan_details.svg" />
              <h3>Post Repayment</h3>
            </span>
            <span class="close">
              <img src="./assets/images/cross.svg" />
            </span>
          </div>
          <div class="body">
            <div class="form-container" id="post-repayment">
              <form>
                <input type="number" placeholder="Amount" required="true" />
                <input type="submit" value="Post" />
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    let modal = this.createElementFromString(element);
    let modalContent = modal.children[0];
    let modalHeader = modalContent.children[0];
    let modalClose = modalHeader.children[1];
    let modalBody = modalContent.children[1];
    let form = modalBody.children[0].children[0];
    let amountInput = form.children[0];
    let submitButton = form.children[1];

    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
    });
    modalClose.addEventListener("click", this.drop);
    amountInput.value = 43750;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let success = new Status("success");
      let failure = new Status("failure");
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

    let username = document.createElement("p");
    username.classList.add("username");
    let usernameText = `${data.firstName} ${data.lastName}?`;
    username.append(usernameText);

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

    message.append(messageText, username);

    let buttons = document.createElement("div");
    buttons.classList.add("buttons");
    let confirmButton = document.createElement("button");
    confirmButton.classList.add("button", `button--${type.toLowerCase()}`);
    confirmButton.textContent = capitalize(type);
    confirmButton.addEventListener("click", () => {
      let success = new Status("success");
      let failure = new Status("failure");
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
    cancleButton.textContent = capitalize("cancel");
    cancleButton.addEventListener("click", () => {
      this.drop();
    });
    buttons.append(confirmButton, cancleButton);

    body.append(message, buttons);

    content.append(header, body);
    modal.append(content);
    document.body.append(modal);
    // modal.classList.add("show");
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
      let success = new Status("success");
      let failure = new Status("failure");
      confirmButton.textContent = "deleting...";
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
    cancleButton.textContent = "cancel";
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
    let element = `
      <div class="modal">
        <div class="content">
          <div class="header">
            <span class="title">
              <img src="./assets/images/loan_details.svg" />
              <h3>Edit loan offer</h3>
            </span>
            <span class="close">
              <img src="./assets/images/cross.svg" />
            </span>
          </div>
          <div class="body">
            <div class="form-container" id="post-repayment">
              <form>
                <input type="number" placeholder="Amount" required="true" />
                <select>
                  <option value="">Select interest rate</option>
                  <option value="5%">5%</option>
                  <option value="10%">10%</option>
                </select>
                <select>
                  <option value="">Select interest rate</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                </select>
                <input type="submit" value="Save" />
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    let modal = this.createElementFromString(element);
    let modalContent = modal.children[0];
    let modalHeader = modalContent.children[0];
    let modalClose = modalHeader.children[1];
    let modalBody = modalContent.children[1];
    let form = modalBody.children[0].children[0];
    let amountInput = form.children[0];
    let interestRate = form.children[1];
    let loanTenor = form.children[2];
    let submitButton = form.children[3];

    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
    });
    modalClose.addEventListener("click", this.drop);

    amountInput.value = offer.amount;
    interestRate.value = offer.interestRate;
    loanTenor.value = offer.tenor;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let success = new Status("success");
      let failure = new Status("failure");
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
    document.body.append(modal);
  }
}

export default {
  success: new Status("success"),
  failure: new Status("failure"),
  confirm: new Confirm(),
  repayment: new PostRepayment(),
  editLoanOffer: new EditLoanOffer(),
  confirmOfferDeletion: new ConfirmOfferDeletion(),
};
