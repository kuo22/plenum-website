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
    get: (uri, params = null) => {
        let query;
        if (params && typeof params === 'object') {
            query = '?' + qs.stringify(params, {encode: false});
        } else if (params) {
            query = '?' + params;
        } else {
            query = '';
        }
        const url = 'http://localhost:8888/contenta/web/api/' + uri + query;
        store.dispatch('setAppLoading', true);
        return axios.get(url);
    },
};