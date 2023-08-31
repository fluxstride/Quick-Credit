// let baseUrl = new URL("https://qc-ctdn.onrender.com/");
let baseUrl = new URL("http://localhost:4000");

export async function fetchTableData() {
  let response = await fetch(baseUrl + "db");
  return response.json();
}

export function confirmAction(data, type) {
  let linkPath;
  let requestBody;
  switch (type) {
    case "verify":
      linkPath = `users/${data.id}`;
      requestBody = { status: "Verified" };
      break;
    case "revert":
      linkPath = `users/${data.id}`;
      requestBody = { status: "Unverified" };
      break;
    case "approve":
      linkPath = `loan-applications/${data.id}`;
      requestBody = { status: "Approved" };
      break;
    case "reject":
      linkPath = `loan-applications/${data.id}`;
      requestBody = { status: "Rejected" };
      break;
    case "delete":
      linkPath = `loan-offers/${data.id}`;
      break;
    default:
      break;
  }

  return fetch(baseUrl + linkPath, {
    method: type === "delete" ? "DELETE" : "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody ?? {}),
  });
}

export function postRepayment(repayment) {
  return fetch(baseUrl + "repayment-history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(repayment),
  });
}

export function createLoanOffer(offer) {
  return fetch(baseUrl + "loan-offers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(offer),
  });
}

export async function getLoanOffers() {
  let response = await fetch(baseUrl + "loan-offers");
  if (response.ok) return response.json();
  throw new Error("Status code error :" + res.status);
}

export function editLoanOffer(id, data) {
  return fetch(baseUrl + "loan-offers/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });
}
