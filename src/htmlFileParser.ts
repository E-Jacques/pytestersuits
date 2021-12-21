export type HtmlChild = {
    htmlChild: HtmlChild | null,
    tagName: string,
    classNames: string[]
};

export function parserHtmlChild (data: string): HtmlChild {
    let htmlChild: HtmlChild = {
        htmlChild: null,
        tagName: "",
        classNames: []
    };

    return htmlChild;
}

export function lookupHtml(data: string, searchedTagName: string, ...searchedClassName: string[]): HtmlChild[] {
    let htmlChilds: HtmlChild[] = [];

    return htmlChilds;
}

export function lookupFromHtmlChild (htmlChild: HtmlChild, searchedTagName: string, ...searchedClassName: string[]): HtmlChild[] {
    let htmlChilds: HtmlChild[] = [];

    return htmlChilds;
}