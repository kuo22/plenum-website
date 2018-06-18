import axios, {AxiosStatic} from 'axios';

axios.defaults.baseURL = 'http://localhost:8888/plenum-drupal-dev/drupal-8.5.3/';

const fetcher: AxiosStatic = axios;
export default fetcher;
