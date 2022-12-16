const config = require('../config/config');
const sql = require('mssql');
const { json } = require('body-parser');

/** Hacer la funcion que http a los datos de universo */

async function getCarpetasInvestigacionUni(pCarInvUni) {
    try {
        const pool = await sql.connect(config);
        const carpetaUNI = await pool.request()
            .input("tipo", sql.VarChar, pCarInvUni.tipo)
            .input("edo", sql.VarChar, pCarInvUni.edo)
            .input("unidad", sql.VarChar, pCarInvUni.unidad)
            .input("numCar", sql.VarChar, pCarInvUni.numCar)
            .input("anio", sql.NVarChar, pCarInvUni.anio)
            .query("SELECT U.NumCar, U.FechaCi, U.EdoOri FROM SAM.excel_justicianet_universo U WHERE U.NumCar =  + @tipo + '/' + @edo + '/' +  @unidad + '/' +  @numCar + '/' +  @anio");
        return carpetaUNI.recordset;
    } catch (error) {
        console.log('El error es' + error)
    }
}

module.exports = {
    getCarpetasInvestigacionUni: getCarpetasInvestigacionUni
}