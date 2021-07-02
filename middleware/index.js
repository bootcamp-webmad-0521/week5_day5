module.exports = {
    checkLoggedUser: (req, res, next) => {
        req.session.currentUser ? next() : res.render('pages/auth/login-page', { errorMessage: 'Inicia sesión para continuar' })
    },
    checkRoles: (...rolesToCheck) => (req, res, next) => {
        rolesToCheck.includes(req.session.currentUser.role) ? next() : res.render('pages/auth/login-page', { errorMessage: 'No dispones de privilegios suficientes' })
    },
    checkPMorOwner: (req, res, next) => {
        const isPM = req.session.currentUser.role === 'PM'
        const isOwner = req.session.currentUser._id === req.params.student_id

        isPM || isOwner ? next() : res.render('pages/auth/login-page', { errorMessage: 'No dispones de privilegios suficientes' })
    }
}