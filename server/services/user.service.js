const userModel = require('../models/user.model');


module.exports.createUser = async ({firstname, lastname, email, phone, password}) => {
    if(!firstname || !email || !phone || !password) {
        throw new Error('All fields are required');
    }
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        phone,
        password
    });
    return user;
}
