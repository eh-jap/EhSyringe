import { Service } from '.';
import type { GithubRelease, EHTDatabase } from 'interface';
import { Http } from './http';
import { Logger } from './logger';
import { Storage } from './storage';

@Service()
export class Database {
    constructor(
        readonly http: Http,
        readonly storage: Storage,
        readonly logger: Logger,
    ) {}
    async getLatestVersion(): Promise<GithubRelease> {
        const githubDownloadUrl = 'https://ehjp.cooked-potatoes.workers.dev/'; // 'https://api.github.com/repos/eh-jap/Database/releases/latest';
        const info = await this.http.json<GithubRelease | { message: string }>(githubDownloadUrl);
        if (!('target_commitish' in info)) {
            if (typeof info.message != 'string') {
                throw new Error('响应有误');
            }
            if (info.message.startsWith('API rate limit exceeded')) {
                throw new Error('GitHub API 调用次数超过限制，请稍后再试');
            }
            throw new Error(info.message);
        }
        return info;
    }

    private dataUrls(version: GithubRelease): string[] {
        const asset = version.assets.find((asset) => asset.name === 'db.html.json');
        if (!asset) return [];
        return [
            `https://cors.cooked-potatoes.workers.dev/${asset.browser_download_url}`,
        ];
    }

    private async fetchData(
        version: GithubRelease | undefined,
        total: number,
        url: string,
        progress?: (p: number) => void,
    ): Promise<EHTDatabase> {
        try {
            const result = await this.http.download<EHTDatabase | undefined>(
                url,
                'GET',
                (loaded) => {
                    if (total > 0) progress?.(loaded / total);
                    else progress?.(0);
                },
                'json',
            );
            if (
                !result ||
                !Array.isArray(result.data) ||
                result.data.some((item) => item.data == null || typeof item.data !== 'object')
            ) {
                throw new Error(`下载的数据格式不正确: ${JSON.stringify(result)}`);
            }
            if (version && result?.head?.sha !== version.target_commitish) {
                throw new Error(`版本不匹配: ${result?.head?.sha} !== ${version.target_commitish}`);
            }
            this.logger.log(`Download successful:`, url);
            return result;
        } catch (ex) {
            this.logger.warn(`Failed to download ${url}, reason:`, ex);
            throw new Error(`Unable to download ${url}, reason: ${(ex as Error).message || String(ex)}`);
        }
    }

    private async getOverride(): Promise<EHTDatabase | undefined> {
        const config = await this.storage.get('config');
        const url = config?.overrideDbUrl?.trim();
        if (!url) {
            this.logger.debug(`Skip fetching user tag database as URL was not set.`);
            return undefined;
        }
        try {
            const u = new URL(url);
            if (u.protocol !== 'http:' && u.protocol !== 'https:') {
                throw new Error('不支持的协议');
            }
        } catch (ex) {
            this.logger.error(`无效的外部数据库 URL ${url}：${(ex as Error).message || String(ex)}`);
        }
        this.logger.debug(`Will fetch user tag database from:`, url);
        try {
            return await this.fetchData(undefined, 0, url, undefined);
        } catch (ex) {
            this.logger.error(`Failed to fetch user tag database: ${(ex as Error).message || String(ex)}`);
            return undefined;
        }
    }

    async getData(
        version: GithubRelease,
        progress?: (p: number) => void,
    ): Promise<{ base: EHTDatabase; override?: EHTDatabase }> {
        const urls = this.dataUrls(version);
        const asset = version.assets.find((asset) => asset.name === 'db.html.json');
        const total = asset != null ? asset.size : 0;
        const errors: Error[] = [];
        const override = this.getOverride();
        let base;
        for (const url of urls) {
            try {
                base = await this.fetchData(version, total, url, progress);
                break;
            } catch (ex) {
                errors.push(ex as Error);
            }
        }
        if (!base) {
            if (errors.length === 0) throw new Error('没有获取到有效的文件');
            const e = errors[errors.length - 1];
            Object.defineProperty(e, 'errors', {
                value: errors,
                enumerable: true,
            });
            throw e;
        }
        return {
            base,
            override: await override,
        };
    }
}
