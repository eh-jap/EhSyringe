import { merge } from '../helper';
import { BROWSING_COUNTRY } from './_browsingcountry';

merge(
    /^\/uconfig\.php/,
    undefined,
    {
        ...BROWSING_COUNTRY,

    },
    [
    ],
);
