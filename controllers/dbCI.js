/* Importar las librerias necesrias para la conección con la base de datos */
const { json } = require('body-parser');
const sql = require('mssql');
const config = require('../config/config');

/* Hacer la función para buscar la carpeta de investigación */

async function getCI(pCarInv) {
    try {
        let pool = await sql.connect(config);
        let numCarpeta = await pool.request()
            .input("tipo", sql.VarChar, pCarInv.tipo)
            .input("edo", sql.VarChar, pCarInv.edo)
            .input("unidad", sql.VarChar, pCarInv.unidad)
            .input("numCar", sql.VarChar, pCarInv.numCar)
            .input("anio", sql.NVarChar, pCarInv.anio)
            .query(`SELECT DISTINCT U.expediente, U.oficioSolicitud, U.FechaOficio, 'MM' ORIGEN, U.EstatusSolicitud
                    FROM sam.AIC_COPLADII_PFM_MM U 
                    WHERE U.EXPEDIENTE =  + @tipo + '/' + @edo + '/' +  @unidad + '/' +  @numCar + '/' +  @anio
                    UNION ALL
                    SELECT DISTINCT J.expediente, J.oficioSolicitud, J.FechaHoraRecepcion, 'MJ' ORIGEN, J.EstatusSolicitud
                    FROM sam.AIC_COPLADII_PFM_MJ J 
                    WHERE J.EXPEDIENTE =  + @tipo + '/' + @edo + '/' +  @unidad + '/' +  @numCar + '/' +  @anio
                    --UNION ALL
                    --SELECT DISTINCT C.expediente, C.oficioSolicitud, C.FechaHoraRecepcion, 'CE' ORIGEN, C.EstatusSolicitud
                    --FROM sam.AIC_COPLADII_CENAPI C 
                    --WHERE C.EXPEDIENTE =  + @tipo + '/' + @edo + '/' +  @unidad + '/' +  @numCar + '/' +  @anio
                    UNION ALL
                    SELECT DISTINCT P.expediente, P.oficioSolicitud, P.FechaHoraAsignacionInicial, 'SP' ORIGEN, P.EstatusSolicitud
                    FROM sam.AIC_COPLADII_CGSP P 
                    WHERE P.EXPEDIENTE =  + @tipo + '/' + @edo + '/' +  @unidad + '/' +  @numCar + '/' +  @anio`);
        return numCarpeta.recordset;
        console.log('eroooooooooooooooooooooooooo');
        console.log(numCarpeta);
    } catch (error) {
        console.log("Es error es :" + error);
    }

}

/* Exportamos la funcion */

module.exports = {
    getCI: getCI,
}