const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const EmployeeModel = require('./models/Employee');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb://127.0.0.1:27017/employee")

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await EmployeeModel.findOne({ email: email });

        if (user) {
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                res.json("Success");
            } else {
                res.json("The passwords do not match");
            }
        } else {
            res.json("No record existed");
        }
    } catch (err) {
        res.status(500).json({ error: 'Error during login', details: err.message });
    }
});


app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt factor of 10
        const newUser = {
            name: name,
            email: email,
            password: hashedPassword, // Store the hashed password in the database
        };
        const employee = await EmployeeModel.create(newUser);
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: 'Error creating employee', details: err.message });
    }
});



app.listen(3001, () => {
    console.log("server listening on")
});