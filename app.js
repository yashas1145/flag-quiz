import express from "express";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    database: "world",
    host: "localhost",
    password: "kjm40329",
    port: 5432,
});

const app = express();
const port = 3000;

let flags;
let score = 0;

db.connect();

db.query("SELECT * FROM flags", (err, res) => {
    if (err) {
        console.error("Error fetching data from database");
    } else {
        flags = res.rows;
    }
    db.end();
});

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    let randomId = getRandomNumber();
    const data = {
        "flag": flags[randomId],
        "score": score,
    };
    console.log(data);
    res.render("index.ejs", data);
});

app.post("/submit", (req, res) => {
    let country = req.body.country;
    let flagCountry = req.body.flagCountry;

    console.log(country, flagCountry);

    if(flagCountry == country) {
        score += 1;
        res.redirect("/");
    } else {
        res.render("index.ejs", {"gameOver": true, "score": score});
        score = 0;
    }
});

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server listening on port ${port}`);
});

function getRandomNumber() {
    return Math.floor(Math.random()*flags.length);
}