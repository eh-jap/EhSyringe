import { merge } from '../helper';

merge(/^\/(toplist|home)\.php/, undefined, {
});

merge(/^\/toplist\.php/, undefined, {
});

merge(/^\/toplist\.php\?tl=1/, undefined, {
});

merge(/^\/toplist\.php\?tl=[2-7]/, undefined, {
});
