const sql = require('mssql');
const config = require('../config/config');

async function getOneSede(pUnidad) {
    try {
        //console.log(pUnidad);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("UNIDAD_ID", sql.Int, pUnidad.unidad_id)
            .query('SELECT * FROM SAM.CAT_SEDES WHERE UNIDAD_ID = @UNIDAD_ID')
        return result.recordset;
        //console.log(result);
    } catch (error) {
        console.log('Error al obtener las sedes por estado' + error);
    }
}

async function insSede(pUnidad) {
    try {
        console.log(pUnidad);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("unidad_id", sql.Int, pUnidad.unidad_id)
            .input("cve_sede", sql.VarChar, pUnidad.cve_sede)
            .input("tipo_sede", sql.VarChar, pUnidad.tipo_sede)
            .input("nombre", sql.VarChar, pUnidad.nombre)
            .input("domicilio", sql.VarChar, pUnidad.domicilio)
            .input("telefono", sql.VarChar, pUnidad.telefono)
            .input("email", sql.VarChar, pUnidad.email)
            .input("municipio_id", sql.Int, pUnidad.municipio_id)
            .input("estado_id", sql.Int, pUnidad.estado_id)
            .query(`INSERT INTO SAM.CAT_SEDES (unidad_id, cve_sede, tipo_sede,
                           nombre, domicilio, telefono, email, municipio_id, estado_id)
                           VALUES (@unidad_id, @cve_sede, @tipo_sede, 
                            @nombre, @domicilio, @telefono, @email, @municipio_id, @estado_id)`);
        return result.recordset;
    } catch (error) {
        console.log('Error al insertar sedes ' + error);
    }
}

async function delSedes(pUnidad) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("id", sql.Int, pUnidad.id)
            .query(`DELETE FROM sam.cat_sedes WHERE ID = @id;`);
        return result.recordset;
    } catch (error) {
        console.log('Error al tratar de eliminar una sede. ' + errror);
    }
}

async function updSedes(pUnidad) {
    //console.log('Entro en el armado de la consulta');
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("id", sql.Int, pUnidad.id)
            .input("unidad_id", sql.Int, pUnidad.unidad_id)
            .input("cve_sede", sql.VarChar, pUnidad.cve_sede)
            .input("tipo_sede", sql.VarChar, pUnidad.tipo_sede)
            .input("nombre", sql.VarChar, pUnidad.nombre)
            .input("domicilio", sql.VarChar, pUnidad.domicilio)
            .input("telefono", sql.VarChar, pUnidad.telefono)
            .input("email", sql.VarChar, pUnidad.email)
            .input("municipio_id", sql.Int, pUnidad.municipio_id)
            .input("estado_id", sql.Int, pUnidad.estado_id)
            .query(`UPDATE SAM.CAT_SEDES SET unidad_id = @unidad_id, 
                                        cve_sede = @cve_sede, 
                                        tipo_sede = @tipo_sede, 
                                        nombre = @nombre, 
                                        domicilio = @domicilio, 
                                        telefono = @telefono, 
                                        email = @email, 
                                        municipio_id = @municipio_id, 
                                        estado_id = @estado_id
               WHERE id = @id;`);
        return result.recordset;
    } catch (error) {
        console.log('Error al actualizar una sede ' + error);
    }
}

module.exports = {
    getOneSede: getOneSede,
    insSede: insSede,
    delSedes: delSedes,
    updSedes: updSedes,
}