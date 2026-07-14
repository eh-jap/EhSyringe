import { merge } from '../helper';

merge(
    /^\/g\//,
    undefined,
    {
    },
    [
    ],
);

merge(
    /^\/g\/\w+\/\w+\/.*act=expunge/,
    undefined,
    {
    },
    [
    ],
);

merge(
    /^\/g\/\w+\/\w+\/.*report=/,
    undefined,
    {
    },
    [],
);
