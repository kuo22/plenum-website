import {Article} from '@/types/types';
import axios, {AxiosStatic} from 'axios';
import {DrupalMenu} from '@/types/types';
import {Action} from 'vuex-class';
import { Vue } from 'vue-property-decorator';
import {error} from 'util';

const namespace: string = 'menuTree';

class API extends Vue {
    // @Action('setMenuTree', { namespace }) public setMenuTree: any; // Action that calls Drupal API
    @Action('setMenuTree', { namespace }) public setMenuTree: any;

    // Content Management System URL path
    private port: string = '8888';
    private localHost: string = 'http://localhost:' + this.port;
    private CMSPath: string = this.localHost + '/plenum-drupal-dev/drupal-8.5.3';
    private fetcher: AxiosStatic;

    private jsonAPIPath: string = '/jsonapi/node';
    private drupalAPIPath: string = '/node';
    private articleEntityPath: string = '/article/';
    private format: string = 'json';


    constructor() {
        super();

        axios.defaults.baseURL = this.CMSPath;
        this.fetcher = axios;

    }

    // Fetches the navigation hierarchy from the Drupal API
    // and returns a promise for the data
    public async fetchMenuTree(): Promise<any> {
        return await this.fetcher({
            url: 'entity/menu/main/tree',
            params: {
                _format: 'json',
            },
            timeout: 1000,

        }).then((response: any) => {
            return response.data;
        });
    }

    public async fetchCollection(articleUUIDs: string[]): Promise<any> {
        const articlePromises: Array<Promise<any>> = [];

        for (const articleUUID of articleUUIDs) {
            const articlePromise = this.fetchNodeDataByUUID(articleUUID);
            articlePromises.push(articlePromise);
        }

        return Promise.all(articlePromises)
            .then((articles) => {
                return articles;
            });
    }

    // Fetch the cover image URL of a submenu link representing a Drupal entity
    // and returns a promise for that URL
    public async fetchContent(nodeID: string): Promise<any> {
        const url: string = 'node/' + nodeID;

        return await this.fetcher({
            url,
            params: {
                _format: 'json',
            },
            timeout: 1000,
        }).then((response: any) => {
            if ('field_cover_image' in response.data && 'field_articles' in response.data) {
                return response.data;
                // return response.data.field_cover_image[0].url;
            } else {
                return {};
            }
        });
    }

    public async fetchArticle(nodeID: string): Promise<any> {
        const url: string = 'node/' + nodeID;

        return await this.fetcher({
            url,
            params: {
                _format: 'json',
            },
            timeout: 1000,
        }).then((response) => {
            return this.createArticle(response.data);
        });

    }


    // Call the Drupal API to get article data according to the provided drupal node ID
    // and return a processed article
    // parameters needed:
    //      articleNodeID = the drupal node ID of an article
    public async getArticle(articleNodeID: string): Promise<any> {

        return await this.fetchUUID(articleNodeID)
            .then((uuid: string) => {
                // TODO make that API service get all UUIDs up front to prevent this second call to get UUID
                return this.fetchNodeDataByUUID(uuid)
                    .then((articleData: any) => {
                        return this.createArticle(articleData);
                    })
                    .catch();
            })
            .catch(/* Throw DOM display error that article does not exist?*/);
    }

    // Fetches the download URL for the provided drupal entity
    // If the requested file exists, this returns the file's download URL
    // otherwise, this returns an empty URL
    // parameter(s) needed:
    //      fileNodeURL = the download file's endpoint from the related relationships of another Drupal entity
    public async getDownloadURL(fileNodeURL: string): Promise<any> {
        return await this.fetcher({
            url: this.jsonAPIPath + fileNodeURL.substr(fileNodeURL.indexOf('node') + ('node').length,
                fileNodeURL.length),
            params: {},
            timeout: 1000,
        }).then((response: any) => {
            if (response !== undefined &&
                Object.keys(response.data.data).length > 0 &&
                'url' in response.data.data.attributes) {
                return this.localHost + response.data.data.attributes.url + '';
            } else {
                return '';
            }
        });
    }

    //
    // TODO: export article creation to store actions
    // Creates an article from the provided data
    // parameter(s) needed:
    //      articleData = JSON data of an article from the Drupal API
    // TODO: make type 'Article' not 'ArticlePeerReviewed'
    public createArticle(articleData: any): Article {
        return new Article(
            articleData.attributes.field_title, // Title
            articleData.attributes.field_author, // Author
            articleData.attributes.field_abstract, // Abstract
            articleData.attributes.body[0].processed, // Text body
            articleData.attributes.field_references.processed,
            '',
            // articleData.relationships.field_download_.articleData, // Download URL
            articleData.attributes.field_copyright,
            'University of Washington', // University
            'Department of Geography', // School
            articleData.attributes.field_subtitle, // Subtitle
        );
    }


    // Calls the Drupal API to get and return the UUID of the provided Drupal node
    // Response return example: "081b98ba-4ec8-429d-9152-2c231f45885a"
    // parameters needed:
    //      nodeID = the unique ID of the drupal content node
    private async fetchUUID(nodeID: string): Promise<any> {
        return await this.fetcher({
            url: this.drupalAPIPath + nodeID,
            params: {
                _format: this.format,
            },
            timeout: 1000,
            // socketPath: ,
        }).then((response) => {
            const uuid: string = response.data.uuid[0].value;
            return uuid;
        });
    }

    // Calls the Drupal API for node data specified by the provided UUID
    // and returns the slimmed data
    // parameters needed:
    //      uuid = the Drupal UUID of a Drupal node
    private async fetchNodeDataByUUID(uuid: string): Promise<any> {
        return await this.fetcher( {
            url: this.jsonAPIPath + this.articleEntityPath + uuid,
            params: {
                _format: this.format,
            },
            timeout: 1000,
        }).then((response) => {
            return response.data.data;
        });
    }
}

const APIService = new API();

export default APIService;
