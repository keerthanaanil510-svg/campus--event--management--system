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

app.listen(5000, () => {
    console.log("Server running on port 5000");
});