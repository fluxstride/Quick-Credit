import modals from "./modalFactory.js";
import * as API from "./api.js";

class Table {
  constructor(data, itemsPerPage = 10) {
    this.data = data;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.currentTab = this.getTabs()[0];
    this.tableData = data;
    this.calculateTableData();
    this.render();
    let tablePagination = document.querySelector(".table-pagination");
    let tableContainer = document.querySelector(".table-container");
    tablePagination.style.display =
      this.dataCount > this.itemsPerPage ? "flex" : "none";
    tableContainer.style.marginBottom =
      this.dataCount > this.itemsPerPage ? "0" : "10rem";
  }

  calculatePaginationButtonsState() {
    this.prev_button = document.querySelector("#prev");
    this.next_button = document.querySelector("#next");
    this.prev_button.disabled = this.currentPage === 1;
    this.prev_button.disabled
      ? (this.prev_button.style.opacity = ".5")
      : (this.prev_button.style.opacity = "1");

    this.next_button.disabled = this.currentPage === this.totalPages;
    this.next_button.disabled
      ? (this.next_button.style.opacity = ".5")
      : (this.next_button.style.opacity = "1");
  }

  dropTable() {
    const table = document.querySelector("table");
    table.remove();
  }

  clearSearchInput() {
    const searchInput = document.querySelector(".search input");
    searchInput && (searchInput.value = "");
  }

  renderTabs() {
    let tableTabs = document.createElement("div");
    tableTabs.classList.add("table-tabs");

    for (const tab of this.getTabs()) {
      const tabButton = document.createElement("div");
      let classNames =
        tab === this.currentTab ? ["tab", "tab--active"] : ["tab"];
      tabButton.classList.add(...classNames);
      tabButton.textContent = tab;
      tableTabs.appendChild(tabButton);
    }

    let tabs = tableTabs.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        if (tab.className.includes("tab--active")) return;
        tab.classList.add("tab--active"), (this.currentTab = tab.textContent);
        tabs.forEach(
          (tab) =>
            tab.textContent !== this.currentTab &&
            tab.classList.remove("tab--active")
        );
        this.changeTab(tab.textContent);
      });
    });

    let tableHead = document.querySelector(".table-head");
    tableHead.append(tableTabs);
  }

  renderSearch() {
    let searchBox = document.createElement("div");
    searchBox.classList.add("search");
    let icon = document.createElement("img");
    icon.setAttribute("src", "./assets/images/search.svg");
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Search");
    input.addEventListener("keyup", (e) => {
      let query = e.target.value;
      this.search(query);
    });
    input.addEventListener(
      "focus",
      (e) => (input.parentElement.style.border = "2px solid var(--lemon-green)")
    );
    input.addEventListener(
      "focusout",
      (e) => (input.parentElement.style.border = "2px solid #bfc8cc")
    );

    searchBox.append(icon, input);

    let tableHead = document.querySelector(".table-head");
    tableHead.append(searchBox);
  }

  updatePageInfo() {
    let pageInfo = document.querySelector(".page-info");
    pageInfo.innerText = this.pageInfo;
  }

  renderPagination() {
    let pagination = document.createElement("div");
    let page = document.createElement("span");
    page.classList.add("page-info");
    page.innerText = this.pageInfo;

    let rightSpan = document.createElement("span");
    rightSpan.classList.add("right");

    let right1 = document.createElement("span");
    let rowsCountLabel = document.createElement("span");
    rowsCountLabel.innerText = "Rows per page: ";

    let select = document.createElement("select");
    select.setAttribute("id", "rows-per-page");
    let rowsPerPage = [10, 20, 30];
    rowsPerPage.forEach((value) => {
      let option = document.createElement("option");
      option.setAttribute("value", value);
      option.textContent = value;

      select.append(option);
    });

    select.addEventListener("change", (e) => {
      this.itemsPerPage = e.target.value * 1;
      this.currentPage = 1;
      this.dropTable();
      this.tableData = this.data;
      this.clearSearchInput();
      this.calculateTableData();
      this.render();
      this.calculatePaginationButtonsState();
      this.updatePageInfo();
    });

    right1.append(rowsCountLabel, select);

    let right2 = document.createElement("span");

    let paginationButtons = [
      { id: "prev", label: "Previous" },
      { id: "next", label: "Next" },
    ];

    for (const [_, { id, label }] of Object.entries(paginationButtons)) {
      let button = document.createElement("button");
      button.setAttribute("id", id);
      button.textContent = label;
      button.addEventListener("click", () => {
        this.paginate(id);
      });
      right2.append(button);
    }

    rightSpan.append(right1, right2);
    pagination.append(page, rightSpan);

    let tablePagination = document.querySelector(".table-pagination");
    tablePagination.append(...pagination.childNodes);
    // tablePagination.style.visibility = dataCount <= 5 ? "hidden" : "visible";
  }

  changeTab(tabType) {
    this.clearSearchInput();
    this.dropTable();
    this.currentTab = tabType;
    this.tableData = this.data;
    this.currentPage = 1;
    this.calculateTableData();
    this.recalculatePagination();
    this.updatePageInfo();
    this.render();
  }

  render() {
    throw new Error("Subclasses must implement render method.");
  }

  getHeaderFields() {
    throw new Error("Subclasses must implement getHeaderFields method.");
  }

  getRowFields(item) {
    throw new Error("Subclasses must implement getRowFields method.");
  }

  resetRowsPerPage() {
    this.itemsPerPage = 10;
    let rowsPerPage = document.querySelector("#rows-per-page");
    rowsPerPage.value = 10;
  }

  calculateTableData() {
    this.tabData =
      this.currentTab === this.getTabs()[0]
        ? this.tableData
        : this.tableData.filter((row) => row.status === this.currentTab);
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
    this.currentPageData = this.tabData.slice(this.startIndex, this.endIndex);
    this.dataCount = this.tabData.length;
    this.totalPages = Math.ceil(this.dataCount / this.itemsPerPage);
    this.pageBeginning =
      this.currentPage === 1
        ? 1
        : this.itemsPerPage * (this.currentPage - 1) + 1;
    this.pageEnding =
      this.currentPage === this.totalPages
        ? this.dataCount
        : this.pageBeginning + this.itemsPerPage - 1;
    this.pageInfo = `${this.pageBeginning} - ${this.pageEnding} of Page ${this.currentPage}`;
    this.totalPages = Math.ceil(this.dataCount / this.itemsPerPage);
  }

  recalculatePagination() {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
    this.currentPageData = this.tabData.slice(this.startIndex, this.endIndex);
  }

  paginate(type) {
    type === "next" ? this.currentPage++ : this.currentPage--;
    this.dropTable();
    this.calculateTableData();
    this.render();
    this.updatePageInfo();
    this.calculatePaginationButtonsState();
  }
}

class LoanApplicationHistoryTable extends Table {
  constructor(data) {
    super(data);
    this.renderTabs();
    this.renderPagination();
  }

  render() {
    const tableElement = document.createElement("table");

    let tableHead = tableElement.createTHead();
    const headerRow = tableHead.insertRow();

    for (const field of this.getHeaderFields()) {
      let th = document.createElement("th");

      switch (field) {
        case "User ID":
          th.style.minWidth = "10ch";
          break;
        case "First Name":
        case "Last Name":
          th.style.minWidth = "14ch";
          break;
        case "Phone Number":
          th.style.minWidth = "16ch";
          break;
        case "Home Address":
        case "Work Address":
          th.style.minWidth = "30ch";
          break;
        default:
          break;
      }

      th.textContent = field;
      headerRow.appendChild(th);
    }
    let tableBody = tableElement.createTBody();
    for (const item of this.currentPageData) {
      const row = tableBody.insertRow();
      for (const field of this.getRowFields(item)) {
        const cell = row.insertCell();

        cell.textContent = field;
      }
    }

    const adminTableContainer = document.querySelector(".table-container");

    adminTableContainer.append(tableElement);
  }

  getHeaderFields() {
    return ["Amount", "Interest Rate", "Tenor", "Status", "Date"];
  }

  getRowFields(loan) {
    return [...Object.values(loan)];
  }

  getTabs() {
    return ["All", "Approved", "Rejected"];
  }
}

class LoanOffersTable extends Table {
  constructor(data) {
    super(data);
    this.renderPagination();
  }

  render() {
    const tableElement = document.createElement("table");

    let tableHead = tableElement.createTHead();
    const headerRow = tableHead.insertRow();

    for (const field of this.getHeaderFields()) {
      let th = document.createElement("th");

      th.textContent = field;
      headerRow.appendChild(th);
    }

    let tableBody = tableElement.createTBody();

    for (const item of this.currentPageData) {
      const row = tableBody.insertRow();
      let index = 0;
      for (const field of this.getRowFields(item)) {
        const cell = row.insertCell();

        if (index === this.getRowFields(item).length - 1) {
          cell.append(this.getAdminActions(item));
        } else {
          cell.textContent = field;
        }
        index++;
      }
    }

    const adminTableContainer = document.querySelector(".table-container");

    adminTableContainer.append(tableElement);
  }

  getHeaderFields() {
    return ["Offer ID", "Amount", "Interest Rate", "Tenor"];
  }

  getRowFields(loan) {
    return [loan.id, loan.amount, loan.interestRate, loan.tenor, ""];
  }

  getTabs() {
    return [];
  }

  getAdminActions(loanOffer) {
    let adminActions = document.createElement("div");
    adminActions.classList.add("admin-actions");
    let editBtn = document.createElement("div");
    editBtn.classList.add("admin-action");
    editBtn.classList.add("accept");
    let editText = document.createElement("span");
    editText.innerText = "Edit";
    let editIcon = document.createElement("img");
    editIcon.setAttribute("src", "./assets/images/check_.svg");
    editBtn.append(editText, editIcon);
    editBtn.addEventListener("click", () => {
      modals.editLoanOffer.render(loanOffer, "approve");
    });

    let deleteBtn = document.createElement("div");
    deleteBtn.classList.add("admin-action");
    deleteBtn.classList.add("decline");
    let deleteText = document.createElement("span");
    deleteText.innerText = "Delete";
    let deleteIcon = document.createElement("img");
    deleteIcon.setAttribute("src", "./assets/images/model_x.svg");
    deleteBtn.append(deleteText, deleteIcon);
    deleteBtn.addEventListener("click", () => {
      modals.confirmOfferDeletion.render(loanOffer, "delete");
    });

    adminActions.append(editBtn, deleteBtn);

    return adminActions;
  }
}

class UsersTable extends Table {
  constructor(data) {
    super(data);
    this.renderTabs();
    this.renderSearch();
    this.renderPagination();
    this.calculatePaginationButtonsState();
  }

  getHeaderFields() {
    return [
      "User ID",
      "First Name",
      "Last Name",
      "Gender",
      "Phone Number",
      "Email",
      "Home Address",
      "Work Address",
      "Status",
      "",
    ];
  }

  getRowFields(user) {
    return [...Object.values(user), ""];
  }

  render() {
    const tableElement = document.createElement("table");

    let tableHead = tableElement.createTHead();
    const headerRow = tableHead.insertRow();

    for (const field of this.getHeaderFields()) {
      let th = document.createElement("th");

      switch (field) {
        case "User ID":
          th.style.minWidth = "10ch";
          break;
        case "First Name":
        case "Last Name":
          th.style.minWidth = "14ch";
          break;
        case "Phone Number":
          th.style.minWidth = "16ch";
          break;
        case "Home Address":
        case "Work Address":
          th.style.minWidth = "30ch";
          break;
        default:
          break;
      }

      th.textContent = field;
      headerRow.appendChild(th);
    }
    let tableBody = tableElement.createTBody();
    for (const item of this.currentPageData) {
      const row = tableBody.insertRow();
      let index = 0;
      for (const field of this.getRowFields(item)) {
        const cell = row.insertCell();

        if (index === this.getRowFields(item).length - 1) {
          cell.append(this.getAdminActions(item));
        } else {
          cell.textContent = field;
        }
        index++;
      }
    }

    const adminTableContainer = document.querySelector(".table-container");

    adminTableContainer.append(tableElement);
  }

  search(query) {
    // if (!query) return;
    this.dropTable();
    this.tableData = this.data.filter(
      (item) =>
        item["email"].toLowerCase().includes(query.toLowerCase()) ||
        item["firstName"].toLowerCase().includes(query.toLowerCase()) ||
        item["lastName"].toLowerCase().includes(query.toLowerCase())
    );
    this.calculateTableData();
    this.render();
  }

  getTabs() {
    return ["All", "Unverified", "Verified"];
  }

  getAdminActions(user) {
    let adminActions = document.createElement("div");
    adminActions.classList.add("admin-actions");
    let verifyBtn = document.createElement("div");
    verifyBtn.classList.add("admin-action");
    verifyBtn.classList.add("accept");
    let verifyText = document.createElement("span");
    verifyText.innerText = "Verify";
    let verifyIcon = document.createElement("img");
    verifyIcon.setAttribute("src", "./assets/images/check_.svg");
    verifyBtn.append(verifyText, verifyIcon);
    verifyBtn.addEventListener("click", () => {
      modals.confirm.render(user);
    });

    let revertBtn = document.createElement("div");
    revertBtn.classList.add("admin-action");
    revertBtn.classList.add("decline");
    let revertText = document.createElement("span");
    revertText.innerText = "Revert";
    let revertIcon = document.createElement("img");
    revertIcon.setAttribute("src", "./assets/images/model_x.svg");
    revertBtn.append(revertText, revertIcon);
    revertBtn.addEventListener("click", () => {
      modals.confirm.render(user, "revert");
    });

    switch (user.status) {
      case "Unverified":
        adminActions.append(verifyBtn);
        break;
      default:
        adminActions.append(revertBtn);
        break;
    }

    return adminActions;
  }
}

class AdminLoansTable extends Table {
  constructor(data) {
    super(data);
    this.renderTabs();
    this.renderSearch();
    this.renderPagination();
    this.calculatePaginationButtonsState();
  }

  render() {
    const tableElement = document.createElement("table");

    let tableHead = tableElement.createTHead();
    const headerRow = tableHead.insertRow();
    for (const field of this.getHeaderFields()) {
      let th = document.createElement("th");
      th.textContent = field;
      headerRow.appendChild(th);
    }

    let tableBody = tableElement.createTBody();
    for (const item of this.currentPageData) {
      const row = tableBody.insertRow();
      let index = 0;
      for (const field of this.getRowFields(item)) {
        const cell = row.insertCell();

        switch (index) {
          case this.getRowFields(item).length - 1:
            cell.append(this.getAdminAction(item));
            break;
          case this.getRowFields(item).length - 2:
            let link = document.createElement("a");
            link.textContent = "repayment history";
            link.setAttribute("href", "./repayment-history.html");
            link.style.textDecoration = "underline";
            link.style.color = "var(--lemon-green)";
            cell.append(link);
            break;
          default:
            cell.textContent = field;
            break;
        }

        index++;
      }
    }

    const adminTableContainer = document.querySelector(".table-container");

    adminTableContainer.append(tableElement);
  }
  search(query) {
    // if (!query) return;
    this.dropTable();
    this.tableData = this.data.filter((item) =>
      item["email"].toLowerCase().includes(query.toLowerCase())
    );
    this.calculateTableData();
    this.render();
  }

  getTabs() {
    return ["All", "Active", "Paid"];
  }
  getHeaderFields() {
    return [
      "Loan ID",
      "User Email",
      "Amount",
      "Interest",
      "Tenor",
      "Status",
      "Installment",
      "Start Date",
      "Due Date",
    ];
  }

  getRowFields(loan) {
    return [...Object.values(loan), "", ""];
  }

  getAdminAction(loan) {
    let adminAction = document.createElement("div");
    adminAction.classList.add("admin-actions");
    let repaymentBtn = document.createElement("div");
    repaymentBtn.classList.add("admin-action");
    repaymentBtn.classList.add("post-repayment");
    let text = document.createElement("span");
    text.innerText = "Post repayment";
    let icon = document.createElement("img");
    icon.setAttribute("src", "./assets/images/check_.svg");
    repaymentBtn.append(text, icon);
    repaymentBtn.addEventListener("click", () => {
      if (loan.status !== "Active") return;
      modals.repayment.render();
    });

    repaymentBtn.style.opacity = loan.status === "Paid" && 0.4;
    repaymentBtn.style.cursor =
      loan.status === "Paid" ? "not-allowed" : "pointer";

    adminAction.append(repaymentBtn);
    return adminAction;
  }
}

class UserLoansTable extends Table {
  constructor(data) {
    super(data);
    this.renderTabs();
    this.renderPagination();
    this.calculatePaginationButtonsState();
  }

  render() {
    const tableElement = document.createElement("table");

    let tableHead = tableElement.createTHead();
    const headerRow = tableHead.insertRow();
    for (const field of this.getHeaderFields()) {
      let th = document.createElement("th");

      th.textContent = field;
      headerRow.appendChild(th);
    }

    let tableBody = tableElement.createTBody();
    for (const item of this.currentPageData) {
      const row = tableBody.insertRow();
      let index = 0;
      for (const field of this.getRowFields(item)) {
        const cell = row.insertCell();

        if (index === this.getRowFields(item).length - 1) {
          let link = document.createElement("a");
          link.textContent = "repayment history";
          link.setAttribute("href", "./repayment-history.html");
          link.style.textDecoration = "underline";
          link.style.color = "var(--lemon-green)";
          cell.append(link);
        } else {
          cell.textContent = field;
        }

        index++;
      }
    }

    const adminTableContainer = document.querySelector(".table-container");

    adminTableContainer.append(tableElement);
  }
  search(query) {
    this.dropTable();
    this.tableData = this.data.filter((item) =>
      item["email"].toLowerCase().includes(query.toLowerCase())
    );
    this.calculateTableData();
    this.render();
  }

  getTabs() {
    return ["All", "Active", "Paid"];
  }
  getHeaderFields() {
    return [
      "Loan ID",
      "Amount",
      "Interest",
      "Tenor",
      "Status",
      "Installment",
      "Start Date",
      "Due Date",
    ];
  }

  getRowFields(loan) {
    return [
      loan.id,
      loan.amount,
      loan.interest,
      loan.tenor,
      loan.status,
      loan.installment,
      loan.startDate,
      loan.dueDate,
      "",
    ];
  }

  getAdminAction(loan) {
    let adminAction = document.createElement("div");
    adminAction.classList.add("admin-actions");
    let repaymentBtn = document.createElement("div");
    repaymentBtn.classList.add("admin-action");
    repaymentBtn.classList.add("post-repayment");
    let text = document.createElement("span");
    text.innerText = "Post repayment";
    let icon = document.createElement("img");
    icon.setAttribute("src", "./assets/images/check_.svg");
    repaymentBtn.append(text, icon);
    repaymentBtn.addEventListener("click", () => {
      if (loan.status !== "Active") return;
      console.log({ repayment: loan });
    });

    repaymentBtn.style.opacity = loan.status === "Paid" && 0.4;
    repaymentBtn.style.cursor =
      loan.status === "Paid" ? "not-allowed" : "pointer";

    adminAction.append(repaymentBtn);
    return adminAction;
  }
}

class RepaymentHistoryTable extends Table {
  constructor(data) {
    super(data);
    // this.renderTabs();
    this.renderPagination();
    // this.prev_button = document.querySelector("#prev");
    // this.next_button = document.querySelector("#next");

    // this.prev_button.disabled = this.currentPage === 1;
    // this.prev_button.disabled
    //   ? (this.prev_button.style.opacity = ".5")
    //   : (this.prev_button.style.opacity = "1");

    // this.next_button.disabled = this.currentPage === this.totalPages;
    // this.next_button.disabled
    //   ? (this.next_button.style.opacity = ".5")
    //   : (this.next_button.style.opacity = "1");
  }

  render() {
    const tableElement = document.createElement("table");

    let tableHead = tableElement.createTHead();
    const headerRow = tableHead.insertRow();
    for (const field of this.getHeaderFields()) {
      let th = document.createElement("th");

      th.textContent = field;
      headerRow.appendChild(th);
    }

    let tableBody = tableElement.createTBody();
    for (const item of this.currentPageData) {
      const row = tableBody.insertRow();
      for (const field of this.getRowFields(item)) {
        const cell = row.insertCell();

        cell.textContent = field;
      }
    }

    const adminTableContainer = document.querySelector(".table-container");

    adminTableContainer.append(tableElement);
  }
  search(query) {
    this.dropTable();
    this.tableData = this.data.filter((item) =>
      item["email"].toLowerCase().includes(query.toLowerCase())
    );
    this.calculateTableData();
    this.render();
  }

  getTabs() {
    return [];
  }
  getHeaderFields() {
    return ["Loan ID", "Amount", "Date"];
  }

  getRowFields(repayment) {
    return [...Object.values(repayment)];
  }

  getAdminAction(loan) {
    let adminAction = document.createElement("div");
    adminAction.classList.add("admin-actions");
    let repaymentBtn = document.createElement("div");
    repaymentBtn.classList.add("admin-action");
    repaymentBtn.classList.add("post-repayment");
    let text = document.createElement("span");
    text.innerText = "Post repayment";
    let icon = document.createElement("img");
    icon.setAttribute("src", "./assets/images/check_.svg");
    repaymentBtn.append(text, icon);
    repaymentBtn.addEventListener("click", () => {
      if (loan.status !== "Active") return;
      console.log({ repayment: loan });
    });

    repaymentBtn.style.opacity = loan.status === "Paid" && 0.4;
    repaymentBtn.style.cursor =
      loan.status === "Paid" ? "not-allowed" : "pointer";

    adminAction.append(repaymentBtn);
    return adminAction;
  }
}

class LoanApplicationsTable extends Table {
  constructor(data) {
    super(data);
    this.renderTabs();
    this.renderSearch();
    this.renderPagination();
    this.calculatePaginationButtonsState();
  }

  render() {
    let tabData =
      this.currentTab === this.getTabs()[0]
        ? this.tableData
        : this.tableData.filter((row) => row.status === this.currentTab);

    let startIndex = (this.currentPage - 1) * this.itemsPerPage;
    let endIndex = startIndex + this.itemsPerPage;
    let currentPageData = tabData.slice(startIndex, endIndex);

    const tableElement = document.createElement("table");

    let tableHead = tableElement.createTHead();
    const headerRow = tableHead.insertRow();

    for (const field of this.getHeaderFields()) {
      let th = document.createElement("th");

      switch (field) {
        case "User ID":
          th.style.minWidth = "10ch";
          break;
        case "First Name":
        case "Last Name":
          th.style.minWidth = "14ch";
          break;
        case "Phone Number":
          th.style.minWidth = "16ch";
          break;
        case "Home Address":
        case "Work Address":
          th.style.minWidth = "30ch";
          break;
        default:
          break;
      }

      th.textContent = field;
      headerRow.appendChild(th);
    }
    let tableBody = tableElement.createTBody();
    for (const item of currentPageData) {
      const row = tableBody.insertRow();
      let index = 0;
      for (const field of this.getRowFields(item)) {
        const cell = row.insertCell();

        if (index === this.getRowFields(item).length - 1) {
          cell.append(this.getAdminActions(item));
        } else {
          cell.textContent = field;
        }
        index++;
      }
    }

    const adminTableContainer = document.querySelector(".table-container");

    adminTableContainer.append(tableElement);
  }

  getAdminActions(loan) {
    let adminActions = document.createElement("div");
    adminActions.classList.add("admin-actions");
    let approveBtn = document.createElement("div");
    approveBtn.classList.add("admin-action");
    approveBtn.classList.add("accept");
    let approveText = document.createElement("span");
    approveText.innerText = "Approve";
    let approveIcon = document.createElement("img");
    approveIcon.setAttribute("src", "./assets/images/check_.svg");
    approveBtn.append(approveText, approveIcon);
    approveBtn.addEventListener("click", () => {
      if (loan.status !== "Pending") return;
      modals.confirm.render(loan, "approve");
    });

    let rejectBtn = document.createElement("div");
    rejectBtn.classList.add("admin-action");
    rejectBtn.classList.add("decline");
    let rejectText = document.createElement("span");
    rejectText.innerText = "Reject";
    let rejectIcon = document.createElement("img");
    rejectIcon.setAttribute("src", "./assets/images/model_x.svg");
    rejectBtn.append(rejectText, rejectIcon);
    rejectBtn.addEventListener("click", () => {
      if (loan.status !== "Pending") return;
      modals.confirm.render(loan, "reject");
    });

    adminActions.append(approveBtn, rejectBtn);

    if (loan.status !== "Pending") {
      adminActions.style.opacity = 0.1;
      adminActions
        .querySelectorAll(".admin-action")
        .forEach((action) => (action.style.cursor = "not-allowed"));
    }

    return adminActions;
  }
  search(query) {
    this.dropTable();
    this.tableData = this.data.filter(
      (item) =>
        item["email"].toLowerCase().includes(query.toLowerCase()) ||
        item["firstName"].toLowerCase().includes(query.toLowerCase()) ||
        item["lastName"].toLowerCase().includes(query.toLowerCase())
    );
    this.render();
  }

  getTabs() {
    return ["All", "Pending", "Approved", "Rejected"];
  }

  getHeaderFields() {
    return [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Amount",
      "Interest",
      "Phone Number",
      "Home Address",
      "Work Address",
      "Status",
      "",
    ];
  }

  getRowFields(application) {
    return [...Object.values(application), ""];
  }
}

export function createAdminTable(type, data) {
  switch (type) {
    case "loan-application-history":
      return new LoanApplicationHistoryTable(data);
    case "user-loans":
      return new UserLoansTable(data);
    case "repayment-history":
      return new RepaymentHistoryTable(data);
    case "admin-loans":
      return new AdminLoansTable(data);
    case "users":
      return new UsersTable(data);
    case "loan-applications":
      return new LoanApplicationsTable(data);
    case "loan-offers":
      return new LoanOffersTable(data);
    default:
      throw new Error("Unknown admin table type: " + type);
  }
}
