const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Validate Function to check e-mail length
let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    } else {
        if (email.length < 5 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
}

// Validate Function to check if valid e-mail format
let validEmailChecker = (email) => {
    // Check if e-mail exists
    if (!email) {
        return false; // Return error
    } else {
        // Regular expression to test for a valid e-mail
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email); // Return regular expression test results (true or false)
    }
};
// Array of Email Validators
const emailValidators = [
    {
        validator: emailLengthChecker,
        message: 'Email must be atleast 5 characters but not more than 30'
    },
    {
        validator: validEmailChecker,
        message: 'Must be a valid e-mail'
    }
]

// Validate Function to check username length
let usernameLengthChecker = (username) => {
    // Check if username exists
    if (!username) {
        return false; // Return error
    } else {
        // Check length of username string
        if (username.length < 3 || username.length > 15) {
            return false; // Return error if does not meet length requirement
        } else {
            return true; // Return as valid username
        }
    }
};

// Validate Function to check if valid username format
let validUsername = (username) => {
    // Check if username exists
    if (!username) {
        return false; // Return error
    } else {
        // Regular expression to test if username format is valid
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username); // Return regular expression test result (true or false)
    }
};

// Array of Username validators
const usernameValidators = [
    // First Username validator
    {
        validator: usernameLengthChecker,
        message: 'Username must be at least 3 characters but no more than 15'
    },
    // Second username validator
    {
        validator: validUsername,
        message: 'Username must not have any special characters'
    }
];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
    // Check if password exists
    if (!password) {
        return false; // Return error
    } else {
        // Check password length
        if (password.length < 5 || password.length > 35) {
            return false; // Return error if passord length requirement is not met
        } else {
            return true; // Return password as valid
        }
    }
};

// Validate Function to check if valid password format
let validPassword = (password) => {
    // Check if password exists
    if (!password) {
        return false; // Return error
    } else {
        // Regular Expression to test if password is valid format
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{5,35}$/);
        return regExp.test(password); // Return regular expression test result (true or false)
    }
};

// Array of Password validators
const passwordValidators = [
    // First password validator
    {
        validator: passwordLengthChecker,
        message: 'Password must be at least 5 characters but no more than 35'
    },
    // Second password validator
    {
        validator: validPassword,
        message: 'Must have at least one uppercase, lowercase, special character, and number'
    }
];

// User Model Definition
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators }
});

// Schema Middleware to Encrypt Password
userSchema.pre('save', function (next) {
    // Ensure password is new or modified before applying encryption
    if (!this.isModified('password')) {
        return next();
    }
    // Apply encryption
    bcrypt.hash(this.password, saltRounds, (err, hash) => {
        if (err) return next(err); // Ensure no errors
        this.password = hash; // Apply encryption to password
        next();  // Exit middleware
    });
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
};

module.exports = mongoose.model('User', userSchema);