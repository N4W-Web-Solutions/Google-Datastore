"use strict"

module.exports = (options) => {
    return {
        projectId: options.projectId || undefined,
        keyFilename: options.keyFilename || undefined
    }
}
