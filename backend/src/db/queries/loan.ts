const createLoansTable = `
  CREATE TABLE IF NOT EXISTS loans (
      loan_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_email VARCHAR(30) REFERENCES users(email) ON DELETE CASCADE,
      created_on TIMESTAMP DEFAULT NOW(), 
      status VARCHAR(15) NOT NULL,
      repaid BOOLEAN NOT NULL,
      tenor INT NOT NULL,
      amount INT NOT NULL,
      payment_installment INT NOT NULL,
      balance INT NOT NULL,
      interest DECIMAL NOT NULL
  );
`;

const dropLoansTable = `
  DROP TABLE IF EXIST user;
`;

export { createLoansTable, dropLoansTable };
