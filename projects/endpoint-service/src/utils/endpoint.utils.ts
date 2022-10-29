import { BASE_URL_META_TAG_PLACEHOLDER } from '../config';
import { Meta } from '@angular/platform-browser';

export class EndpointUtils {
    public static getMetaTagContent(
        name: string,
        meta: Meta
    ): string | undefined {
        const metaTag = meta.getTag(`name="${name}"`);
        return metaTag?.content &&
            metaTag.content !== BASE_URL_META_TAG_PLACEHOLDER
            ? metaTag.content
            : undefined;
    }
}
