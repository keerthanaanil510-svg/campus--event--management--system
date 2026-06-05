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

            res.json({
            message: "Login successful",
            user_id: result[0].user_id,
            role: result[0].role
            });

        }

        else {
            res.send("Invalid email or password");
        }

    });

});


// CREATE EVENT

app.post("/events", (req, res) => {

    const { role } = req.body;

    if (role !== "admin") {
        return res.send("Access denied. Admin only.");
}

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


app.get("/my-registrations/:user_id", (req, res) => {

    const user_id = req.params.user_id;

    const sql = `
        SELECT events.*
        FROM registrations
        JOIN events ON registrations.event_id = events.id
        WHERE registrations.user_id = ?
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {
            console.log(err);
            res.send("Error fetching registrations");
        } else {
            res.send(result);
        }

    });

});
app.delete("/events/:id", (req, res) => {

    const { role } = req.body;

    if (role !== "admin") {
        return res.send("Access denied. Admin only.");
}

    const id = req.params.id;

    const deleteRegistrations =
        "DELETE FROM registrations WHERE event_id = ?";

    db.query(deleteRegistrations, [id], (err) => {

        if (err) {
            console.log(err);
            return res.send("Error deleting registrations");
        }

        const deleteEvent =
            "DELETE FROM events WHERE id = ?";

        db.query(deleteEvent, [id], (err) => {

            if (err) {
                console.log(err);
                res.send("Error deleting event");
            } else {
                res.send("Event deleted successfully");
            }

        });

    });

});

app.put("/events/:id", (req, res) => {

    const { role } = req.body;

    if (role !== "admin") {
        return res.send("Access denied. Admin only.");
}

    const id = req.params.id;

    const {
        event_name,
        description,
        event_date,
        venue,
        organizer
    } = req.body;

    const sql = `
        UPDATE events
        SET
            event_name = ?,
            description = ?,
            event_date = ?,
            venue = ?,
            organizer = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [event_name, description, event_date, venue, organizer, id],
        (err, result) => {

            if (err) {
                console.log(err);
                res.send("Error updating event");
            } else {
                res.send("Event updated successfully");
            }

        }
    );

});




app.listen(5000, () => {

    console.log("Server running on port 5000");

});