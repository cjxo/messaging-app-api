const pool = require("./pool.js");

// https://www.postgresql.org/docs/current/sql-createtable.html
// https://www.postgresql.org/docs/current/ddl-constraints.html
// https://www.postgresql.org/docs/current/ddl-identity-columns.html
// https://www.postgresql.org/docs/current/functions-datetime.html
// https://www.postgresql.org/docs/current/datatype-datetime.html
const SQL = `
  DROP TABLE IF EXISTS m_message;
  -- DROP TABLE IF EXISTS m_user;
  CREATE TABLE IF NOT EXISTS m_user (
    id                INTEGER         PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name        VARCHAR(64)     UNIQUE NOT NULL,
    last_name         VARCHAR(64)     NOT NULL,
    username          VARCHAR(64)     UNIQUE NOT NULL,
    hashed_password   VARCHAR(256)    NOT NULL,
    date_joined       TIMESTAMPTZ     DEFAULT(TIMEZONE('utc', NOW())),
    email             VARCHAR(64)     UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS m_user_friend (
    id                INTEGER         PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_0            INTEGER         NOT NULL REFERENCES m_user(id),
    user_1            INTEGER         NOT NULL REFERENCES m_user(id),
    CHECK(user_0 != user_1),
    UNIQUE(user_0, user_1)
  );

  CREATE TABLE IF NOT EXISTS m_message (
    id                INTEGER         PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_id         INTEGER         REFERENCES m_user (id),
    reciever_id       INTEGER         REFERENCES m_user (id),
    message           TEXT            NOT NULL,
    date_created      TIMESTAMPTZ     DEFAULT(TIMEZONE('utc', NOW())),
    is_read           BOOLEAN         DEFAULT FALSE,
    CHECK (sender_id != reciever_id)
  ); 
`;

/*
 * CREATE TABLE IF NOT EXISTS m_message (
    id                INTEGER         PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_friend_id    INTEGER         REFERENCES m_user_friend (id),
    sender_id         INTEGER         REFERENCES m_user (id),
    message           TEXT            NOT NULL,
    date_created      TIMESTAMPTZ     DEFAULT(TIMEZONE('utc', NOW())),
    is_read           BOOLEAN         DEFAULT FALSE
  );
*/

const main = async () => {
  const client = await pool.connect();
  
  await client.query(SQL);

  client.release();
};

main();
