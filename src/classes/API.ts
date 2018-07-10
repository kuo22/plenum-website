import {ArticlePeerReviewed} from '@/classes/ArticlePeerReviewed';
import fetcher from '@/fetcher';

export class API {


    private jsonAPIPath: string = '/jsonapi/node/';
    private drupalAPIPath: string = '/node';
    private articleEntityPath: string = '/article/';
    private format: string = 'json';


    constructor() {
        // empty
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
            .catch();


        // const articleJSON = fetch('http://localhost:8888/plenum-drupal-dev/drupal-8.5.3/api/pubs/'
        //     + this.year
        //     + '?_format=json')
        //     .then((response) =>
        //         response.json().then((data) => ({
        //                 data,
        //                 status: response.status,
        //             }),
        //         ).then((res) => {
        //             this.createArticle(res.data[this.articleId]);
        //         }))
        //    .catch();
        // Throw DOM display that article does not exist
    }


    // Calls the Drupal API to get and return the UUID of the provided Drupal node
    // Response return example: "081b98ba-4ec8-429d-9152-2c231f45885a"
    // parameters needed:
    //      nodeID = the unique ID of the drupal content node
    private async fetchUUID(nodeID: string): Promise<any> {
        return await fetcher({
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
        return await fetcher( {
            url: this.jsonAPIPath + this.articleEntityPath + uuid,
            params: {
                _format: this.format,
            },
            timeout: 1000,
        }).then((response) => {
            return response.data.data;
        });
    }

    // Creates an article from the provided data
    // parameter(s) needed:
    //      articleData = JSON data of an article from the Drupal API
    private createArticle(articleData: any): ArticlePeerReviewed {
        return new ArticlePeerReviewed(
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
}
