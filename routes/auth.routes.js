const router = require("express").Router();
const bcrypt = require('bcrypt')

const User = require('./../models/User.model')


// Signup
router.get('/registro', (req, res) => res.render('pages/auth/signup-page'))

router.post('/registro', (req, res) => {

  const { username, pwd, profileImg, description } = req.body

  if (!username.length || !pwd.length || !profileImg.length || !description.length) {
    res.render('pages/auth/signup-page', { errorMessage: 'Rellena todos los campos' })
    return
  }

  if (!pwd.match(/[0-9]/) || pwd.length < 2) {
    res.render('pages/auth/signup-page', { errorMessage: 'La contraseña debe tener un número y mínimo 2 caracteres' })
    return
  }

  User
    .findOne({ username })
    .then(user => {

      if (user) {
        res.render('pages/auth/signup-page', { errorMessage: 'Usuario ya registrado' })
        return
      }

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(pwd, salt)

      User
        .create({ username, password: hashPass, profileImg, description })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
})





// Login
router.get('/inicio-sesion', (req, res) => res.render('pages/auth/login-page'))

router.post('/inicio-sesion', (req, res) => {

  const { username, pwd } = req.body

  User
    .findOne({ username })
    .then(user => {

      if (!user) {
        res.render('pages/auth/login-page', { errorMessage: 'Usuario no reconocido' })
        return
      }

      if (bcrypt.compareSync(pwd, user.password) === false) {
        res.render('pages/auth/login-page', { errorMessage: 'Contraseña incorrecta' })
        return
      }

      req.session.currentUser = user      // Iniciar sesión = almacenar el usuario logueado en req.session.currentUser
      res.redirect('/')
    })
    .catch(err => console.log(err))
})



router.get('/desconectar', (req, res) => req.session.destroy(() => res.redirect('/')))



module.exports = router