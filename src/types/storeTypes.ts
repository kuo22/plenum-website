
import {MainMenuItem} from '@/classes/MainMenuItem';

// States
export interface MenuTreeState {
    main: Array<Object>;
    active: boolean;
    open: boolean;
    error: boolean;
}
