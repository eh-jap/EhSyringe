import { merge } from '../helper';

merge(/^\/gallerypopups\.php\?.*act=rename/, undefined, {
});

merge(
    /^\/gallerypopups\.php\?.*act=addfav/,
    undefined,
    {
    },
    [
    ],
);
