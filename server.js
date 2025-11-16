const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos

// Conexão MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cadastro'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL conectado!');
});

// Rota POST para cadastro
app.post('/cadastrar', (req, res) => {
    const { nome, idade, email } = req.body;
    if (!nome || !idade || !email) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const query = 'INSERT INTO usuarios (nome, idade, email) VALUES (?, ?, ?)';
    db.query(query, [nome, idade, email], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ erro: 'Email já cadastrado' });
            }
            return res.status(500).json({ erro: 'Erro ao cadastrar' });
        }
        res.json({ mensagem: 'Usuário cadastrado com sucesso!', id: result.insertId });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});