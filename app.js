const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "your-secret-key", resave: false, saveUninitialized: true })
);

// In-memory user storage (for demonstration purposes)
const users = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.json({ message: "Username already taken" });
  }

  // Create a new user
  const newUser = { username, password };
  users.push(newUser);
  req.session.user = newUser;
  res.json({ message: "Signup successful" });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = users.find((user) => user.username === username);

  if (!user || user.password !== password) {
    return res.json({ message: "Invalid credentials" });
  }

  req.session.user = user;
  res.json({ message: "Signin successful" });
});

app.get("/signout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
