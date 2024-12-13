const pool = require("./pool");

const user = {
  usernameIsUnique: async (username) => {
    const SQL = `
      SELECT username FROM m_user
      WHERE $1 = username;
    `;

    const { rows } = await pool.query(SQL, [username]);
    return rows.length === 0;
  },

  emailIsUnique: async (email) => {
    const SQL = `
      SELECT email FROM m_user
      WHERE email = $1;
    `;

    const { rows } = await pool.query(SQL, [email]);
    return rows.length === 0;
  },

  insert: async (firstName, lastName, username, email, hashedPassword) => {
    const SQL = `
      INSERT INTO m_user (first_name, last_name, username, email, hashed_password)
      VALUES ($1, $2, $3, $4, $5);
    `;
    
    await pool.query(SQL, [firstName, lastName, username, email, hashedPassword]);
  },

  getFromUsername: async (username) => {
    const SQL = `
      SELECT * FROM m_user
      WHERE username = $1;
    `;
    
    const { rows } = await pool.query(SQL, [username]);
    return rows[0];
  },

  getFromId: async (id) => {
    const SQL = `
      SELECT * FROM m_user
      WHERE id = $1;
    `;

    const { rows } = await pool.query(SQL, [id]);
    return rows[0];
  },
};

module.exports = {
  user,
};
