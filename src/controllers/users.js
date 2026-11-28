import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { 
    createUser, 
    findUserByEmail, 
    getAllUsers,
    authenticateUser 
} from '../models/users.js';

// Validation rules for user registration
const registrationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name must be 100 characters or less'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Validation rules for user login
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

/**
 * Display registration form
 */
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

/**
 * Process registration form submission
 */
const processUserRegistrationForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg);
            });
            return res.redirect('/register');
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            req.flash('error', 'An account with that email address already exists.');
            return res.redirect('/register');
        }

        // Hash the password with bcrypt (10 salt rounds)
        const passwordHash = await bcrypt.hash(password, 10);

        // Create the user in the database
        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (err) {
        next(err);
    }
};

/**
 * Display login form
 */
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

/**
 * Process login form submission
 */
const processLoginForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg);
            });
            return res.redirect('/login');
        }

        const { email, password } = req.body;
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Store user in session
        req.session.user = user;
        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/dashboard');
    } catch (err) {
        next(err);
    }
};

/**
 * Process user logout
 */
const processLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session during logout:', err);
        }
        res.redirect('/login');
    });
};

/**
 * Display user dashboard (protected route)
 */
const showDashboard = (req, res) => {
    res.render('dashboard', { 
        title: 'Dashboard',
        user: req.session.user 
    });
};

/**
 * Display all registered users (admin only)
 */
const showUsersPage = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.render('users', { 
            title: 'Registered Users',
            users 
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Middleware to require authenticated user
 */
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to view that page.');
        return res.redirect('/login');
    }
    next();
};

/**
 * Middleware factory to require a specific role
 * @param {string} role 
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to view that page.');
            return res.redirect('/login');
        }
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You are not authorized to view that page.');
            return res.redirect('/dashboard');
        }
        next();
    };
};

export {
    registrationValidation,
    loginValidation,
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    showDashboard,
    showUsersPage,
    requireLogin,
    requireRole
};
