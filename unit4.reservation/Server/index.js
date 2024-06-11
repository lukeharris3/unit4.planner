const express = require("express");
const bodyParser = require("body-parser");
const {
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  createReservation,
  destroyReservation,
} = require("./new");

const app = express();
const port = 3000;

app.use(bodyParser.json());
const init = async () => {
  await createTables();
};
init();
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await fetchCustomers();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/restaurants", async (req, res) => {
  try {
    const restaurants = await fetchRestaurants();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await fetchReservations();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/customers/:id/reservations", async (req, res) => {
  try {
    const { date, party_count, restaurant_id } = req.body;
    const customer_id = req.params.id;
    const reservation = await createReservation(
      date,
      party_count,
      restaurant_id,
      customer_id
    );
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/customers/:customer_id/reservations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await destroyReservation(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});