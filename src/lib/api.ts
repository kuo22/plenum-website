import jsonApi from './jsonApiClient';
import {Action} from 'vuex-class';
import { Vue } from 'vue-property-decorator';

const namespace: string = 'menuTree';

class Api extends Vue {
    @Action('setMenuTree', { namespace }) public setMenuTree: any;

    private articleInclusions: string = 'download,download.field_media_file,images,images.field_image,keywords';

    constructor() {
        super();
    }

    public findOneCollectionForMenuByUuid(uuid: string) {
        const query = {
            include: 'articles,cover_image,cover_image.field_image',
            fields: {
                collections: 'uuid,title,release_date,cover_image,articles,path',
                articles: 'uuid,authors,content_title,subtitle,abstract',
                articlesNonAcademic: 'uuid,authors,content_title,subtitle',
            }
        };
        return jsonApi.get('collections/' + uuid, query);
    };

    public findMostRecentCollectionsForMenu(limit: number) {
        const query = {
            include: 'articles,cover_image,cover_image.field_image',
            fields: {
                collections: 'uuid,title,release_date,cover_image,articles,path',
                articles: 'uuid,authors,content_title,subtitle,abstract',
                articlesNonAcademic: 'uuid,authors,content_title,subtitle'
            },
            sort: '-release_date', // Sort by release date, descending
            page: {
                limit: limit // Limit number of responses
            }
        };
        return jsonApi.get('collections', query);
    }

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
    }

    public fetchAboutPage() {
        const query = this.buildConditionalFilter('about', 'title', 'STARTS_WITH', 'About')
        return jsonApi.get('pages', query);
    }

    public fetchContributePage() {
        const query = this.buildConditionalFilter('contribute', 'title', 'CONTAINS', 'Submission')
        return jsonApi.get('pages', query);
    }

    public fetchContentByUUID(uuid, contentType) {
        switch(contentType) {
            case 'articles':
                return this.findArticleByUUID(uuid);
            case 'articlesNonAcademic':
                return this.findNonAcademicArticleByUUID(uuid);
            case 'pages':
                return this.findPageByUUID(uuid);
        }
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

    private formatAuthors(authorData: string): string | Array<string> {
        if (authorData.includes(';')) {
            return authorData.split(';').map(fullname => {
                return fullname.split(',').reverse().map(name => name.trim()).join(' ');
            });
        } else {
            return authorData.split(',').reverse().map(name => name.trim()).join(' ');
        }
    }
}

export default new Api();
