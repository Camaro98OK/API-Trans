/* importar el archivo de conexión a la base de datos */
const config = require('../config/dbconfig');

const sql = require('mssql');

/* Hacer la función que hace la llamada http*/

async function getCategoriasUnidad() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query('SELECT * FROM SAM.CAT_SEDES');
        return result.recordset;
    } catch (error) {
        console.log('Error === >  ', error)
    }
}

async function getCategoriasUnidadID(idUnidad) {
    try {
        console.log('ENTRO EN LA  API');
        console.log(idUnidad);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("cve", sql.VarChar, idUnidad.cve)
            .query(`SELECT * 
                    FROM SAM.cat_sedes S2 INNER JOIN SAM.cat_unidades U
                        ON U.id = S2.unidad_id WHERE U.cve = @cve`);
        return result.recordset;
        console.log(result);
    } catch (error) {
        console.log('Error === >  ', error)
    }
}


/* Exportar la función  */

module.exports = {
    getCategoriasUnidad: getCategoriasUnidad,
    getCategoriasUnidadID: getCategoriasUnidadID,
}