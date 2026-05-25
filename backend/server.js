const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Server Running");
});


// GET USERS

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


// ADD USER

app.post("/users", (req, res) => {

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


// LOGIN

app.post("/login", (req, res) => {

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


// CREATE EVENT

app.post("/events", (req, res) => {

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


// GET EVENTS

app.get("/events", (req, res) => {

    const sql = "SELECT * FROM events";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            res.send("Error fetching events");
        } else {
            res.send(result);
        }

    });

});


// REGISTER EVENT

app.post("/register-event", (req, res) => {

    const { user_id, event_id } = req.body;

    const sql = `
        INSERT INTO registrations (user_id, event_id)
        VALUES (?, ?)
    `;

    db.query(sql, [user_id, event_id], (err, result) => {

        if (err) {
            console.log(err);
            res.send("Registration failed");
        } else {
            res.send("Event registered successfully");
        }

    });

});


app.listen(5000, () => {
    console.log("Server running on port 5000");
});