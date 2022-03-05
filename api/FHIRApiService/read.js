const mongodb = require('models/mongodb');
const {
    handleError
} = require('../../models/FHIR/httpMessage');
const FHIR = require('fhir').Fhir;
const user = require('../APIservices/user.service');
const { logger } = require('../../utils/log');
const path = require('path');
const PWD_FILENAME = path.relative(process.cwd(), __filename);

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {String} resourceType 
 * @returns 
 */
module.exports = async function (req , res , resourceType) {
    logger.info(`[Info: do create] [Resource Type: ${resourceType}] [From-File: ${PWD_FILENAME}] [Content-Type: ${res.getHeader("content-type")}]`);
    let doRes = function (code, item) {
        if (res.getHeader("content-type").includes("xml")) {
            let fhir = new FHIR();
            let xmlItem = fhir.objToXml(item);
            return res.status(code).send(xmlItem);
        }
        return res.status(code).send(item);
    };
    if (!await user.checkTokenPermission(req, resourceType, "read")) {
        logger.warn(`[Warn: Request token doesn't have permission with this API] [From-File: ${PWD_FILENAME}] [From-IP: ${req.socket.remoteAddress}]`);
        return doRes(403,handleError.forbidden("Your token doesn't have permission with this API"));
    }
    let id = req.params.id;
    try {
        let docs = await mongodb[resourceType].findOne({
            id: id
        }).exec();
        if (docs) {
            let responseDoc = docs.getFHIRField();
            res.header('Last-Modified', new Date(responseDoc.meta.lastUpdated).toUTCString());
            return doRes(200, responseDoc);
        }
        let errorMessage = `not found ${resourceType}/${id}`;
        logger.warn(`[Warn: ${errorMessage}] [Resource-Type: ${resourceType}]`);
        let operationOutcomeError = handleError.exception(errorMessage);
        return doRes(404, operationOutcomeError);
    } catch (e) {
        let errorStr = JSON.stringify(e, Object.getOwnPropertyNames(e));
        logger.error(`[Error: ${errorStr}] [Resource Type: ${resourceType}] [From-File: ${PWD_FILENAME}]`);
        let operationOutcomeError = handleError.exception(e);
        return doRes(500, operationOutcomeError);
    }
};