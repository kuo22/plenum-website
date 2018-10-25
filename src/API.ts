import {Article, Author} from '@/types/types';
import axios, {AxiosStatic} from 'axios';
import {Action} from 'vuex-class';
import { Vue } from 'vue-property-decorator';
import {error} from 'util';

const namespace: string = 'menuTree';

class API extends Vue {
    @Action('setMenuTree', { namespace }) public setMenuTree: any;

    // Content Management System URL path
    private port: string = '8888';
    private hostname: string = 'http://localhost:' + this.port;
    private CMSPath: string = this.hostname + '/plenum-drupal-dev/drupal-8.5.3';
    private fetcher: AxiosStatic;

    private jsonAPIPath: string = 'jsonapi/node/';
    private drupalAPIPath: string = 'node/';
    private articleEntityPath: string = 'article/';
    private nonAcademicEntityPath: string = 'non_academic_text/';
    private format: string = 'json';

    constructor() {
        super();

        axios.defaults.baseURL = this.CMSPath;
        this.fetcher = axios;
    }

    // Fetches the navigation hierarchy from the Drupal API
    // and returns a promise for the data
    public fetchMenuTree(): Promise<any> {
        return this.fetcher({
            url: 'api/menu_items/main', // Rest menu items API
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

    public async fetchNonAcademicTextByUUID(uuid: string) {
        const url: string = this.jsonAPIPath + this.articleEntityPath + uuid;
        const fieldsKey = "fields[node--non_academic_text]";
        let params = {
            _format: this.format,
        };
        params[fieldsKey] =
            'uuid,' +
            'body,' +
            'field_author,' +
            'field_title,' +
            'field_subtitle,' +
            "field_body," +
            'field_copyright,' +
            "field_download_," +
            'field_tags,' +
            'field_images';

        return await this.fetcher({
            url,
            params: params,
            timeout: 10000,
        }).then((response) => {
            let attributes = response.data.data.attributes;
            let relationships = response.data.data.relationships;
            let included = response.data.included;
            let content = {
                uuid: attributes.uuid,
                author: attributes.field_author,
                title: attributes.field_title,
                subtitle: attributes.field_subtitle,
                body: attributes.body,
                copyright: attributes.field_copyright,
                downloadURL: this.hostname + included.find(node => node.attributes.filemime.endsWith('pdf')).attributes.url,
                tags: [],
                images: []
            };
            return content;
        });
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

    public async fetchContentByUUID(uuid: string, contentType: string): Promise<any> {
        const url: string = this.jsonAPIPath + contentType.substring(contentType.indexOf('--') + 1) + "/" + uuid;
        let params = {
            _format: this.format,
            include: 'field_download_'
        };
        if (contentType.includes("article")) {
            params["fields[node--" + contentType + "]"] =
                'uuid,' +
                'nid,' +
                'body,' +
                'field_author,' +
                'field_title,' +
                'field_subtitle,' +
                'field_abstract,' +
                'field_copyright,' +
                'field_references,' +
                'field_download_,' +
                'field_tags,' +
                'field_images';
        } else if (contentType.includes("non_academic_text")) {
            params["fields[node--" + contentType + "]"] =
                'uuid,' +
                'nid,' +
                'body,' +
                'field_author,' +
                'field_title,' +
                'field_subtitle,' +
                "field_body," +
                'field_copyright,' +
                "field_download_," +
                'field_tags,' +
                'field_images';
        }

        return await this.fetcher({
            url,
            params: params,
            timeout: 10000,
        }).then((response) => {
            let attributes = response.data.data.attributes;
            let relationships = response.data.data.relationships;
            let included = response.data.included;
            let article = {
                uuid: attributes.uuid,
                node: attributes.nid,
                author: this.getAuthor(attributes.field_author),
                title: attributes.field_title,
                subtitle: attributes.field_subtitle,
                abstract: attributes.field_abstract,
                body: attributes.body,
                references: attributes.field_references,
                copyright: attributes.field_copyright,
                downloadURL: (included) ? this.hostname + included.find(node => node.attributes.filemime.endsWith('pdf')).attributes.url : null,
                tags: [],
                images: []
            };
            return article;
        });
    }

    private getAuthor(authorData: string): string | Array<string> {
        if (authorData.includes(';')) {
            return authorData.split(';').map(fullname => {
                return fullname.split(',').reverse().map(name => name.trim()).join(' ');
            });
        } else {
            return authorData.split(',').reverse().map(name => name.trim()).join(' ');
        }
    }

    // Fetch the cover image URL of a submenu link representing a Drupal entity
    // and returns a promise for that URL
    public async fetchContentByNode(nodeID: string): Promise<any> {
        const url: string = 'node/' + nodeID;

        return await this.fetcher({
            url,
            params: {
                _format: 'json',
            },
            timeout: 10000,
        }).then((response: any) => {
            if ('field_cover_image' in response.data && 'field_articles' in response.data) {
                return response.data;
                // return response.data.field_cover_image[0].url;
            } else {
                return {};
            }
        });
    }

    public async fetchArticleByNode(nodeID: string): Promise<any> {
        const url: string = this.drupalAPIPath + nodeID;

        return await this.fetcher({
            url,
            params: {
                _format: 'json',
            },
            timeout: 10000,
        }).then((response) => {
            return this.createArticleDrupalAPIData(response.data);
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
                        return this.createArticleJSONAPI(articleData);
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
            url: "/" + this.jsonAPIPath + fileNodeURL.substr(fileNodeURL.indexOf('node') + ('node').length,
                fileNodeURL.length),
            params: {},
            timeout: 1000,
        }).then((response: any) => {
            if (response !== undefined &&
                Object.keys(response.data.data).length > 0 &&
                'url' in response.data.data.attributes) {
                return this.hostname + response.data.data.attributes.url + '';
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
    public createArticleJSONAPI(articleData: any): Article {
        const authorName: string[] = articleData.attributes.field_author.split(', ');
        const author: Author = {
            firstName: authorName[1],
            lastName: authorName[0],
        };
        let subtitle: string = '';
        if ('field_subtitle' in articleData.attributes) {
            subtitle = articleData.attributes.field_subtitle;
        }

        const article: Article = {
            title: articleData.attributes.field_title, // Title
            author, // Author
            abstract: articleData.attributes.field_abstract, // Abstract
            body: articleData.attributes.body[0].processed, // Text body
            refs: articleData.attributes.field_references.processed,
            downloadURL: '',
            // articleData.relationships.field_download_.articleData, // Download URL
            copyright: articleData.attributes.field_copyright,
            subtitle, // Subtitle
            nodeNumber: 0,
            uuid: '0',
            previewVisible: false,
    };

        return article;
    }

    public createArticleDrupalAPIData(articleData: any): Article {
        const authorName: string[] = articleData.field_author[0].value.split(', ');
        const author: Author = {
            firstName: authorName[1],
            lastName: authorName[0],
        };

        let subtitle: string = '';
        if (articleData.field_subtitle.length > 0) {
            subtitle = articleData.field_subtitle[0].value;
        }
        const article: Article = {
            title: articleData.field_title[0].value, // Title
            author, // Author
            abstract: articleData.field_abstract[0].value, // Abstract
            body: articleData.body[0].processed, // Text body
            refs: articleData.field_references[0].processed,
            downloadURL: '',
            // articleData.relationships.field_download_.articleData, // Download URL
            copyright: articleData.field_copyright[0].value,
            subtitle, // Subtitle
            nodeNumber: articleData.uid[0].target_id,
            uuid: articleData.uuid[0].value,
            previewVisible: false,
        };

        return article;
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
