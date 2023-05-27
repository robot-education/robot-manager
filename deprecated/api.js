let authentication = require('./auth.js');

class ElementPath {
    constructor(documentPath, elementId) {
        this.documentPath = documentPath;
        this.elementId = elementId;
    }

    get path() {
        return this.documentPath.path + "/w/" + this.workspaceId;
    }
}

class DocumentPath {
    constructor(documentId, workspaceId) {
        this.documentId = documentId;
        this.workspaceId = workspaceId;
    }

    get path() {
        return "/d/" + this.documentId + "/w/" + this.workspaceId;
    }
}

class Request {
    constructor() {

    }

}

function getTargetUrl() {
    return "";
}

function callApi() {
    return new Promise((resolve, reject) => {
        method({
            uri: targetUrl,
            json: true,
            body: req.body,
            headers: {

            }
        }

        )
    });
}

function callApi(req, res, endpoint, method, nosend = false) {
    var targetUrl = apiUrl + endpoint;
    return new Promise((resolve, reject) => {
        method({
            uri: targetUrl,
            json: true,
            body: req.body,
            headers: {
                'Authorization': 'Bearer ' + req.user.accessToken
            }
        }).catch((data) => {
            console.log("CATCH " + data.statusCode);
            if (data.statusCode === 401) {
                authentication.refreshOAuthToken(req, res).then(() => {
                    makeAPICall(req, res, endpoint, method, nosend).then(data => resolve(data)).catch(data => reject(data));
                }).catch((err) => {
                    console.log('Error refreshing token: ', err);
                    reject();
                });
            } else {
                console.log('Error: ', data.statusCode);
                reject(data);
            }
        }).then((data) => {
            if (!nosend) {
                res.send(data);
            }
            resolve(data);
        });
    });
}