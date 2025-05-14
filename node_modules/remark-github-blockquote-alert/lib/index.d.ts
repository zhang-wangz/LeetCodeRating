import type { Plugin } from 'unified';
import type { Root, PhrasingContent } from "mdast";
type Option = {
    /**
     * Use the legacy title format, which includes a slash and a title after the alert type.
     *
     * Enabling legacyTitle allows modifying the title, but this is not GitHub standard.
     */
    legacyTitle?: boolean;
    /**
     * The tag name of the alert container. default is `div`.
     * or you can use `blockquote` for semantic HTML.
     */
    tagName?: string;
};
/**
 * Alerts are a Markdown extension based on the blockquote syntax that you can use to emphasize critical information.
 * On GitHub, they are displayed with distinctive colors and icons to indicate the significance of the content.
 * https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts
 */
export declare const remarkAlert: Plugin<[Option?], Root>;
export default remarkAlert;
export declare function getAlertIcon(type: IconType): PhrasingContent;
type IconType = 'note' | 'tip' | 'important' | 'warning' | 'caution';
