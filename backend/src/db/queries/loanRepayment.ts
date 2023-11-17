const createLoanRepaymentsTable = `
  CREATE TABLE IF NOT EXISTS loan_repayments (
    repayment_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_on TIMESTAMP DEFAULT NOW(),
    loan_id uuid REFERENCES loans(loan_id),
    amount INT NOT NULL
  );
`;

const dropLoanRepaymentsTable = `
  DROP TABLE IF EXIST user;
`;

export { createLoanRepaymentsTable, dropLoanRepaymentsTable };
