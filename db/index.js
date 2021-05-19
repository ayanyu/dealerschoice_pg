const pg = require('pg');
const client = new pg.Client('postgres://localhost/makeup_brand_db');

const syncAndSeed = async() => {
    const SQL =  `
    DROP TABLE IF EXISTS cosmetic;
    DROP TABLE IF EXISTS brand;


    CREATE TABLE brand (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );

    CREATE TABLE cosmetic (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand_id INTEGER REFERENCES brand(id)
    );

      INSERT INTO brand (id, name) VALUES (1, 'NARS');
      INSERT INTO brand (id, name) VALUES (2, 'MAC');
      INSERT INTO brand (id, name) VALUES (3, 'CHANNEL');
      INSERT INTO cosmetic (id, name, brand_id ) VALUES (1, 'Nars Eyeliner', 1);
      INSERT INTO cosmetic (id, name, brand_id ) VALUES (2, 'Mac lipgloss', 2);
      INSERT INTO cosmetic (id, name, brand_id ) VALUES (3, 'Channel Powder', 3);
      INSERT INTO cosmetic (id, name, brand_id ) VALUES (4, 'Nars Eyeshadow', 1);
    `;
    await client.query(SQL);
}

module.exports = {
    client,
    syncAndSeed
}