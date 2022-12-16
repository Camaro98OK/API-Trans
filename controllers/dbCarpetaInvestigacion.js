//const queries = require('../consultas/queries');

/* Importar el archivo de conexión */
const config = require('../config/dbconfig.js');

/* importar dependencias requeridas*/
const sql = require('mssql');
const carpetaInvestigacion = require('../models/carpetaInvestigacion.js');

/* --------------------------------------------- */
/* ------------- Funciones HTTPS --------------- */
/* --------------------------------------------- */

/* Get all Carpetas de investigacion 2019 */
async function getCarpetasInvestigacion2019() {
    try {
        let pool = await sql.connect(config);
        ///const fechaIni = '2019-01-01 00:00:00';
        //const fechaFin = '2019-12-31 23:59:59';

        let carpetas = await pool.request()
            //.input("fechaIni", sql.Date, fechaIni)
            //.input("fechaFin", sql.Date, fechaFin)
            //.query(queries.getCarpetaInvestigacionSQL)
            .query("EXEC DBO.SPS_UNIVERSO_JUSTICIA '2019-01-01 00:00:00', '2019-01-02 00:00:00'");
        return carpetas.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET ALL Carpetas de investigacion 2020 */
async function getCarpetasInvestigacion2020() {
    try {
        let pool = await sql.connect(config);
        let carpetas = await pool.request().query("EXEC DBO.SPS_UNIVERSO_JUSTICIA '2020-01-01 00:00:00', '2020-12-31 23:59:59'");
        return carpetas.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET ALL Carpetas de investigacion 2021 */
async function getCarpetasInvestigacion2021() {
    try {
        let pool = await sql.connect(config);
        let carpetas = await pool.request().query("EXEC DBO.SPS_UNIVERSO_JUSTICIA '2021-01-01 00:00:00', '2021-12-31 23:59:59'");
        return carpetas.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET ALL Carpetas de investigacion 2022 */
async function getCarpetasInvestigacion2022() {
    try {
        let pool = await sql.connect(config);
        let carpetas = await pool.request().query("EXEC DBO.SPS_UNIVERSO_JUSTICIA '2022-01-01 00:00:00', '2022-12-31 23:59:59'");
        return carpetas.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

module.exports = {
    getCarpetasInvestigacion2019: getCarpetasInvestigacion2019,
    getCarpetasInvestigacion2020: getCarpetasInvestigacion2020,
    getCarpetasInvestigacion2021: getCarpetasInvestigacion2021,
    getCarpetasInvestigacion2022: getCarpetasInvestigacion2022
}