const controlPass = require('password-validator');

const passSchema = new controlPass()

passSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = (req, res, next) => {
    if (passSchema.validate(req.body.password)) {
        next()
    } else { 
        return res.status(400).json({message: 'Mot de passe requis : 8 caractères minimun, 100 caractères maximum, Au moins 1 Majuscule, 1 minuscule, 2 chiffres et Sans espaces'})
    }
}
