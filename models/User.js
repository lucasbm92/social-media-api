class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Add any additional methods or properties here

    // Example method to get user's full name
    getFullName() {
        return this.name;
    }
}

module.exports = User;