const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');
const verifyToken = require('./middleware/verifyToken');

const app = express();
const PORT = 5000;
const secret = 'fullstack_secret_key';

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Données simulées (base de données temporaire)
let members = [
    { id: 1, name: "Amal Amal", email: "amal@example.com" },
    { id: 2, name: "Ali Ali", email: "ali@example.com" },
    { id: 3, name: "Ahmed Ahmed", email: "ahmed@example.com" }
];

// ============================================
// ROUTES PUBLIQUES
// ============================================

// Route d'accueil
app.get('/', (req, res) => {
    res.json({
        message: "API Members Sécurisée avec JWT",
        endpoints: {
            login: "POST /api/login (publique)",
            members: "GET /api/members (protégée)"
        }
    });
});
// GET BY ID - Récupérer un membre spécifique
app.get('/api/members/:id', verifyToken, (req, res) => {
    const id = parseInt(req.params.id);
    const member = members.find(m => m.id === id);
    
    if (!member) {
        return res.status(404).json({ 
            message: `Membre avec l'ID ${id} non trouvé` 
        });
    }
    
    res.json({
        status: 'success',
        member: member
    });
});

// POST - Ajouter un membre
app.post('/api/members', verifyToken, (req, res) => {
    const { id, name, email } = req.body;
    
    if (!id || !name || !email) {
        return res.status(400).json({ 
            message: "ID, nom et email sont requis" 
        });
    }
    
    const existingMember = members.find(m => m.id === parseInt(id));
    if (existingMember) {
        return res.status(400).json({ 
            message: `Un membre avec l'ID ${id} existe déjà` 
        });
    }
    
    const newMember = { 
        id: parseInt(id), 
        name, 
        email 
    };
    
    members.push(newMember);
    
    res.status(201).json({
        status: 'success',
        message: 'Membre ajouté avec succès',
        member: newMember
    });
});

// PUT - Modifier un membre
app.put('/api/members/:id', verifyToken, (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    
    const memberIndex = members.findIndex(m => m.id === id);
    
    if (memberIndex === -1) {
        return res.status(404).json({ 
            message: `Membre avec l'ID ${id} non trouvé` 
        });
    }
    
    members[memberIndex] = {
        ...members[memberIndex],
        name: name || members[memberIndex].name,
        email: email || members[memberIndex].email
    };
    
    res.json({
        status: 'success',
        message: 'Membre modifié avec succès',
        member: members[memberIndex]
    });
});
// Route de connexion (publique)
app.post('/api/login', (req, res) => {
    console.log('Tentative de connexion:', req.body);
    
    const { id, username, password } = req.body;
    
    // Vérification des identifiants (simulée)
    if (id == 1 && username === 'fullstack' && password === '123456') {
        
        // Créer l'objet utilisateur
        const user = { 
            id: 1, 
            username: 'fullstack',
            role: 'admin'
        };
        
        // Générer le token JWT (expire dans 1 heure)
        const token = jwt.sign(
            { user }, 
            secret, 
            { expiresIn: '1h' }
        );
        
        console.log('Connexion réussie, token généré');
        
        res.json({ 
            message: 'Connexion réussie',
            token,
            user
        });
        
    } else {
        console.log('Échec de connexion: identifiants invalides');
        res.status(401).json({ 
            message: 'Identifiants invalides !' 
        });
    }
});

// ============================================
// ROUTES PROTÉGÉES (nécessitent un token valide)
// ============================================

// Récupérer tous les membres (protégée)
app.get('/api/members', verifyToken, (req, res) => {
    console.log('Accès aux membres autorisé pour:', req.user);
    
    res.json({
        status: 'success',
        user: req.user,
        members: members,
        count: members.length
    });
});

// Récupérer un membre par ID (protégée)
app.get('/api/members/:id', verifyToken, (req, res) => {
    const id = parseInt(req.params.id);
    const member = members.find(m => m.id === id);
    
    if (!member) {
        return res.status(404).json({ 
            message: `Membre avec l'ID ${id} non trouvé` 
        });
    }
    
    res.json({
        status: 'success',
        member: member
    });
});

// Ajouter un membre (protégée)
app.post('/api/members', verifyToken, (req, res) => {
    const { id, name, email } = req.body;
    
    if (!id || !name || !email) {
        return res.status(400).json({ 
            message: "ID, nom et email sont requis" 
        });
    }
    
    // Vérifier si l'ID existe déjà
    const existingMember = members.find(m => m.id === parseInt(id));
    if (existingMember) {
        return res.status(400).json({ 
            message: `Un membre avec l'ID ${id} existe déjà` 
        });
    }
    
    const newMember = { id: parseInt(id), name, email };
    members.push(newMember);
    
    res.status(201).json({
        status: 'success',
        message: 'Membre ajouté avec succès',
        member: newMember
    });
});

// Modifier un membre (protégée)
app.put('/api/members/:id', verifyToken, (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    
    const memberIndex = members.findIndex(m => m.id === id);
    
    if (memberIndex === -1) {
        return res.status(404).json({ 
            message: `Membre avec l'ID ${id} non trouvé` 
        });
    }
    
    members[memberIndex] = {
        ...members[memberIndex],
        name: name || members[memberIndex].name,
        email: email || members[memberIndex].email
    };
    
    res.json({
        status: 'success',
        message: 'Membre modifié avec succès',
        member: members[memberIndex]
    });
});

// Supprimer un membre (protégée)
app.delete('/api/members/:id', verifyToken, (req, res) => {
    const id = parseInt(req.params.id);
    const memberIndex = members.findIndex(m => m.id === id);
    
    if (memberIndex === -1) {
        return res.status(404).json({ 
            message: `Membre avec l'ID ${id} non trouvé` 
        });
    }
    
    const deletedMember = members.splice(memberIndex, 1)[0];
    
    res.json({
        status: 'success',
        message: 'Membre supprimé avec succès',
        member: deletedMember
    });
});

// Route protégée pour tester le token
app.get('/api/verify', verifyToken, (req, res) => {
    res.json({
        message: 'Token valide',
        user: req.user
    });
});

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée" });
});

module.exports = app;