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
        ON (m_user_friend.user_0 = m_user.id OR m_user_friend.user_1 = m_user.id) AND
        (m_user_friend.user_0 = $1 OR m_user_friend.user_1 = $1)
      WHERE m_user.id != $1;
    `;

    const { rows } = await pool.query(SQL, [id]);
    return rows;
  },
};

const message = {
  addUser: async (user0, user1) => {
    const SQL = `
      INSERT INTO m_user_friend (user_0, user_1)
      VALUES ($1, $2);
    `;

    await pool.query(SQL, [user0, user1]);
  },

  getMessagedUsersFromID: async (userId) => {
    // https://www.postgresql.org/docs/9.5/functions-aggregate.html
    // SQL PROS, PLEASE DO NOT FLAME ME! 

    /*
    const SQL = `
      SELECT
        m_user.id,
        first_name,
        last_name,
        ARRAY_AGG(CASE WHEN m.sender_id = m_user.id THEN 'from' ELSE 'to' END) AS who,
        ARRAY_AGG(message) AS messages
      FROM m_message as m
      JOIN m_user
      ON 
        (m.sender_id = m_user.id OR m.reciever_id = m_user.id) AND
        (m.sender_id = $1 OR m.reciever_id = $1)
      WHERE
        m_user.id != $1
      GROUP BY 
        m_user.id, first_name, last_name
      ORDER BY
        m_user.id;
    `;*/

    // MY GOSH I NEED TO PRACTICE SQLLLL!!!!!!!!
    const SQL = `
      SELECT
        m_user.id,
        first_name,
        last_name,
        ARRAY_AGG(CASE WHEN m.sender_id = m_user.id THEN 'from' ELSE 'to' END) AS who,
        ARRAY_AGG(message) AS messages
      FROM 
          m_user_friend uf
      JOIN 
          m_user
          ON m_user.id = uf.user_0 OR m_user.id = uf.user_1
      LEFT JOIN 
          m_message m
          ON (m.sender_id = uf.user_0 AND m.reciever_id = uf.user_1) 
          OR (m.sender_id = uf.user_1 AND m.reciever_id = uf.user_0)
      WHERE
          (uf.user_0 = $1 OR uf.user_1 = $1)
          AND m_user.id != $1
      GROUP BY 
          m_user.id, first_name, last_name
      ORDER BY
          m_user.id;
    `

    const { rows } = await pool.query(SQL, [userId]);
    return rows;
  },

  insert: async (sender, reciever, message) => {
    const SQL = `
      INSERT INTO m_message (sender_id, reciever_id, message)
      VALUES ($1, $2, $3);
    `;

    await pool.query(SQL, [sender, reciever, message]);

  },
};

module.exports = {
  user,
  message,
};
