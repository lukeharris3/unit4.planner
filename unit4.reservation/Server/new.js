const { Client } = require("pg");
const client = new Client({
  connectionString:
    "postgres://postgres:password@localhost:5434/acme_reservations",
});
client.connect();
const createTables = async () => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS reservations;
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS restaurants;
      
      CREATE TABLE customers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE restaurants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE reservations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL
      );
    `);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};
const createCustomer = async (name) => {
  const result = await client.query(
    "INSERT INTO customers (name) VALUES ($1) RETURNING *",
    [name]
  );
  return result.rows[0];
};
const createRestaurant = async (name) => {
  const result = await client.query(
    "INSERT INTO restaurants (name) VALUES ($1) RETURNING *",
    [name]
  );
  return result.rows[0];
};
const fetchCustomers = async () => {
  const result = await client.query("SELECT * FROM customers");
  return result.rows;
};
const fetchRestaurants = async () => {
  const result = await client.query("SELECT * FROM restaurants");
  return result.rows;
};
const createReservation = async (
  date,
  partyCount,
  restaurantId,
  customerId
) => {
  const result = await client.query(
    "INSERT INTO reservations (date, party_count, restaurant_id, customer_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [date, partyCount, restaurantId, customerId]
  );
  return result.rows[0];
};
const destroyReservation = async (id) => {
  await client.query("DELETE FROM reservations WHERE id = $1", [id]);
};
const fetchReservations = async () => {
  const result = await client.query("SELECT * FROM reservations");
  return result.rows;
};
module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  createReservation,
  destroyReservation,
};