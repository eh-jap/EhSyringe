import { merge } from '../helper';

merge(
    /^\/archiver\.php/,
    undefined,
    {
    },
    [
    ],
);

merge(/^\/archive\//, '*.hath.network', {
});
