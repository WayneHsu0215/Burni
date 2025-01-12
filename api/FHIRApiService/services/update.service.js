const _ = require("lodash");
const mongoose = require("mongoose");


const { renameCollectionFieldName } = require("../../apiService");
const {
    issue,
    OperationOutcome,
    handleError
} = require("@models/FHIR/httpMessage");
const { BaseFhirApiService } = require("./base.service");

const { logger } = require("@root/utils/log");
const { urlJoin } = require("@root/utils/url");

class UpdateService extends BaseFhirApiService {
    constructor(req, res, resourceType) {
        super(req, res, resourceType);
        this.resourceId = this.request.params.id;
    }

    async update() {
        try {
            let resource = this.request.body;
            let resourceClone = _.cloneDeep(resource);

            let validation = await BaseFhirApiService.validateRequestResource(resource);
            if (!validation.status) return validation;

            return await UpdateService.insertOrUpdateResource(this.resourceType, resourceClone, this.resourceId);

        } catch (e) {
            logger.error(`[Error: ${JSON.stringify(e)}] [Resource Type: ${this.resourceType}]`);
            return {
                status: false,
                code: 500,
                result: e
            };
        }
    }

    doSuccessResponse(resource) {
        let reqBaseUrl = `${this.request.protocol}://${this.request.get("host")}/`;
        let fullAbsoluteUrl = urlJoin(this.request.originalUrl, reqBaseUrl);
        this.response.set("Location", fullAbsoluteUrl);

        this.response.append("Last-Modified", new Date().toUTCString());
        return this.doResponse(resource.code, resource.result);
    }

    doFailureResponse(err, code) {
        this.doResourceChangeFailureResponse(err, code);
    }

    static async insertOrUpdateResource(resourceType, resource, id, session = undefined) {
        let docExist = await UpdateService.isDocExist(resourceType, id);
        if (docExist.status === 1) {
            return await UpdateService.updateResource(resourceType, id, resource, session);
        } else if (docExist.status === 2) {
            return await UpdateService.insertResourceWithId(resourceType, id, resource, session);
        }
    }

    static async updateResource(resourceType, id, resource, session = undefined) {
        delete resource.id;
        renameCollectionFieldName(resource);
        resource.id = id;

        let newDoc = await mongoose.model(resourceType).findOneAndUpdate(
            {
                id: id
            },
            {
                $set: resource
            },
            {
                new: true,
                rawResult: true,
                session: session
            }
        );

        return {
            status: true,
            code: 200,
            result: newDoc.value.getFHIRField()
        };
    }

    static async insertResourceWithId(resourceType, id, resource, session = undefined) {
        resource.id = id;
        renameCollectionFieldName(resource);
        let resourceInstance = new mongoose.model(resourceType)(resource);
        let doc = await resourceInstance.save({ session });
        return {
            status: true,
            code: 201,
            result: doc.getFHIRField()
        };
    }

    static async isDocExist(resourceType, id) {
        let count = await mongoose.model(resourceType).countDocuments({
            id: id
        }).limit(1);

        if (count > 0) {
            // Exists
            return {
                status: 1,
                error: ""
            };
        }

        // Not exists
        return {
            status: 2,
            error: ""
        };
    }
}

module.exports.UpdateService = UpdateService;