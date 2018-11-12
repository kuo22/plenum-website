/**
 * Client for JSON API server.
 * We use "jsonapi-parse" package to format responses :
 * It resolves relationships and included objects nicely in the final data object.
 */
import jsonapiParse from 'jsonapi-parse';
import axios from 'axios';
import qs from 'qs';
import store from "../store";

axios.defaults.withCredentials = false;

// Add a response interceptor to format response with jsonapi-parse
axios.interceptors.response.use(response => {
    return jsonapiParse.parse(response.data).data;
});

export default {
    // Construct a get request to the provided API endpoint with the provided
    // query parameters
    //      uri: string = API endpoint
    //      params: Object || string = query parameters in JSON API request format
    get: (uri, params = null) => {
        let query;
        if (params && typeof params === 'object') {
            query = '?' + qs.stringify(params, {encode: false});
        } else if (params) {
            query = '?' + params;
        } else {
            query = '';
        }
        const url = process.env.VUE_APP_CONTENTA_API + '/' + uri + query;
        store.dispatch('setAppLoading', true);
        return axios.get(url);
    },
};