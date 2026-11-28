import db from './db.js';
import bcrypt from 'bcrypt';

/**
 * Creates a new user with standard 'user' role
 * @param {string} name 
 * @param {string} email 
 * @param {string} passwordHash 
 * @returns {Promise<object>} The newly created user (without password hash)
 */
const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO public.users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM public.roles WHERE role_name = 'user'))
        RETURNING user_id, name, email, role_id, created_at;
    `;
    const queryParams = [name, email, passwordHash];
    const result = await db.query(query, queryParams);
    return result.rows[0];
};

/**
 * Finds a user by email, joining the roles table
 * @param {string} email 
 * @returns {Promise<object|null>} User object including password_hash and role_name
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, u.role_id, r.role_name, u.created_at
        FROM public.users u
        JOIN public.roles r ON u.role_id = r.role_id
        WHERE u.email = $1;
    `;
    const queryParams = [email];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Finds a user by ID, joining the roles table (excluding password hash)
 * @param {number} userId 
 * @returns {Promise<object|null>} Safe user object
 */
const findUserById = async (userId) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.role_id, r.role_name, u.created_at
        FROM public.users u
        JOIN public.roles r ON u.role_id = r.role_id
        WHERE u.user_id = $1;
    `;
    const queryParams = [userId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Compares plaintext password against bcrypt hash
 * @param {string} password 
 * @param {string} passwordHash 
 * @returns {Promise<boolean>}
 */
const verifyPassword = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
};

/**
 * Authenticates user credentials and returns safe user data
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object|null>} Safe user object (without password hash) if valid, otherwise null
 */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return null;
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
        return null;
    }

    // Exclude password_hash before returning
    const { password_hash, ...safeUser } = user;
    return safeUser;
};

/**
 * Retrieves all registered users with their roles (excluding password hashes)
 * @returns {Promise<Array>} Array of safe user objects
 */
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name, u.created_at
        FROM public.users u
        JOIN public.roles r ON u.role_id = r.role_id
        ORDER BY u.name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

export {
    createUser,
    findUserByEmail,
    findUserById,
    getAllUsers,
    verifyPassword,
    authenticateUser
};
