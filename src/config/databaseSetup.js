import mysql from "mysql2/promise";
import logger from "./logger.js";
import "dotenv/config";

async function setupDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS clinic_pets_db`);
    logger.info("[DB] Banco clinic_pets_db verificado/criado.");

    await connection.end();

    const { db } = await import("./database.js");

    await db.query(`
      CREATE TABLE IF NOT EXISTS owners (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS pets (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        species VARCHAR(100) NOT NULL,
        breed VARCHAR(100) DEFAULT NULL,
        birthdate DATE DEFAULT NULL,
        owner_id INT NOT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY fk_pets_owner (owner_id),
        CONSTRAINT fk_pets_owner FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT NOT NULL AUTO_INCREMENT,
        pet_id INT NOT NULL,
        date DATETIME NOT NULL,
        veterinarian_name VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('AGENDADA','REALIZADA','CANCELADA') DEFAULT 'AGENDADA',
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY fk_app_pet (pet_id),
        CONSTRAINT fk_app_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    logger.info("[DB] Tabelas verificadas/criadas com sucesso.");

    const [rows] = await db.query(`SELECT COUNT(*) AS total FROM owners`);
    if (rows[0].total === 0) {
      await db.query(`INSERT INTO owners (name, phone, address) VALUES 
        ('João da Silva', '1199999-1234', 'Rua A, 123'),
        ('Maria Oliveira', '2198888-8910', 'Rua B, 456')
      `);

      await db.query(`INSERT INTO pets (name, species, breed, birthdate, owner_id) VALUES
        ('Rex', 'Cachorro', 'Labrador', '2019-05-20', 1),
        ('Mimi', 'Gato', 'Persa', '2020-08-10', 2)
      `);

      logger.info("[DB] Dados iniciais inseridos.");
    } else {
      logger.info("[DB] Dados iniciais já existem. Nenhuma inserção feita.");
    }

    return;
  } catch (err) {
    logger.error("[DB] ERROR:", err.message);
    process.exit(1);
  }
}

setupDatabase().then(() => {
  logger.info("Banco configurado com sucesso!");
  process.exit(0);
}).catch(err => {
  logger.error("Erro ao configurar o banco:", err);
  process.exit(1);
});