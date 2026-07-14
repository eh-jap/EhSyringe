import { merge } from '../helper';
import { BROWSING_COUNTRY } from './_browsingcountry';

merge(
    /^\/hentaiathome\.php\??$/,
    undefined,
    {
        ...BROWSING_COUNTRY,
    },
    [
    ],
);

merge(
    /^\/hentaiathome\.php\?.*act=settings/,
    undefined,
    {
    },
    [
    ],
);
