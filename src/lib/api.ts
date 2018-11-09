import {Article, Author} from 'src/types/types';
import axios, {AxiosStatic} from 'axios';
import jsonApi from './jsonApiClient';
import {Action} from 'vuex-class';
import { Vue } from 'vue-property-decorator';
import qs from 'qs';


const namespace: string = 'menuTree';

class Api extends Vue {
    @Action('setMenuTree', { namespace }) public setMenuTree: any;

    // Content Management System URL path
    private fetcher: AxiosStatic;
    private hostname: string = process.env.VUE_APP_DRUPAL_HOSTNAME;

    private jsonAPIPath: string = 'jsonapi/node/';
    private drupalAPIPath: string = 'node/';
    private articleEntityPath: string = 'article/';
    private nonAcademicEntityPath: string = 'non_academic_text/';
    private format: string = 'json';

    // TODO: ADD 'previewVisible' ATTRIBUTE TO ARTICLE CREATION IN STORE AFTER API CALL
    private articleInclusions: string = 'download,download.field_media_file,images,images.field_image,keywords';

    constructor() {
        super();

        //axios.defaults.baseURL = this.hostname;
        this.fetcher = axios;
    }

    public findCollectionForMenuByUuid(uuid: string) {
        const query = {
            include: 'articles,cover_image,cover_image.field_image',
            fields: {
                collections: 'release_date,cover_image,articles',
                articles: 'uuid,authors,content_title,subtitle,abstract',
                articlesNonAcademic: 'uuid,authors,content_title,subtitle',
            }
        };
        return jsonApi.get('collections/' + uuid, query);
    };

    public findNonAcademicArticleByUUID(uuid: string) {
        const query = {
            include: this.articleInclusions,
            fields: {

            }
        };
        return jsonApi.get('articlesNonAcademic/' + uuid, query);
    }

    public findArticleByUUID(uuid: string) {
        const query = {
            include: this.articleInclusions,
            fields: {

            }
        };
        return jsonApi.get('articles/' + uuid, query);
    }

    public findPageByUUID(uuid: string) {
        const query = {
            include: 'images,images.field_image',
            fields: {

            }
        };

        return jsonApi.get('pages/' + uuid, query);
    }

    public fetchFrontPage(): Promise<any> {
        const query = {
            filter: {
                promote: 1
            }
        };
        return jsonApi.get('pages', query);

        // return this.fetcher({
        //     url: 'frontpage',
        //     params: {
        //         _format: 'api_json'
        //     },
        //     timeout: 10000
        // }).then(response => response.data);
    }

    public fetchAboutPage() {
        const query = this.buildConditionalFilter('about', 'title', 'STARTS_WITH', 'About')
        return jsonApi.get('pages', query);
    }

    public fetchContributePage() {
        const query = this.buildConditionalFilter('contribute', 'title', 'CONTAINS', 'Submission')
        return jsonApi.get('pages', query);
    }

    // JSON API Filtering
    // Find operators -> https://www.drupal.org/docs/8/modules/json-api/filtering
    private buildConditionalFilter(name, field, operator, value): string {
        const filterParts = ['path', 'operator', 'value'];
        const input = [field, operator, value];
        let filter = [];
        for (let i = 0; i < filterParts.length; i++) {
            filter.push('filter[' + name + '][condition][' + filterParts[i] + ']=' + input[i]);
        }
        return filter.join('&');
    }

    public fetchPageByNode(node: string): Promise<any> {
        return this.fetcher({
            url: this.drupalAPIPath + node,
            params: {
                _format: 'json'
            },
            timeout: 10000
        }).then(response => response.data);
    }

    // Fetches the navigation hierarchy from the Drupal Api
    // and returns a promise for the data
    public fetchMenuTree(): Promise<any> {
        return this.fetcher({
            url: 'api/menu_items/main', // Rest menu items Api
            params: {
                _format: 'json',
            },
            timeout: 10000,
        }).then(response => response.data);
    }

    public fetchCollectionMenuData(collectionUUID: string): Promise<any> {
        return this.fetcher({
            url: "jsonapi/node/issue/" + collectionUUID,
            params: {
                _format:                'json',
                include:                'field_articles,field_cover_image',
                "fields[node--issue]":  'field_release_date,field_cover_image,field_articles',
                "fields[node--article]":'uuid,field_author,field_title,field_subtitle,field_abstract',
                "fields[node--non_academic_text]": 'uuid,field_author,field_title,field_subtitle'
            },
            timeout: 10000
        }).then(response => response.data)
            .then(data => data.included);
    }

    public async fetchContent(node: string, uuid: string) {
        return this.fetchContentType(node)
            .then(contentType => {
                return this.fetchContentByUUID(uuid, contentType);
            });
    }

    public async fetchContentType(node: string) {
        let url = this.drupalAPIPath + node;
        let params = {
            _format: this.format
        };

        return await this.fetcher({
            url,
            params: params,
            timeout: 10000
        }).then(response => {
            return response.data.type[0].target_id;
        })
    }

    private formatAuthors(authorData: string): string | Array<string> {
        if (authorData.includes(';')) {
            return authorData.split(';').map(fullname => {
                return fullname.split(',').reverse().map(name => name.trim()).join(' ');
            });
        } else {
            return authorData.split(',').reverse().map(name => name.trim()).join(' ');
        }
    }

    // Calls the Drupal Api to get and return the UUID of the provided Drupal node
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

    // Calls the Drupal Api for node data specified by the provided UUID
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

export default new Api();
