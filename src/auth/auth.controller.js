const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

async function register(req, res) {
  try {
    const { name, login, password } = req.body;

    if (!name || !login || !password) {
      return res.status(400).json({
        success: false,
        message: 'name, login va password kiritilishi shart',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
      });
    }

    const existing = await User.findOne({ login: login.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Bu login allaqachon band',
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name: name.trim(),
      login: login.toLowerCase().trim(),
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id, login: user.login },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Ro\'yxatdan o\'tdingiz',
      data: {
        user: {
          id: user._id,
          name: user.name,
          login: user.login,
        },
        token,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
    });
  }
}

async function login(req, res) {
  try {
    const { login, password } = req.body;
    console.log("login", login);
    console.log("password", password);
    
    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: 'login va password kiritilishi shart',
      });
    }

    const user = await User.findOne({ login: login.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Login yoki parol noto\'g\'ri',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Login yoki parol noto\'g\'ri',
      });
    }

    const token = jwt.sign(
      { userId: user._id, login: user.login },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Kirish muvaffaqiyatli',
      data: {
        user: {
          id: user._id,
          name: user.name,
          login: user.login,
        },
        token,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
    });
  }
}

module.exports = {
  register,
  login,
};
