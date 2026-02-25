const jwt = require('jsonwebtoken');
const secret = 'fullstack_secret_key'; // À déplacer dans .env en production

const verifyToken = (req, res, next) => {
    // Récupérer le header Authorization
    const bearerHeader = req.headers['authorization'];
    
    console.log('Header Authorization:', bearerHeader); // Debug
    
    if (typeof bearerHeader !== 'undefined') {
        // Format: "Bearer <token>"
        const token = bearerHeader.split(' ')[1];
        req.token = token;
        
        // Vérifier la validité du token
        jwt.verify(req.token, secret, (err, decoded) => {
            if (err) {
                console.log('Token invalide:', err.message);
                return res.status(401).json({ 
                    message: 'Token invalide ou expiré' 
                });
            }
            
            // Ajouter les données décodées à la requête
            req.user = decoded.user;
            console.log('Token valide pour:', decoded.user);
            next();
        });
        
    } else {
        // Pas de token fourni
        console.log('Header Authorization manquant');
        res.status(403).json({ 
            message: 'Accès interdit - Token manquant' 
        });
    }
};

module.exports = verifyToken;