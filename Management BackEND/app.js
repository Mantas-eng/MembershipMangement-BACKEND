import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { Service } from './collections/services.mjs';
import { User } from './collections/users.mjs';
const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://mantaskreivys7:Songokas*012@cluster0.9req1py.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

const Membership = mongoose.model('Membership', {
    name: String,
    description: String

});

app.enable('trust proxy'); // Tai leis Express.js gauti tikrą vartotojo IP, jei jis naudoja priekinį uždegimą (proxy serverį)


app.use((req, res, next) => {
    const userIp = req.header('x-forwarded-for') || req.connection.remoteAddress; // Gauti vartotojo IP adresą
    console.log(`Vartotojo IP adresas: ${userIp}`);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('Membership Management'));
app.use(cors());
app.use(morgan('dev'));
// GET visų paslaugų maršrutas
app.get('/memberships', async (req, res) => {
    try {
        const memberships = await Membership.find();
        res.json(memberships);
    } catch (error) {
        console.error(error);
        res.status(500).send('Klaida gavimo metu');
    }
});

// POST naujos paslaugos pridėjimo maršrutas
app.post('/memberships', async (req, res) => {
    try {
        const { name, description } = req.body;
        const membership = new Membership({ name, description });
        await membership.save();
        res.status(200).json(membership);
    } catch (error) {
        console.error(error);
        res.status(500).send('Klaida pridėjimo metu');
    }
});
app.get('/api/memberships', async (req, res) => {
    try {
        const memberships = await Membership.find();
        res.json({ memberships });
    } catch (error) {
        res.status(500).json({ error: 'Nepavyko gauti narystių sąrašo.' });
    }
});

// Narystės kūrimas
app.post('/api/memberships', async (req, res) => {
    try {
        const { name, description } = req.body;
        const membership = new Membership({ name, description });
        await membership.save();
        res.json({ message: 'Narystė sėkmingai sukurta.' });
    } catch (error) {
        res.status(500).json({ error: 'Nepavyko sukurti narystės.' });
    }
});
// DELETE paslaugos ištrynimo maršrutas pagal ID
app.delete('/memberships/:id', async (req, res) => {
    const membershipId = req.params.id;

    try {
        const deletedMembership = await Membership.findByIdAndDelete(membershipId);
        if (deletedMembership) {
            res.status(200).send('Narystė sėkmingai ištrinta');
        } else {
            res.status(404).send('Narystė nerasta');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Klaida trinant narystę');
    }
});

// GET vartotojų pagal tvarką maršrutas
app.get('/users/:order', async (req, res) => {
    const order = req.params.order;
    try {
        const users = await User.find().sort(order);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Klaida gavimo metu');
    }
});
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Nepavyko gauti vartotojų sąrašo.' });
    }
});
// POST naujo vartotojo registracijos maršrutas
// Serverio pusė
app.post('/api/users', async (req, res) => {
    try {
        const { firstName, lastName, email, membershipPlan, IP } = req.body;
        // Gauti IP adresą iš kliento pusės
        const userIP = req.ip; // Gauti vartotojo IP
        const newUser = new User({ firstName, lastName, email, membershipPlan, IP: userIP }); // Pridėti IP į naujo vartotojo objektą
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (error) {
        console.error('Klaida registracijos metu:', error);
        res.status(500).json({ error: 'Klaida registracijos metu' });
    }
});



app.listen(port, () => {
    console.log(`Serveris veikia portu ${port}`);
});
