const sql = require('mssql');
const config = require('../config/config');

async function getOneRetrasos(numCarRetrasos) {
    try {
        console.log('Entro en la consulta de atrasos one');
        console.log(numCarRetrasos);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("tipo", sql.VarChar, numCarRetrasos.tipo)
            .input("edo", sql.VarChar, numCarRetrasos.edo)
            .input("unidad", sql.VarChar, numCarRetrasos.unidad)
            .input("numCar", sql.VarChar, numCarRetrasos.numCar)
            .input("anio", sql.NVarChar, numCarRetrasos.anio)
            .input("oficio", sql.VarChar, numCarRetrasos.oficio)
            .query(`SELECT  F.cve FISCALIA_ID,
                                    DE.DELEGACION_DSC DELEGACION_DSC,
                                    A.CARPETA,
                                    CONVERT(DATE,A.FEC_INI_CI) FEC_INI_CI,
                                    A.OFICIO_SOL,
                                    CONVERT(DATE,A.FEC_OFI_SOL) FEC_OFI_SOL,
                                    U.UNIDAD_DSC,
                                    X.ACTO_DSC,
                                    A.TIEMPO_EJECUCION,
                                    CASE WHEN A.ATENCION = 1 THEN 'SI' ELSE 'NO' END ATENCION,
                                    A.ATENCION_DSC,
                                    CASE WHEN A.RECORDATORIO  = 1 THEN 'SI' ELSE 'NO' END RECORDATORIO,
                                    A.OFICIO_REC,
                                    A.FEC_REC,
                                    A.OBSERVACIONES
                            FROM SAM.ATRASOS A 
                            INNER JOIN SAM.CAT_FISCALIA_DELEGACION D ON A.FISCALIA_ID = D.FISCALIA_ID AND A.DELEGACION_ID = D.DELEGACION_ID
                            INNER JOIN SAM.CAT_FISCALIA				F ON A.FISCALIA_ID = F.id 
                            INNER JOIN SAM.CAT_DELEGACION_FGR		DE ON A.DELEGACION_ID = DE.ID
                            INNER JOIN SAM.CAT_UNIDAD_CMI			U  ON A.AREA_CMI =U.ID
                            INNER JOIN (SELECT AC.ID, AC.ACTO_DSC, 1 AREA_CMI_ID FROM SAM.CAT_ACTO_INVESTIGACION_CMI AC
                                        UNION ALL 
                                        SELECT A.ID, A.ESPECIALIDAD, 2 AREA_CMI_ID FROM SAM.CAT_ESPECIALIDAD_CMI A
                                        UNION ALL
                                        SELECT AC.ID, AC.ACTO_DSC, 3 AREA_CMI_ID FROM SAM.CAT_ACTO_INVESTIGACION_CMI AC
                                        UNION ALL
                                        SELECT AC.ID, AC.ACTO_DSC, 4 AREA_CMI_ID FROM SAM.CAT_ACTO_INVESTIGACION_CMI AC) X ON A.AREA_CMI = X.AREA_CMI_ID AND A.ACTO_PRODUCTO_ID = X.ID
                            WHERE A.CARPETA =  @tipo + '/' + @edo + '/' +  @unidad + '/' +  @numCar + '/' +  @anio
                             AND TRIM(A.OFICIO_SOL) = TRIM(@oficio)
                    `);
        return result.recordset;
    } catch (error) {
        console.log('Error en atrasos al obtener los datos una carpeta : numCarRetrasos ' + error);

    }
}

async function getRetrasos() {
    try {
        let pool = await sql.connect(config);
        let resSelect = await pool.request().query(`SELECT  F.cve FISCALIA_ID,
                                                        DE.DELEGACION_DSC DELEGACION_DSC,
                                                        A.CARPETA,
                                                        CONVERT(DATE,A.FEC_INI_CI) FEC_INI_CI,
                                                        A.OFICIO_SOL,
                                                        CONVERT(DATE,A.FEC_OFI_SOL) FEC_OFI_SOL,
                                                        U.UNIDAD_DSC,
                                                        X.ACTO_DSC,
                                                        A.TIEMPO_EJECUCION,
                                                        CASE WHEN A.ATENCION = 1 THEN 'SI' ELSE 'NO' END ATENCION,
                                                        A.ATENCION_DSC,
                                                        CASE WHEN A.RECORDATORIO  = 1 THEN 'SI' ELSE 'NO' END RECORDATORIO,
                                                        A.OFICIO_REC,
                                                        A.FEC_REC,
                                                        A.OBSERVACIONES
        FROM SAM.ATRASOS A 
        INNER JOIN SAM.CAT_FISCALIA_DELEGACION D ON A.FISCALIA_ID = D.FISCALIA_ID AND A.DELEGACION_ID = D.DELEGACION_ID
        INNER JOIN SAM.CAT_FISCALIA				F ON A.FISCALIA_ID = F.id 
        INNER JOIN SAM.CAT_DELEGACION_FGR		DE ON A.DELEGACION_ID = DE.ID
        INNER JOIN SAM.CAT_UNIDAD_CMI			U  ON A.AREA_CMI =U.ID
        INNER JOIN (SELECT AC.ID, AC.ACTO_DSC, 1 AREA_CMI_ID FROM SAM.CAT_ACTO_INVESTIGACION_CMI AC
        			UNION ALL 
        			SELECT A.ID, A.ESPECIALIDAD, 2 AREA_CMI_ID FROM SAM.CAT_ESPECIALIDAD_CMI A
        			UNION ALL
        			SELECT AC.ID, AC.ACTO_DSC, 3 AREA_CMI_ID FROM SAM.CAT_ACTO_INVESTIGACION_CMI AC
        			UNION ALL
        			SELECT AC.ID, AC.ACTO_DSC, 4 AREA_CMI_ID FROM SAM.CAT_ACTO_INVESTIGACION_CMI AC) X ON A.AREA_CMI = X.AREA_CMI_ID AND A.ACTO_PRODUCTO_ID = X.ID
        `);
        return resSelect.recordset;
    } catch (error) {
        console.log('Error al obtener todos los registros de retrasos.');
    }
}

/*
 */

async function insertRetrasos(retrasos) {
    try {
        let pool = await sql.connect(config);
        let resInsert = await pool.request()
            .input("FISCALIA_ID", sql.Int, retrasos.fiscalia)
            .input("DELEGACION_ID", sql.Int, retrasos.delegacion)
            .input("CARPETA", sql.VarChar, retrasos.num_car)
            .input("FEC_INI_CI", sql.Date, retrasos.fec_ini)
            .input("OFICIO_SOL", sql.VarChar, retrasos.oficio_solicitud)
            .input("FEC_OFI_SOL", sql.Date, retrasos.fec_acu_ofi)
            .input("AREA_CMI", sql.Int, retrasos.area_aic)
            .input("ACTO_PRODUCTO_ID", sql.Int, retrasos.solicitud)
            .input("TIEMPO_EJECUCION", sql.VarChar, retrasos.tiempo_ejecucion)
            .input("ATENCION", sql.Int, retrasos.estatus_atencion)
            .input("ATENCION_DSC", sql.VarChar, retrasos.atencion_dsc)
            .input("RECORDATORIO", sql.Int, retrasos.ofi_recordatorio)
            .input("OFICIO_REC", sql.VarChar, retrasos.oficio_recordatorio)
            .input("FEC_REC", sql.Date, retrasos.fec_ofi_rec)
            .input("OBSERVACIONES", sql.VarChar, retrasos.observaciones)
            .query(`INSERT INTO SAM.ATRASOS (FISCALIA_ID, DELEGACION_ID, CARPETA,  FEC_INI_CI, 
                                                OFICIO_SOL,  FEC_OFI_SOL,   AREA_CMI, ACTO_PRODUCTO_ID, 
                                                TIEMPO_EJECUCION, ATENCION, ATENCION_DSC, RECORDATORIO, 
                                                OFICIO_REC, FEC_REC, OBSERVACIONES)
                                    VALUES (@FISCALIA_ID, @DELEGACION_ID, @CARPETA,  @FEC_INI_CI, 
                                            @OFICIO_SOL,  @FEC_OFI_SOL,   @AREA_CMI, @ACTO_PRODUCTO_ID, 
                                            @TIEMPO_EJECUCION, @ATENCION, @ATENCION_DSC, @RECORDATORIO, 
                                            @OFICIO_REC, @FEC_REC, @OBSERVACIONES);`);
        return resInsert.recordset;
        console.log('Insert retrasos ');
    } catch (error) {
        console.log('Error al insertar el retraso.');
    }
}

async function delRetrasos(retrasos) {
    try {
        console.log(retrasos);
        const pool = await sql.connect(config);
        const result = await pool.request().
        input("CARPETA", sql.VarChar, retrasos.num_car).
        input("AREA_CMI", sql.Int, retrasos.area_aic).
        input("ACTO_PRODUCTO", sql.Int, retrasos.solicitud).
        input("OFICIO_SOL", sql.VarChar, retrasos.oficio_solicitud).
        input("OFICIO_REC", sql.VarChar, retrasos.oficio_recordatorio).
        query(`DELETE
                FROM SAM.ATRASOS
                WHERE CARPETA = @CARPETA
                AND AREA_CMI = @AREA_CMI
                AND ACTO_PRODUCTO_ID = @ACTO_PRODUCTO
                AND OFICIO_SOL = @OFICIO_SOL
                AND OFICIO_REC = @OFICIO_REC`);
        return result.recordset;
        console.log(result.recordset);
    } catch (error) {
        console.log('Error al borrar el registro de retrasos' + error);
    }
}

async function updateRetrasos(retrasos) {
    try {
        console.log(retrasos)
        let pool = await sql.connect(config);
        let resUpdate = await pool.request()
            .input("FISCALIA_ID", sql.Int, retrasos.fiscalia)
            .input("DELEGACION_ID", sql.Int, retrasos.delegacion)
            .input("CARPETA", sql.VarChar, retrasos.num_car)
            .input("FEC_INI_CI", sql.Date, retrasos.fec_ini)
            .input("OFICIO_SOL", sql.VarChar, retrasos.oficio_solicitud)
            .input("FEC_OFI_SOL", sql.Date, retrasos.fec_acu_ofi)
            .input("AREA_CMI", sql.Int, retrasos.area_aic)
            .input("ACTO_PRODUCTO_ID", sql.Int, retrasos.solicitud)
            .input("TIEMPO_EJECUCION", sql.VarChar, retrasos.tiempo_ejecucion)
            .input("ATENCION", sql.Int, retrasos.estatus_atencion)
            .input("ATENCION_DSC", sql.VarChar, retrasos.atencion_dsc)
            .input("RECORDATORIO", sql.Int, retrasos.ofi_recordatorio)
            .input("OFICIO_REC", sql.VarChar, retrasos.oficio_recordatorio)
            .input("FEC_REC", sql.Date, retrasos.fec_ofi_rec)
            .input("OBSERVACIONES", sql.VarChar, retrasos.observaciones)
            .query(`UPDATE SAM.ATRASOS 
                                    SET FEC_INI_CI = @FEC_INI_CI, 
                                        OFICIO_SOL = @OFICIO_SOL,  
                                        FEC_OFI_SOL = @FEC_OFI_SOL,   
                                        AREA_CMI = @AREA_CMI, 
                                        ACTO_PRODUCTO_ID = @ACTO_PRODUCTO_ID, 
                                        TIEMPO_EJECUCION = @TIEMPO_EJECUCION,
                                        ATENCION = @ATENCION,
                                        ATENCION_DSC = @ATENCION_DSC,
                                        RECORDATORIO = @RECORDATORIO,
                                        OFICIO_REC = @OFICIO_REC, 
                                        FEC_REC = @FEC_REC,  
                                        OBSERVACIONES = @OBSERVACIONES
                                WHERE FISCALIA_ID = @FISCALIA_ID 
                                AND CARPETA = @CARPETA
                                AND DELEGACION_ID = @DELEGACION_ID
                                AND AREA_CMI = @AREA_CMI 
                                AND ACTO_PRODUCTO_ID = @ACTO_PRODUCTO_ID
                                AND OFICIO_SOL = @OFICIO_SOL;`);
        return resUpdate.recordset;
        console.log('UPDATE retrasos ');
    } catch (error) {
        console.log('Error en la actualización de retrasos ' + error);
    }
}

module.exports = {
    insertRetrasos: insertRetrasos,
    getRetrasos: getRetrasos,
    delRetrasos: delRetrasos,
    updateRetrasos: updateRetrasos,
    getOneRetrasos: getOneRetrasos,
}