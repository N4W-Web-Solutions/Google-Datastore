"use strict";

class GCPDatastore {
    #projectId
    #Datastore
    #DatastoreClient
    #Auth

    /**
     * Request data from Google Datastore
     * @param {any} options 
     */
    constructor (options = {}) {
        this.#Datastore = require('@google-cloud/datastore').Datastore;
        this.#DatastoreClient = require('@google-cloud/datastore').v1.DatastoreClient;
        this.#Auth = require('./utils/auth')(options)
        this.#projectId = this.#Auth.projectId
    }

    /**
     * Retrive data from Google Datastore by GQL Query
     * @param {string} sql 
     * @param {Array} params 
     */
    async gqlQuery (sql, bindings) {
        try {
            const datastoreClient = new this.#DatastoreClient(this.#Auth);

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
            const datastoreClient = new this.#DatastoreClient(this.#Auth);

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
            const datastore = new this.#Datastore(this.#Auth);

            const queryDS = datastore.createQuery(kind)

            let tmpFilters = []
            if (filters && filters.length > 0) {
                filters.forEach((f) => {
                    if (f.field && f.value) {
                        f.operator = (f.operator) ? f.operator : '='
                        tmpFilters.push({ name: f.field, op: f.operator, val: f.value })
                    }
                })
            }

            if (tmpFilters.length > 0)  queryDS.filters = tmpFilters

            if (orderby) queryDS.order(orderby, { descending: (sort === 'desc') ? true : false })

            if (start) queryDS.start(start)

            if (isNaN(limit) || limit < 1) {
                limit = 1 
            } else if (limit > 100) {
                limit = 100
            }
            queryDS.limit(limit)
            
            const operation = await datastore.runQuery(queryDS)
            return operation
        } catch (e) {
            return e
        }
    }
}

module.exports = GCPDatastore
