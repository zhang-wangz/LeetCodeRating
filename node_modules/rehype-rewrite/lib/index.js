import { visit } from 'unist-util-visit';
import { selectAll } from 'hast-util-select';
/** Get the node tree source code string */
export const getCodeString = (data = [], code = '') => {
    data.forEach((node) => {
        if (node.type === 'text') {
            code += node.value;
        }
        else if (node.type === 'element' && node.children && Array.isArray(node.children)) {
            code += getCodeString(node.children);
        }
    });
    return code;
};
const remarkRewrite = (options) => {
    const { selector, rewrite } = options || {};
    return (tree) => {
        if (!rewrite || typeof rewrite !== 'function')
            return;
        if (selector && typeof selector === 'string') {
            const selected = selectAll(selector, tree);
            if (selected && selected.length > 0) {
                visit(tree, selected, (node, index, parent) => {
                    rewrite(node, index, parent);
                });
            }
            return;
        }
        visit(tree, (node, index, parent) => {
            rewrite(node, index, parent);
        });
    };
};
export default remarkRewrite;
//# sourceMappingURL=index.js.map