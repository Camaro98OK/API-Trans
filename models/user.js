class User {
    constructor(username, password, nombre, role, u_admin, sede, subsede, cargo) {
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.role = role;
        this.u_admin = u_admin;
        this.sede = sede;
        this.subsede = subsede;
        this.cargo = cargo;
    }
}

module.exports = User;