define('static/user/user', [], function(require, exports, module) {
    class User {
        constructor(name = '', email = '') {
            this.name = name;
            this.email = email;
        }

        update() {

        }

        remove() {}
    }

    module.exports = User;
});