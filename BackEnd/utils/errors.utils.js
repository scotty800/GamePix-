module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' }

    if (err.message.includes('pseudo'))
        errors.pseudo = "Pseudo doit faire 3 carractères minimum";

    if (err.message.includes('email'))
        errors.email = 'Email incorrect';

    if (err.message.includes('password'))
        errors.password = 'Le mot de passe doit faire 6 caractères minimum'

    if (err.code === 11000) {
        if (err.keyPattern && err.keyPattern.email) {
            errors.email = 'Cet email est déjà enregistré';
        }
        if (err.keyPattern && err.keyPattern.pseudo) {
            errors.pseudo = 'Ce pseudo est déjà pris';
        }
    }

    return errors
}

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: ''}

    if (err.message.includes("email"))
        errors.email = "Email inconnu";
    
    if (err.message.includes("password"))
        errors.password = "Le mot de passe ne correspond pas"

    return errors;
}