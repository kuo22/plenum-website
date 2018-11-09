/**
 * Client for JSON API server.
 * We use "jsonapi-parse" package to format responses :
 * It resolves relationships and included objects nicely in the final data object.
 */
import jsonapiParse from 'jsonapi-parse';
import axios from 'axios';
import qs from 'qs';

axios.defaults.withCredentials = false;

// Add a response interceptor to format response with jsonapi-parse
axios.interceptors.response.use(response => {
    return jsonapiParse.parse(response.data).data;
});

export default {
    get: (uri, params = null) => {
        const query = params ? '?' + qs.stringify(params, { encode: false }) : '';
        const url = 'http://localhost:8888/contenta/web/api/' + uri + query;
        return axios.get(url);
    },
};