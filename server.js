const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const connection = require('./database');  // Import the database connection
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating and verifying tokens
const multer = require('multer'); // Import multer for file uploads
const path = require('path'); // Import path for handling file paths
const fs = require('fs'); // Import fs for file system operations

const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret key

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Utility function to handle duplicate email errors
function handleDuplicateEmailError(res) {
    return res.status(400).send({ error: 'Email already exists' });
}

// Middleware to check if an email already exists
async function checkEmailExists(email) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id FROM Users WHERE email = ?';
        connection.query(query, [email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.length > 0);
        });
    });
}

// Utility function for pagination
function paginate(query, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    return `${query} LIMIT ${limit} OFFSET ${offset}`;
}

// Utility function to generate a JWT token
function generateToken(user) {
    return jwt.sign({ userId: user.id, uuid: user.uuid, role: user.role, role_id: user.role_id }, JWT_SECRET, { expiresIn: '1h' });
}

// Middleware to authenticate and authorize users
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({
            status: 'error',
            message: 'Authorization token is required',
            data: null
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send({
                status: 'error',
                message: 'Invalid token',
                data: null
            });
        }
        req.user = user;
        next();
    });
}

// API to create an activity_owner account
app.post('/api/activity_owner', async (req, res) => {
    const { name, email, password, ice, manager_name, phone_number } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Name, email, and password are required');
    }

    try {
        // Check if email already exists
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return handleDuplicateEmailError(res);
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO Users (name, email, password, role, ice, manager_name, phone_number)
            VALUES (?, ?, ?, 'activity_owner', ?, ?, ?)
        `;
        const values = [name, email, hashedPassword, ice, manager_name, phone_number];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error creating account');
            }
            res.status(201).send({ message: 'Activity owner account created', userId: result.insertId });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// API to create an admin account
app.post('/api/admin', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Name, email, and password are required');
    }

    try {
        // Check if email already exists
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return handleDuplicateEmailError(res);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO Users (name, email, password, role)
            VALUES (?, ?, ?, 'admin')
        `;
        const values = [name, email, hashedPassword];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error creating account');
            }
            res.status(201).send({ message: 'Admin account created', userId: result.insertId });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// API to create a client account
app.post('/api/client', async (req, res) => {
    const { nom, prenom, numero_telephone, email, mot_de_passe } = req.body;

    if (!nom || !prenom || !numero_telephone || !email || !mot_de_passe) {
        return res.status(400).send('Nom, prenom, numero_telephone, email, and mot_de_passe are required');
    }

    try {
        // Check if email already exists
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return handleDuplicateEmailError(res);
        }

        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        const name = nom + ' ' + prenom;

        const query = `
            INSERT INTO Users (name, nom, prenom, phone_number, email, password, role)
            VALUES (?, ?, ?, ?, ?, ?, 'client')
        `;
        const values = [name, nom, prenom, numero_telephone, email, hashedPassword];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error creating account');
            }
            res.status(201).send({ message: 'Client account created', userId: result.insertId });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// API to create a user account
app.post('/api/users', async (req, res) => {
    const {
        last_name, first_name, email, telephone, role_id, password, repeat_password, professional
    } = req.body;

    if (!last_name || !first_name || !email || !telephone || !role_id || !password || !repeat_password) {
        return res.status(400).send({
            status: 'error',
            message: 'All required fields must be filled',
            data: null
        });
    }

    if (password !== repeat_password) {
        return res.status(400).send({
            status: 'error',
            message: 'Passwords do not match',
            data: null
        });
    }

    try {
        // Check if email already exists
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return handleDuplicateEmailError(res);
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO Users (last_name, first_name, email, telephone, role_id, password)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [last_name, first_name, email, telephone, role_id, hashedPassword];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error creating account',
                    data: null
                });
            }

            const userId = result.insertId;

            if (professional) {
                const professionalQuery = `
                    INSERT INTO Professionals (user_id, company_name, ice, company_address)
                    VALUES (?, ?, ?, ?)
                `;
                const professionalValues = [
                    userId, professional.company_name, professional.ice, professional.company_address
                ];

                connection.query(professionalQuery, professionalValues, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error creating professional information',
                            data: null
                        });
                    }

                    res.status(201).send({
                        status: 'success',
                        message: 'User and professional account created successfully',
                        data: { userId }
                    });
                });
            } else {
                res.status(201).send({
                    status: 'success',
                    message: 'User account created successfully',
                    data: { userId }
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to update user information
app.put('/api/users/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { uuid, last_name, first_name, telephone, email, password, repeat_password } = req.body;

    if (!uuid) {
        return res.status(400).send({
            status: 'error',
            message: 'UUID is required',
            data: null
        });
    }

    if (password && password !== repeat_password) {
        return res.status(400).send({
            status: 'error',
            message: 'Passwords do not match',
            data: null
        });
    }

    try {
        const query = 'SELECT * FROM Users WHERE id = ? AND uuid = ?';
        connection.query(query, [user_id, uuid], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Server error',
                    data: null
                });
            }

            if (results.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid user ID or UUID',
                    data: null
                });
            }

            const user = results[0];
            const updatedFields = {};

            if (last_name) updatedFields.last_name = last_name;
            if (first_name) updatedFields.first_name = first_name;
            if (telephone) updatedFields.telephone = telephone;
            if (email) updatedFields.email = email;
            if (password) updatedFields.password = await bcrypt.hash(password, 10);

            const updateQuery = 'UPDATE Users SET ? WHERE id = ?';
            connection.query(updateQuery, [updatedFields, user_id], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error updating user information',
                        data: null
                    });
                }

                res.status(200).send({
                    status: 'success',
                    message: 'User information updated successfully',
                    data: { id: user_id }
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({
            status: 'error',
            message: 'Email and password are required',
            data: null
        });
    }

    try {
        const query = `
            SELECT Users.*, Roles.name AS role 
            FROM Users 
            JOIN Roles ON Users.role_id = Roles.role_id 
            WHERE email = ?
        `;
        connection.query(query, [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Server error',
                    data: null
                });
            }

            if (results.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid email or password',
                    data: null
                });
            }

            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid email or password',
                    data: null
                });
            }

            const token = generateToken(user);
            const tokenValidity = 3600; // 1 hour in seconds

            // Fetch professional information if the user is a professional
            const professionalQuery = 'SELECT * FROM Professionals WHERE user_id = ?';
            connection.query(professionalQuery, [user.id], (err, professionalResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        status: 'error',
                        message: 'Server error',
                        data: null
                    });
                }

                const professionalInfo = professionalResults[0] || null;
                res.status(200).send({
                    status: 'success',
                    message: 'Login successful',
                    data: {
                        token,
                        id: user.id,
                        last_name: user.last_name,
                        first_name: user.first_name,
                        telephone: user.telephone,
                        email: user.email,
                        role_id: user.role_id,
                        role: user.role,
                        lost_password: user.lostpassword,
                        refresh_token: user.refresh_token,
                        created_at: user.created_at,
                        full_name: `${user.first_name} ${user.last_name}`,
                        professionalInfo
                    }
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to handle lost password request
app.post('/api/lost-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({
            status: 'error',
            message: 'Email is required',
            data: null
        });
    }

    try {
        const query = 'SELECT * FROM Users WHERE email = ?';
        connection.query(query, [email], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Server error',
                    data: null
                });
            }

            if (results.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Email not found',
                    data: null
                });
            }

            // Here you would typically generate a password reset token and send an email
            // For simplicity, we'll just return a success message

            res.status(200).send({
                status: 'success',
                message: 'Password reset instructions sent to email',
                data: null
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to handle reset password request
app.post('/api/reset-password', async (req, res) => {
    const { user_id, password_token, new_password, new_repeatpassword } = req.body;

    if (!user_id || !password_token || !new_password || !new_repeatpassword) {
        return res.status(400).send({
            status: 'error',
            message: 'All fields are required',
            data: null
        });
    }

    if (new_password !== new_repeatpassword) {
        return res.status(400).send({
            status: 'error',
            message: 'Passwords do not match',
            data: null
        });
    }

    try {
        const query = 'SELECT * FROM Users WHERE id = ? AND password_token = ?';
        connection.query(query, [user_id, password_token], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Server error',
                    data: null
                });
            }

            if (results.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid token or user ID',
                    data: null
                });
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);
            const updateQuery = 'UPDATE Users SET password = ?, password_token = NULL WHERE id = ?';
            connection.query(updateQuery, [hashedPassword, user_id], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error updating password',
                        data: null
                    });
                }

                res.status(200).send({
                    status: 'success',
                    message: 'Password reset successfully',
                    data: null
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to handle account activation
app.get('/api/account-activation/:userId/:activationToken', async (req, res) => {
    const { userId, activationToken } = req.params;

    try {
        const query = 'SELECT * FROM Users WHERE id = ? AND activation_token = ?';
        connection.query(query, [userId, activationToken], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Server error',
                    data: null
                });
            }

            if (results.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid activation token or user ID',
                    data: null
                });
            }

            const updateQuery = 'UPDATE Users SET is_active = 1, activation_token = NULL WHERE id = ?';
            connection.query(updateQuery, [userId], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error activating account',
                        data: null
                    });
                }

                res.status(200).send({
                    status: 'success',
                    message: 'Account activated successfully',
                    data: null
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// Endpoint to get users with pagination
app.get('/api/users', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const countQuery = 'SELECT COUNT(*) AS total FROM Users';
        connection.query(countQuery, (err, countResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving user count from database');
            }

            const totalItems = countResults[0].total;
            const totalPages = Math.ceil(totalItems / limit);

            const query = paginate('SELECT * FROM Users', { page, limit });
            connection.query(query, async (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error retrieving users from database');
                }

                // Fetch professional information if the user is a professional
                const users = await Promise.all(results.map(async user => {
                    if (user.role === 'professional') {
                        return new Promise((resolve, reject) => {
                            const professionalQuery = 'SELECT * FROM Professionals WHERE user_id = ?';
                            connection.query(professionalQuery, [user.id], (err, professionalResults) => {
                                if (err) {
                                    return reject(err);
                                }
                                user.professionalInfo = professionalResults[0];
                                resolve(user);
                            });
                        });
                    }
                    return user;
                }));

                res.json({
                    status: 'success',
                    message: 'Users retrieved successfully',
                    data: {
                        total_items: totalItems,
                        limit: parseInt(limit, 10),
                        total_page: totalPages,
                        current_page: parseInt(page, 10),
                        next_page: page < totalPages ? parseInt(page, 10) + 1 : null,
                        previous_page: page > 1 ? parseInt(page, 10) - 1 : null,
                        users
                    }
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// API to get user details by ID, including their activities and activity hours
app.get('/api/users/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch user details
        const userQuery = 'SELECT * FROM Users WHERE id = ?';
        connection.query(userQuery, [userId], (err, userResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error retrieving user details',
                    data: null
                });
            }

            if (userResults.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'User not found',
                    data: null
                });
            }

            const user = userResults[0];

            // Fetch user's activities
            const activitiesQuery = 'SELECT * FROM activities WHERE owner_id = ?';
            connection.query(activitiesQuery, [userId], async (err, activitiesResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error retrieving user activities',
                        data: null
                    });
                }

                // Fetch activity hours and images for each activity
                const activitiesWithDetails = await Promise.all(activitiesResults.map(async (activity) => {
                    return new Promise((resolve, reject) => {
                        const hoursQuery = 'SELECT * FROM activity_hours WHERE activity_id = ?';
                        const imagesQuery = 'SELECT * FROM activity_images WHERE activity_id = ?';

                        connection.query(hoursQuery, [activity.activity_id], (err, hoursResults) => {
                            if (err) {
                                return reject(err);
                            }
                            activity.hours = hoursResults;

                            connection.query(imagesQuery, [activity.activity_id], (err, imagesResults) => {
                                if (err) {
                                    return reject(err);
                                }
                                activity.images = imagesResults;
                                resolve(activity);
                            });
                        });
                    });
                }));

                res.status(200).send({
                    status: 'success',
                    message: 'User details retrieved successfully',
                    data: {
                        user,
                        activities: activitiesWithDetails
                    }
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to delete a user account
app.delete('/v1/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send({
            status: 'error',
            message: 'Authorization token is required',
            data: null
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).send({
                status: 'error',
                message: 'Invalid token',
                data: null
            });
        }

        const query = 'DELETE FROM Users WHERE id = ?';
        connection.query(query, [userId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error deleting user',
                    data: null
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'User not found',
                    data: null
                });
            }

            res.status(200).send({
                status: 'success',
                message: 'User deleted successfully',
                data: null
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to upload an image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({
            status: 'error',
            message: 'No file uploaded',
            data: null
        });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).send({
        status: 'success',
        message: 'File uploaded successfully',
        data: { imageUrl }
    });
});

// Utility function to generate a slug from a string
function generateSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

// API to create a category with image upload
app.post('/api/categories', upload.single('image'), async (req, res) => {
    const { name, description, image_url } = req.body;

    if (!name || (!req.file && !image_url)) {
        return res.status(400).send({
            status: 'error',
            message: 'Name and either image or image URL are required',
            data: null
        });
    }

    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : image_url;
    const slug = generateSlug(name);

    try {
        const query = `
            INSERT INTO Categories (name, description, image_url, slug)
            VALUES (?, ?, ?, ?)
        `;
        const values = [name, description, imageUrl, slug];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error creating category',
                    data: null
                });
            }
            res.status(201).send({
                status: 'success',
                message: 'Category created successfully',
                data: { categoryId: result.insertId }
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const query = 'SELECT * FROM Categories';
        connection.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error retrieving categories',
                    data: null
                });
            }
            res.status(200).send({
                status: 'success',
                message: 'Categories retrieved successfully',
                data: results
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to create a city with image upload
app.post('/api/cities', upload.single('image'), async (req, res) => {
    const { name, image_url,  region } = req.body;

    if (!name || (!req.file && !image_url)) {
        return res.status(400).send({
            status: 'error',
            message: 'Name and either image or image URL are required',
            data: null
        });
    }

    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : image_url;
    const citySlug = generateSlug(name);

    try {
        const query = `
            INSERT INTO Cities (name, slug, image_url,  region)
            VALUES (?, ?, ?, ?)
        `;
        const values = [name, citySlug, imageUrl, region];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error creating city',
                    data: null
                });
            }
            res.status(201).send({
                status: 'success',
                message: 'City created successfully',
                data: { cityId: result.insertId }
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to get all cities
app.get('/api/cities', async (req, res) => {
    try {
        const query = 'SELECT * FROM Cities';
        connection.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error retrieving cities',
                    data: null
                });
            }
            res.status(200).send({
                status: 'success',
                message: 'Cities retrieved successfully',
                data: results
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to create an activity
app.post('/api/activities', authenticateToken, upload.single('logo'), async (req, res) => {
    const { name, description, city_id, category_id, address, capacity } = req.body;
    const user_id = req.user.userId;

    console.log("req.user:", req.user.role_id == 4); // Log the entire req.user object

    if (!req.user  || req.user.role_id != 4) {
        return res.status(403).send({
            status: 'error',
            message: 'Only users with role_id 4 can create activities',
            data: null
        });
    }

    if (!name || !description || !city_id || !category_id || !address || !capacity || !req.file) {
        return res.status(400).send({
            status: 'error',
            message: 'All fields are required',
            data: null
        });
    }

    const logoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    try {
        const query = `
            INSERT INTO activities (name, description, city_id, category_id, address, capacity, logo, owner_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [name, description, city_id, category_id, address, capacity, logoUrl, user_id];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error creating activity',
                    data: null
                });
            }
            res.status(201).send({
                status: 'success',
                message: 'Activity created successfully',
                data: { activityId: result.insertId }
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to update an activity
app.put('/api/activities/:activity_id', authenticateToken, upload.single('logo'), async (req, res) => {
    const { activity_id } = req.params;
    const { name, description, city_id, category_id, address, capacity } = req.body;
    const user_id = req.user.userId;

    console.log("req.user:", req.user.role_id == 4); // Log the entire req.user object

    if (!req.user || req.user.role_id != 4) {
        return res.status(403).send({
            status: 'error',
            message: 'Only users with role_id 4 can update activities',
            data: null
        });
    }

    if (!name || !description || !city_id || !category_id || !address || !capacity) {
        return res.status(400).send({
            status: 'error',
            message: 'All fields are required',
            data: null
        });
    }

    const logoUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    try {
        const query = `
            UPDATE activities 
            SET name = ?, description = ?, city_id = ?, category_id = ?, address = ?, capacity = ?, logo = ?
            WHERE activity_id = ? AND owner_id = ?
        `;
        const values = [name, description, city_id, category_id, address, capacity, logoUrl, activity_id, user_id];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error updating activity',
                    data: null
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Activity not found or you do not have permission to update it',
                    data: null
                });
            }

            res.status(200).send({
                status: 'success',
                message: 'Activity updated successfully',
                data: { activityId: activity_id }
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to create or update activity hours
app.post('/api/activity_hours', authenticateToken, async (req, res) => {
    const { activity_id, day_of_week, opening_time, closing_time, is_closed } = req.body;

    if (!activity_id || !day_of_week || !opening_time || !closing_time || is_closed === undefined) {
        return res.status(400).send({
            status: 'error',
            message: 'All fields are required',
            data: null
        });
    }

    try {
        const selectQuery = `
            SELECT id FROM activity_hours WHERE activity_id = ? AND day_of_week = ?
        `;
        const selectValues = [activity_id, day_of_week];

        connection.query(selectQuery, selectValues, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error checking existing activity hours',
                    data: null
                });
            }

            if (results.length > 0) {
                // Update existing activity hours
                const updateQuery = `
                    UPDATE activity_hours 
                    SET opening_time = ?, closing_time = ?, is_closed = ?
                    WHERE id = ?
                `;
                const updateValues = [opening_time, closing_time, is_closed, results[0].id];

                connection.query(updateQuery, updateValues, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error updating activity hours',
                            data: null
                        });
                    }
                    res.status(200).send({
                        status: 'success',
                        message: 'Activity hours updated successfully',
                        data: { id: results[0].id }
                    });
                });
            } else {
                // Insert new activity hours
                const insertQuery = `
                    INSERT INTO activity_hours (activity_id, day_of_week, opening_time, closing_time, is_closed)
                    VALUES (?, ?, ?, ?, ?)
                `;
                const insertValues = [activity_id, day_of_week, opening_time, closing_time, is_closed];

                connection.query(insertQuery, insertValues, (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error creating activity hours',
                            data: null
                        });
                    }
                    res.status(201).send({
                        status: 'success',
                        message: 'Activity hours created successfully',
                        data: { id: result.insertId }
                    });
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to update activity hours
app.put('/api/activity_hours/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { opening_time, closing_time, is_closed } = req.body;

    if (!opening_time || !closing_time || is_closed === undefined) {
        return res.status(400).send({
            status: 'error',
            message: 'All fields are required',
            data: null
        });
    }

    try {
        const query = `
            UPDATE activity_hours 
            SET opening_time = ?, closing_time = ?, is_closed = ?
            WHERE id = ?
        `;
        const values = [opening_time, closing_time, is_closed, id];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error updating activity hours',
                    data: null
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Activity hours not found',
                    data: null
                });
            }

            res.status(200).send({
                status: 'success',
                message: 'Activity hours updated successfully',
                data: { id }
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to upload activity images
app.post('/api/activity_images', authenticateToken, upload.array('images', 10), async (req, res) => {
    const { activity_id } = req.body;

    if (!activity_id || !req.files || req.files.length === 0) {
        return res.status(400).send({
            status: 'error',
            message: 'Activity ID and images are required',
            data: null
        });
    }

    try {
        const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
        const values = imageUrls.map(url => [activity_id, url]);

        const query = `
            INSERT INTO activity_images (activity_id, image_url)
            VALUES ?
        `;

        connection.query(query, [values], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error uploading activity images',
                    data: null
                });
            }

            // Get the inserted image IDs
            const imageIdsQuery = 'SELECT image_id FROM activity_images WHERE activity_id = ? AND image_url IN (?)';
            connection.query(imageIdsQuery, [activity_id, imageUrls], (err, imageIdsResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error retrieving image IDs',
                        data: null
                    });
                }

                const imageIds = imageIdsResult.map(row => row.image_id);
                res.status(201).send({
                    status: 'success',
                    message: 'Activity images uploaded successfully',
                    data: { imageUrls, imageIds }
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// API to delete an activity image
app.delete('/api/activity_images/:image_id', authenticateToken, async (req, res) => {
    const { image_id } = req.params;

    try {
        const query = 'SELECT image_url FROM activity_images WHERE image_id = ?'; // Correct column name
        connection.query(query, [image_id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error retrieving image',
                    data: null
                });
            }

            if (results.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Image not found',
                    data: null
                });
            }

            const imageUrl = results[0].image_url;
            const filePath = path.join(__dirname, 'uploads', path.basename(imageUrl));

            // Delete the image file from the server
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error deleting image file',
                        data: null
                    });
                }

                // Delete the image record from the database
                const deleteQuery = 'DELETE FROM activity_images WHERE image_id = ?'; // Correct column name
                connection.query(deleteQuery, [image_id], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error deleting image record',
                            data: null
                        });
                    }

                    res.status(200).send({
                        status: 'success',
                        message: 'Image deleted successfully',
                        data: null
                    });
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
