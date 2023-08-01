let data;

const password_show_btn = document.querySelector(".password-show");
const password = document.querySelector(".password input");

/**
 *  Password show and hide logic
 */

if (password_show_btn) {
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
}

let data_table = document.querySelector(".data");
let thead = data_table && data_table.querySelector("table thead");
let tbody = data_table && data_table.querySelector("table tbody");

// Pagination variables
let activePage = 1;
let rowsPerPage = 10;
let count;
let totalPages;
let calculatedRows;

let table_pagination = document.querySelector(".table-pagination");

let rows_per_page_elem, pagination_buttons, prev_button, next_button;

if (table_pagination) {
  rows_per_page_elem = table_pagination.querySelector("select");
  pagination_buttons = table_pagination.querySelectorAll("button");
  prev_button = table_pagination.querySelector("#prev");
  next_button = table_pagination.querySelector("#next");

  rows_per_page_elem.addEventListener("change", (e) => {
    rowsPerPage = e.target.value * 1;
    activePage = 1;
    populateTable();
  });

  [...pagination_buttons].forEach((button) =>
    button.addEventListener("click", () => {
      if (button.id === "next") {
        activePage += 1;
      } else {
        activePage -= 1;
      }
      populateTable();
    })
  );
}

/**
 * Table tabs switching logic
 */
let loan_status = "Active";

let table_tabs = document.querySelectorAll(".table-tabs .tab");

table_tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.innerText === loan_status) return;
    table_tabs.forEach((tab) => {
      if ([...tab.classList].includes("tab--active")) {
        tab.classList.remove("tab--active");
        return;
      }
      tab.classList.add("tab--active");
    });

    loan_status = tab.innerText;
    activePage = 1;
    rowsPerPage = 10;
    rows_per_page_elem.value = 10;
    populateTable();
  });
});

/**
 * Table population logic
 */
function populateTable() {
  thead.innerHTML = "";
  tbody.innerHTML = "";

  let table_to_display = data_table.dataset["table"];

  if (table_to_display) {
    let table_data = { ...data[table_to_display] };

    if (table_to_display === "loans") {
      table_data.datas = table_data.datas.filter(
        (data) => data.status === loan_status
      );
    }

    count = table_data.datas.length;
    totalPages = Math.ceil(count / rowsPerPage);
    calculatedRows = table_data.datas.slice(
      (activePage - 1) * rowsPerPage,
      activePage * rowsPerPage
    );
    let beginning = activePage === 1 ? 1 : rowsPerPage * (activePage - 1) + 1;
    let end = activePage === totalPages ? count : beginning + rowsPerPage - 1;

    if (count <= 5) {
      table_pagination.style.visibility = "hidden";
    } else {
      table_pagination.style.visibility = "visible";
    }

    if (!(table_pagination.style.visibility === "hidden")) {
      if (activePage === 1) {
        prev_button.disabled = true;
      } else {
        prev_button.disabled = false;
      }

      if (activePage === Math.ceil((totalPages * rowsPerPage) / rowsPerPage)) {
        next_button.disabled = true;
      } else {
        next_button.disabled = false;
      }

      let page = table_pagination.querySelector(".page");
      page.innerText = `${beginning}-${end} of Page ${activePage}`;
    }

    let tr = document.createElement("tr");

    table_data["headings"].forEach((heading) => {
      let th = document.createElement("th");
      th.innerText = heading;
      tr.append(th);
    });

    thead.appendChild(tr);

    calculatedRows.forEach((data) => {
      tr = document.createElement("tr");
      let td;

      for (let key of Object.keys(data)) {
        td = document.createElement("td");
        td.innerText = data[key];
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    });
  }
}

async function fetchData() {
  let res = await fetch("./assets/data.json");
  data = await res.json();
  data && populateTable();
}

if (data_table) {
  window.addEventListener("load", fetchData);
}
