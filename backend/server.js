const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Server Running");
});

app.get("/users", (req, res) => {

    const sql = "SELECT * FROM users";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            res.send("Error fetching users");
        } else {
            res.send(result);
        }

    });

});

app.post("/users", (req, res) => {

    console.log(req.body);

    const { full_name, email, password, role } = req.body;

    const sql = `
        INSERT INTO users(full_name, email, password, role)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [full_name, email, password, role],
        (err, result) => {

            if (err) {
                console.log(err);
                res.send("Error adding user");
            } else {
                res.send("User added successfully");
            }

        }
    );

});

app.post("/login", (req, res) => {

    console.log(req.body);

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM users
        WHERE email = ? AND password = ?
    `;

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            console.log(err);
            res.send("Login error");
        }

        else if (result.length > 0) {
            res.send("Login successful");
        }

        else {
            res.send("Invalid email or password");
        }

    });

});

app.post("/events", (req, res) => {

    console.log(req.body);

    const {
        event_name,
        description,
        event_date,
        venue,
        organizer
    } = req.body;

    const sql = `
        INSERT INTO events
        (event_name, description, event_date, venue, organizer)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [event_name, description, event_date, venue, organizer],
        (err, result) => {

            if (err) {
                console.log(err);
                res.send("Error creating event");
            } else {
                res.send("Event created successfully");
            }

        }
    );

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});