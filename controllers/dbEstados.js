const config = require('../config/config');
const sql = require('mssql');

/*  Hacer la función que hace la llamada http */

async function getEstados() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM SAM.cat_unidades');
        return result.recordset;
        console.log(result);
    } catch (error) {
        console.log('Error ===> ' + error);
    }
}

async function getEstadoId(id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().input("id", sql.Int, id).query('select * from sam.cat_unidades where id = @id');
        console.log(result);
        return result.recordset;

    } catch (error) {
        console.log(`El error de la funcion es ____` + error);
    }
}


module.exports = {
    getEstados: getEstados,
    getEstadoId: getEstadoId,
}