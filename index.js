"use strict";

class GCPDatastore {
    #projectId
    #keyFilename
    #Datastore
    #DatastoreClient

    /**
     * Request data from Google Datastore
     * @param {string} projectId 
     * @param {string} keyFilename 
     */
    constructor (projectId, keyFilename) {
        this.#Datastore = require('@google-cloud/datastore').Datastore;
        this.#DatastoreClient = require('@google-cloud/datastore').v1.DatastoreClient;
        this.#projectId = projectId
        this.#keyFilename = keyFilename
    }

    /**
     * Retrive data from Google Datastore by GQL Query
     * @param {string} sql 
     * @param {Array} params 
     */
    async gqlQuery (sql, bindings) {
        try {
            const datastoreClient = new this.#DatastoreClient({
                projectId: this.#projectId,
                keyFilename: this.#keyFilename
            });

            const [ operation ] = await datastoreClient.runQuery({
                projectId: `${this.#projectId}`,
                gqlQuery: {
                    queryString: `${sql}`,
                    namedBindings: bindings
                }
            })

            return operation
        } catch (e) {
            return e
        }
    }

    /**
     * Retrive data from Google Datastore by GQL Query
     * @param {string} sql 
     * @param {Array} params 
     */
    async gqlAggregationQuery (sql, bindings) {
        try {
            const datastoreClient = new this.#DatastoreClient({
                projectId: this.#projectId,
                keyFilename: this.#keyFilename
            });

            const [ operation ] = await datastoreClient.runAggregationQuery({
                projectId: `${this.#projectId}`,
                gqlQuery: {
                    queryString: `${sql}`,
                    namedBindings: bindings
                }
            })

            return operation
        } catch (e) {
            return e
        }
    }

    /**
     * 
     * @param {string} kind 
     * @param {Array} filters 
     * @param {string} orderby 
     * @param {string} sort 
     * @param {string} start 
     * @param {number} limit 
     * @returns 
     */
    async  query (kind, filters, orderby, sort, start, limit) {
        try {
            const datastore = new this.#Datastore({
                projectId: this.projectId,
                keyFilename: this.keyFilename
            });

            const queryDS = datastore.createQuery(kind)

            if (isNaN(limit)) limit = 1
            queryDS.limit(limit)

            let tmpFilters = []
            if (filters && filters.length > 0) {
                filters.forEach((f) => {
                    if (f.field && f.value) {
                        f.operator = (f.operator) ? f.operator : '='
                        tmpFilters.push(queryDS.filter(f.field, f.operator, f.value))
                    }
                })
            }
            queryDS.filters = tmpFilters

            if (orderby) {
                queryDS.order(orderby, {
                    descending: (sort === 'desc') ? true : false
                })
            }

            if (start) queryDS.start(start)

            
            const operation = await datastore.runQuery(queryDS)
            return operation
        } catch (e) {
            return e
        }
    }
}

module.exports = GCPDatastore
