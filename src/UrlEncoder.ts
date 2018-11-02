import axios, {AxiosStatic} from 'axios';
import {Action} from 'vuex-class';
import { Vue } from 'vue-property-decorator';

class UrlEncoder extends Vue {


    constructor() {
        super();
    }

    private createUrl(data: string): string {
        return '';
    }

    private decipherUrl(url: string): string {
        return '';
    }
}

const URLService = new UrlEncoder();

export default URLService;
