/* Importar archivo de conexion  */
const config = require("../config/dbconfig.js");

/* Importar paquete mssql */
const sql = require("mssql");
const user = require("../models/user.js");

/* --------------------------------------------- */
/* ------------- Funciones HTTPS --------------- */
/* --------------------------------------------- */

/* Get allUsers */
async function getUsers() {
    try {
        let pool = await sql.connect(config);
        let users = await pool.request().query("SELECT * FROM sam.users");
        return users.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Get userByID */
async function getUserId(userId) {
    try {
        let pool = await sql.connect(config);
        let user = await pool
            .request()
            .input("userId", sql.Int, userId)
            .query("SELECT * FROM sam.users WHERE id= @userId");
        return user.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* POST user */
async function insertUser(user) {
    try {
        let pool = await sql.connect(config);
        let insertUser = await pool
            .request()
            .input("username", sql.VarChar, user.username)
            .input("password", sql.VarChar, user.password)
            .input("nombre", sql.VarChar, user.nombre)
            .input("role", sql.VarChar, user.role)
            .input("u_admin", sql.VarChar, user.u_admin)
            .input("sede", sql.VarChar, user.sede)
            .input("subsede", sql.VarChar, user.subsede)
            .input("cargo", sql.VarChar, user.cargo)
            .query(
                `INSERT INTO sam.users (username, password, nombre, role, u_admin, sede, subsede, cargo) VALUES (@username, 'Usytem@Reveco.fgr.org', @nombre, 'user', @u_admin, 'CDMX', 'I20', 'MP')`
            );
        return insertUser.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* UPDATE User */
async function updateUser(user) {
    try {
        let pool = await sql.connect(config);
        let updateUser = await pool
            .request()
            .input("id", sql.Int, user.id)
            .input("username", sql.VarChar, user.username)
            .input("password", sql.VarChar, user.password)
            .input("nombre", sql.VarChar, user.nombre)
            .input("role", sql.VarChar, user.role)
            .input("u_admin", sql.VarChar, user.u_admin)
            .input("sede", sql.VarChar, user.sede)
            .input("subsede", sql.VarChar, user.subsede)
            .input("cargo", sql.VarChar, user.cargo)
            .query("UPDATE sam.users SET username= @username, password= @password, nombre= @nombre, role= @role, u_admin= @u_admin, sede= @sede, subsede= @subsede, cargo= @cargo, modifyAt= getdate() WHERE id= @Id ");
        return updateUser.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* DELETE user */
async function deleteUser(userId) {
    try {
        let pool = await sql.connect(config);
        let deleteUser = await pool
            .request()
            .input("userId", sql.Int, userId)
            .query("DELETE FROM sam.users WHERE id= @userId");
        return deleteUser.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* POST Login */
async function loginUser(user) {
    try {
        let pool = await sql.connect(config);
        let userLogin = await pool
            .request().input("username", sql.VarChar, user.username)
            .input("password", sql.VarChar, user.password)
            .query("SELECT username, password, role FROM sam.users WHERE username= @username AND password= @password"
                /* , (error, rows, fields) => {
                                if (!error) {
                                    console.log("aqui");
                                    console.log(rows);
                                    let dataUser = JSON.stringify(rows);
                                    const token = jwt.sign(dataUser, '@FgR@c0M@0rG@mX-Si3R!');
                                    console.log(token);
                                } else {
                                    console.log(error);
                                }
                            } */
            );
        return userLogin.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

module.exports = {
    getUsers: getUsers,
    getUserId: getUserId,
    insertUser: insertUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    loginUser: loginUser
};