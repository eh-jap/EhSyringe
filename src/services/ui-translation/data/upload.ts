import { merge } from '../helper';

const data = {
};

const regexData: Array<[RegExp, string]> = [
];

merge(/^\/upld\//, undefined, data, regexData);
merge(/^\//, 'upld.e-hentai.org', data, regexData);
merge(/^\//, 'upload.e-hentai.org', data, regexData);
