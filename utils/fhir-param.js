let parameterList = require('../api_generator/currentSupportParameters.json');

/**
 * @example
 * findParamType("Patient", "name");
 * @param {string} resourceType 
 * @param {string} paramName 
 * @returns 
 */
function findParamType(resourceType, paramName) {
    let resourceParameters = parameterList[resourceType];
    let theParam = resourceParameters.find(v => v.parameter === paramName);
    if (!theParam) return null;
    return theParam.type;
}


module.exports.findParamType = findParamType;