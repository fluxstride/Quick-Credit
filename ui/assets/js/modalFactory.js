import * as API from "./api.js";
import {
  createElem,
  appendChildren,
  createButton,
  buttonText,
  buttonDisabled,
  createStatusElements,
  renderMessage,
  capitalize,
  createElementFromString,
} from "./util.js";

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

export class Status extends Modal {
  constructor(status) {
    super();
    this.status = status;
  }

  render(message) {
    // Create the modal element's HTML structure
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

    let modal = createElementFromString(element);
    let [modalContent] = modal.children;
    let [modalHeader, modalBody] = modalContent.children;
    let [, modalClose] = modalHeader.children;
    let [messageElement] = modalBody.children;
    messageElement.textContent =
      message + (this.status === "success" ? " ✅" : " ❌");

    // Close modal when clicking outside or on close button
    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
      this.status === "success" && location.reload();
    });
    modalClose.addEventListener("click", this.drop);

    // Append modal to the document body
    document.body.append(modal);
  }
}

class PostRepayment extends Modal {
  render() {
    // Create the modal element's HTML structure
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

    // Create modal and extract its components
    let modal = createElementFromString(element);
    let [modalContent] = modal.children;
    let [modalHeader, modalBody] = modalContent.children;
    let [, modalClose] = modalHeader.children;
    let [formContainer] = modalBody.children;
    let [form] = formContainer.children;
    let [amountInput, submitButton] = form.children;

    // Close modal when clicking outside or on close button
    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
    });
    modalClose.addEventListener("click", this.drop);

    // Set default amount and handle form submission
    amountInput.value = 43750;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { value: amount } = amountInput;
      submitButton.value = "Posting...";
      submitButton.disabled = true;

      try {
        const response = await API.postRepayment({ amount, date: "5/24/2023" });
        if (!response.ok)
          throw new Error(`Status code error: ${response.status}`);
        new Status("success").render(`${amount} posted successfully`);
      } catch (err) {
        new Status("failure").render("Repayment failed");
      } finally {
        this.drop();
      }
    });

    // Append the modal to the document body
    document.body.append(modal);
  }
}

class Confirm extends Modal {
  render(data, type = "verify") {
    // Create modal element
    const modal = createElem("div", "modal");
    modal.addEventListener("click", (e) => {
      // Close modal when clicked outside the content area
      e.currentTarget === e.target && this.drop();
    });

    // Create content element
    const content = createElem("div", "content");

    // Create header element
    const header = createElem("div", "header");

    // Create title element with warning emoji
    const title = createElem("h2", "title");
    title.textContent = "⚠️";
    header.appendChild(title);

    // Create body element
    const body = createElem("div", "body");

    // Create message and username elements
    const message = createElem("p", "message");
    const username = createElem("p", "username");
    username.textContent = `${data.firstName} ${data.lastName}?`;

    // Determine and set the message text based on the type
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
      case "delete":
        messageText = "Delete loan offer?";
        break;
      default:
        break;
    }
    message.textContent = messageText;

    // Append username to the message
    appendChildren(message, type !== "delete" ? username : "");

    // Create buttons element
    const buttons = createElem("div", "buttons");

    // Create confirm button
    const confirmButton = createButton(
      "button button--" + type,
      capitalize(type),
      async () => {
        // Create success and failure status elements
        const [success, failure] = createStatusElements();

        // Update button text and disable it
        buttonText(confirmButton, "loading...");
        buttonDisabled(confirmButton, true);

        // Define messages for different actions
        const messages = {
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
          delete: {
            success: "Loan offer deleted successful",
            failure: "Loan offer deletion failed",
          },
        };
        const message = messages[type];

        try {
          // Perform API action and handle responses
          const response = await API.confirmAction(data, type);
          if (!response.ok)
            throw new Error(`Status code error: ${response.status}`);
          renderMessage(success, message.success);
        } catch (err) {
          renderMessage(failure, message.failure);
        } finally {
          this.drop();
        }
      }
    );

    // Create cancel button
    const cancelButton = createButton("button", capitalize("cancel"), () =>
      this.drop()
    );

    // Append buttons to the buttons element
    appendChildren(buttons, confirmButton, cancelButton);

    // Append message and buttons to the body
    appendChildren(body, message, buttons);

    // Append header and body to the content
    appendChildren(content, header, body);

    // Append content to the modal
    appendChildren(modal, content);

    // Append modal to the document body
    document.body.append(modal);
  }
}

class EditLoanOffer extends Modal {
  render(offer) {
    // Create the modal element's HTML structure
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

    // Create modal and extract its components
    let modal = createElementFromString(element);
    let [modalContent] = modal.children;
    let [modalHeader, modalBody] = modalContent.children;
    let [, modalClose] = modalHeader.children;
    let [formContainer] = modalBody.children;
    let [form] = formContainer.children;
    let [amountInput, interestInput, loanTenorInput, submitButton] =
      form.children;

    // Close modal when clicking outside or on close button
    modal.addEventListener("click", (e) => {
      e.currentTarget === e.target && this.drop();
    });
    modalClose.addEventListener("click", this.drop);

    // Set form inputs values to loan offer data
    amountInput.value = offer.amount;
    interestInput.value = offer.interestRate;
    loanTenorInput.value = offer.tenor;

    // Handle form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const [success, failure] = createStatusElements();
      const { value: amount } = amountInput;
      const { value: interest } = interestInput;
      const { value: tenor } = loanTenorInput;

      submitButton.value = "Saving...";
      submitButton.disabled = true;

      let data = {
        amount,
        interestRate: interest,
        tenor,
      };

      try {
        let response = await API.editLoanOffer(offer.id, data);
        if (!response.ok) throw new Error("Status code error :" + res.status);
        renderMessage(success, "Offer edited successfully");
      } catch (error) {
        renderMessage(failure, "Repayment failed");
      } finally {
        this.drop();
      }
    });

    // Append the modal to the document body
    document.body.append(modal);
  }
}

export default {
  success: new Status("success"),
  failure: new Status("failure"),
  confirm: new Confirm(),
  repayment: new PostRepayment(),
  editLoanOffer: new EditLoanOffer(),
};
