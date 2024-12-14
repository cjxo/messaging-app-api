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

  getAllUsersWhoIsNotId: async (id) => {
    // Get all users in the system and return the following:
    // 1. username
    // 2. isAddedByUser
    const SQL = `
      SELECT
        m_user.id,
        username,
        (CASE
          WHEN (user_0 = $1) OR (user_1 = $1) THEN TRUE
          ELSE FALSE
        END)::BOOLEAN AS alreadyAdded
      FROM
        m_user
      LEFT JOIN
        m_user_friend
        ON (m_user_friend.user_0 = m_user.id OR m_user_friend.user_1 = m_user.id)
      WHERE m_user.id != $1;
    `;

    const { rows } = await pool.query(SQL, [id]);
    return rows;
  },
};

module.exports = {
  user,
};
