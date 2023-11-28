import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import cors from 'cors'

const app = express();
// Hay que asignarle un puerto diferente a cada cosa
const port = 5000;
// El servicio de Authenticacion se corre en el puerto 5000
// no el puerto de la base de datos es el puerto en el que va a correr el servicio
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api', (req, res) =>{
    res.json({
        message:'express y jwt'
    })
})


app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Verifica que los campos name, email y password no estén vacíos
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Por favor, proporcione nombre, correo electrónico y contraseña.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'viernesdb'
    });

    try {
        const [results] = await connection.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.json({ message: 'Registro de usuario exitoso'});
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.sendStatus(500);
    } finally {
        await connection.end();
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'viernesdb'
    });

    try {
        const [results] = await connection.execute('SELECT name, email, password FROM users WHERE email = ?', [email]);
        if (results.length === 0) {
            res.sendStatus(401);
        } else {
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const token = jwt.sign({ user }, 'secretkey', { expiresIn: '120s' });
                res.cookie('jwtToken', token, { httpOnly: true });
                res.json({ message: 'Inicio de sesión exitoso', email: user.email});
            } else {
                res.sendStatus(401);
            }
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.sendStatus(500);
    } finally {
        await connection.end();
    }
});

app.post('/api/protected', verifytoken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if (error) {
            res.sendStatus(403);
        } else {
            res.json({
                message: "Ruta protegida"
            });
        }
    });
});

function verifytoken(req, res, next) {
    const token = req.cookies.jwtToken;

    if (token) {
        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(port, () => {
    console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
