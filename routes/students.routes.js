const router = require("express").Router()

const User = require("../models/User.model")

const { checkLoggedUser, checkRoles, checkPMorOwner } = require('./../middleware')


router.get('/', checkLoggedUser, (req, res) => {

  let errorMessage = req.query.errorMessage

  User
    .find({ role: 'STUDENT' })
    .select('username')
    .then(students => res.render('pages/students/students-list', { students, errorMessage }))
    .catch(err => console.log(err))
})




router.get('/delete/:student_id', checkLoggedUser, checkRoles('PM'), (req, res) => {

  const { student_id } = req.params

  User
    .findByIdAndDelete(student_id)
    .then(() => res.redirect('/students'))
    .catch(err => console.log(err))
})





router.get('/edit/:student_id', checkLoggedUser, checkPMorOwner, (req, res) => {

  const { student_id } = req.params

  User
    .findById(student_id)
    .then(student => res.render('pages/students/edit-student', student))
    .catch(err => console.log(err))
})



router.post('/edit/:student_id', checkLoggedUser, checkRoles('PM'), (req, res) => {

  const { student_id } = req.params
  const { username, profileImg, description } = req.body

  User
    .findByIdAndUpdate(student_id, { username, profileImg, description })
    .then(() => res.redirect('/students'))
    .catch(err => console.log(err))
})




router.get('/assignrole/:student_id/:new_role', checkLoggedUser, checkRoles('PM'), (req, res) => {

  const { student_id, new_role } = req.params

  User
    .findByIdAndUpdate(student_id, { role: new_role })
    .then(() => res.redirect('/students'))
    .catch(err => console.log(err))
})




router.get('/:student_id', checkLoggedUser, (req, res) => {

  const { student_id } = req.params

  const hasPMrole = req.session.currentUser.role === 'PM'
  const isOwner = req.session.currentUser._id === student_id

  User
    .findById(student_id)
    .then(student => {
      student ? res.render('pages/students/profile', { student, hasPMrole, isOwner }) : res.redirect('/students?errorMessage=Alumn@ no encontrado')
    })
    .catch(err => console.log(err))
})





module.exports = router