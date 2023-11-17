export const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
      uid uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
      email VARCHAR(40) UNIQUE NOT NULL,
      first_name VARCHAR(30) NOT NULL,
      last_name VARCHAR(30) NOT NULL,
      password VARCHAR NOT NULL,
      address VARCHAR NOT NULL,
      status VARCHAR(20) DEFAULT 'unverified',
      is_admin BOOLEAN DEFAULT false
  );
`;

export const dropUsersTable = `DROP TABLE IF EXIST user;`;
