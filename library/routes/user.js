const express = require('express')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy
const User = require("../schemas/user-schema")

const SECRET = process.env.SECRET || "SECRET"

const verify = async (username, password, done) => {
  try {
    const user = await User.findOne({ login: username });

    if (!user) {
      return done(null, false, { message: 'Неверное имя пользователя' });
    }

    const isMatch = user.password === password

    if (!isMatch) {
      return done(null, false, { message: 'Неверный пароль' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

const options = {
  usernameField: "username",
  passwordField: "password",
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
})

const router = express.Router();

router.use(session({ secret: SECRET }));

router.use(passport.initialize())
router.use(passport.session())
router.use(flash());


router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/api/user/login',
    successRedirect: '/api/user/me',
    failureFlash: false
  }),
)

router.post('/signup',
  async (req, res) => {
    const { username, password } = req.body;

    try {
      let user = await User.findOne({ login: username });

      if (user) {
        req.flash('error_msg', 'Пользователь с таким логином уже существует');
        return res.redirect('/api/user/signup');
      }

      user = new User({
        login: username,
        password
      });

      await user.save();

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/api/user/me');
      });

    } catch (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
    }
  })

router.get('/me',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('api/user/login')
    }
    next()
  },
  (req, res) => {
    res.render('me', { user: req.user })
  }
)

module.exports = {
  userRouter: router,
};
