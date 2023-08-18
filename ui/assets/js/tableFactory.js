import modals from "./modalFactory.js";

class Table {
  constructor(data, itemsPerPage = 10) {
    this.data = data;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.currentTab = this.getTabs()[0];
    this.tableData = data;
    this.calculateTableData();
    this.render();

    const tablePagination = document.querySelector(".table-pagination");
    const tableContainer = document.querySelector(".table-container");
    tablePagination.style.display =
      this.dataCount > this.itemsPerPage ? "flex" : "none";
    tableContainer.style.marginBottom =
      this.dataCount > this.itemsPerPage ? "0" : "10rem";
  }

  createElementFromString(elementString) {
    let range = document.createRange();
    return range.createContextualFragment(elementString).children[0];
  }

  calculateTableData() {
    this.tabData =
      this.currentTab === this.getTabs()[0]
        ? this.tableData
        : this.tableData.filter((row) => row.status === this.currentTab);
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;

    if (this.getTabs()[0]) {
      this.currentPageData = this.tabData.slice(this.startIndex, this.endIndex);
      this.dataCount = this.tabData.length;
    } else {
      this.currentPageData = this.data.slice(this.startIndex, this.endIndex);
      this.dataCount = this.data.length;
    }

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

  calculatePaginationButtonsState() {
    const prev_button = document.querySelector("#prev");
    const next_button = document.querySelector("#next");

    prev_button.disabled = this.currentPage === 1;
    prev_button.disabled
      ? ((prev_button.style.opacity = ".1"),
        (prev_button.style.cursor = "not-allowed"))
      : ((prev_button.style.opacity = "1"),
        (prev_button.style.cursor = "pointer"));

    next_button.disabled = this.currentPage === this.totalPages;
    next_button.disabled
      ? ((next_button.style.opacity = ".1"),
        (next_button.style.cursor = "not-allowed"))
      : ((next_button.style.opacity = "1"),
        (next_button.style.cursor = "pointer"));
  }

  renderTabs() {
    const tableTabs = document.createElement("div");
    tableTabs.classList.add("table-tabs");

    for (const tab of this.getTabs()) {
      const tabButton = document.createElement("div");
      const classNames =
        tab === this.currentTab ? ["tab", "tab--active"] : ["tab"];
      tabButton.classList.add(...classNames);
      tabButton.textContent = tab;
      tableTabs.appendChild(tabButton);
    }

    const tabs = tableTabs.childNodes;
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
    let element = `
      <div class="search">
        <img src="./assets/images/search.svg" alt="search icon" />
        <input type="text" placeholder="Search"/>
      </div>
    `;

    const searchBox = this.createElementFromString(element);
    let input = searchBox.children[1];
    input.addEventListener("keyup", (e) => {
      const query = e.target.value;
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

    const tableHead = document.querySelector(".table-head");
    tableHead.append(searchBox);
  }

  renderPagination() {
    let element = `
      <div>
        <span class="page-info">1 - 10 of Page 1</span>
        <span class="right">
          <span>
            <span>Rows per page: </span>
            <select id="rows-per-page">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </span>
          <span>
            <button id="prev">Previous</button>
            <button id="next">Next</button>
          </span>
        </span>
      </div>
    `;

    let pagination = this.createElementFromString(element);

    let select = pagination.querySelector("select");
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

    let paginationButtons = pagination.querySelectorAll("button");
    paginationButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.paginate(e.target.id);
      });
    });

    let tablePagination = document.querySelector(".table-pagination");
    tablePagination.append(...pagination.childNodes);
  }

  dropTable() {
    const table = document.querySelector("table");
    table.remove();
  }

  updatePageInfo() {
    const pageInfo = document.querySelector(".page-info");
    pageInfo.innerText = this.pageInfo;
  }

  resetRowsPerPage() {
    this.itemsPerPage = 10;
    const rowsPerPage = document.querySelector("#rows-per-page");
    rowsPerPage.value = 10;
  }

  changeTab(tabType) {
    this.clearSearchInput();
    this.dropTable();
    this.currentTab = tabType;
    this.tableData = this.data;
    this.currentPage = 1;
    this.calculateTableData();
    this.render();
    this.updatePageInfo();
  }

  paginate(type) {
    type === "next" ? this.currentPage++ : this.currentPage--;
    this.dropTable();
    this.calculateTableData();
    this.render();
    this.updatePageInfo();
    this.calculatePaginationButtonsState();
  }

  search(query) {
    this.dropTable();
    this.queryData(query);
    this.calculateTableData();
    this.render();
  }

  clearSearchInput() {
    const searchInput = document.querySelector(".search input");
    searchInput && (searchInput.value = "");
  }

  render() {
    throw new Error("Subclasses must implement render method.");
  }

  getHeaderFields() {
    throw new Error("Subclasses must implement getHeaderFields method.");
  }

  getRowFields() {
    throw new Error("Subclasses must implement getRowFields method.");
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
    return [loan.amount, loan.interestRate, loan.tenor, loan.status, loan.date];
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

    let element = `
      <div class="admin-action accept">
        <span>Edit</span>
        <span>📝</span>
      </div>
    `;
    let editBtn = this.createElementFromString(element);
    editBtn.addEventListener("click", () => {
      modals.editLoanOffer.render(loanOffer, "approve");
    });

    element = `
      <div class="admin-action decline">
        <span>Delete</span>
        <span>X</span>
      </div>
    `;
    let deleteBtn = this.createElementFromString(element);
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
    return [
      user.id,
      user.firstName,
      user.lastName,
      user.gender,
      user.phoneNumber,
      user.email,
      user.homeAddress,
      user.workAddress,
      user.status,
      "",
    ];
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

  queryData(query) {
    this.tableData = !query
      ? this.data
      : this.data.filter(
          (item) =>
            item["email"].toLowerCase().includes(query.toLowerCase()) ||
            item["firstName"].toLowerCase().includes(query.toLowerCase()) ||
            item["lastName"].toLowerCase().includes(query.toLowerCase())
        );
  }

  getTabs() {
    return ["All", "Unverified", "Verified"];
  }

  getAdminActions(user) {
    let adminActions = document.createElement("div");
    adminActions.classList.add("admin-actions");

    let element = `
      <div class="admin-action accept">
        <span>Verify</span>
        <img src="./assets/images/check_.svg" alt="verify icon"/>
      </div>
    `;
    let verifyBtn = this.createElementFromString(element);
    verifyBtn.addEventListener("click", () => {
      modals.confirm.render(user);
    });

    element = `
      <div class="admin-action decline">
        <span>Revert</span>
        <img src="./assets/images/model_x.svg" alt="revert icon">
      </div>
    `;
    let revertBtn = this.createElementFromString(element);
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

  queryData(query) {
    this.tableData = !query
      ? this.data
      : this.data.filter((item) =>
          item["email"].toLowerCase().includes(query.toLowerCase())
        );
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
    return [
      loan.id,
      loan.email,
      loan.amount,
      loan.interest,
      loan.tenor,
      loan.status,
      loan.installment,
      loan.startDate,
      loan.dueDate,
      "",
      "",
    ];
  }

  getAdminAction(loan) {
    let html = `
    <div class="admin-actions">
      <div class="admin-action post-repayment">
        <span>Post repayment</span>
        <img src="./assets/images/check_.svg" alt="post repayment icon">
      </div>
    </div>
    `;
    let adminAction = range.createContextualFragment(html).children[0];
    let repaymentBtn = adminAction.children[0];

    repaymentBtn.addEventListener("click", () => {
      if (loan.status !== "Active") return;
      modals.repayment.render();
    });

    repaymentBtn.style.opacity = loan.status === "Paid" && 0.4;
    repaymentBtn.style.cursor =
      loan.status === "Paid" ? "not-allowed" : "pointer";

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
}

class RepaymentHistoryTable extends Table {
  constructor(data) {
    super(data);
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

      for (const field of this.getRowFields(item)) {
        const cell = row.insertCell();
        cell.textContent = field;
      }
    }

    const adminTableContainer = document.querySelector(".table-container");
    adminTableContainer.append(tableElement);
  }

  getTabs() {
    return [];
  }

  getHeaderFields() {
    return ["Loan ID", "Amount", "Date"];
  }

  getRowFields(repayment) {
    return [repayment.id, repayment.amount, repayment.date];
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

  getAdminActions(loan) {
    let element = `
      <div class="admin-actions">
        <button class="admin-action accept">
          <span>Approve</span>
          <img src="./assets/images/check_.svg" alt="approve icon"/>
        </button>
        <button class="admin-action decline">
          <span>Reject</span>
          <img src="./assets/images/model_x.svg" alt="reject icon" />
        </button>
      </div>
    `;

    let adminActions = this.createElementFromString(element);
    let [approveBtn, rejectBtn] = adminActions.children;
    approveBtn.addEventListener("click", () => {
      if (loan.status !== "Pending") return;
      modals.confirm.render(loan, "approve");
    });
    rejectBtn.addEventListener("click", () => {
      if (loan.status !== "Pending") return;
      modals.confirm.render(loan, "reject");
    });

    if (loan.status !== "Pending") {
      adminActions.style.opacity = 0.1;
      [approveBtn, rejectBtn].forEach(
        (button) => (button.style.cursor = "not-allowed")
      );
    }

    return adminActions;
  }

  queryData(query) {
    this.tableData = !query
      ? this.data
      : this.data.filter(
          (item) =>
            item["email"].toLowerCase().includes(query.toLowerCase()) ||
            item["firstName"].toLowerCase().includes(query.toLowerCase()) ||
            item["lastName"].toLowerCase().includes(query.toLowerCase())
        );
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
