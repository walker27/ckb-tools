export default function filterInvalidTypeNameChar(name) {
    // 过滤英文数字中文下划线外其他所有的字符
    const outputName = name.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_');
    if (name !== outputName) {
        console.log('filterInvalidTypeNameChar: 修正带有异常字符的类型名称:', name, '->', outputName);
    }
    return outputName;
}
