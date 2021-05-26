// Represents the colours used
class ColourScheme {
    name;
    back;
    touched;
    flow;
    noFlow;
    flowStart;

    constructor(name, back, touched, flow, noFlow, flowStart) {
        this.name = name;
        this.back = back;
        this.touched = touched;
        this.flow = flow;
        this.noFlow = noFlow;
        this.flowStart = flowStart;
    }

    static defaultScheme = new ColourScheme('default', '#110011', '#110011', '#FF0000', '#FFFF00', '#FFFFFF');
    static monochromeScheme = new ColourScheme('monochrome', '#FFFFFF', '#FFFFFF', '#000000', '#AAAAAA', '#FFFFFF');
    static garishScheme = new ColourScheme('garish', '#05EFFF', '#05EFFF', '#FF0000', '#FF00FF', '#FFFFFF');
    static riverScheme = new ColourScheme('river', '#00AAFF', '#00AAFF', '#0000AA', '#444444', '#FFFFFF');

    static allSchemes = [ColourScheme.defaultScheme, ColourScheme.monochromeScheme, ColourScheme.garishScheme, ColourScheme.riverScheme];
}

class Options {
    colourScheme;
    constructor(colourSchemeName) {
        this. colourScheme = ColourScheme.allSchemes.find((scheme) => scheme.name == colourSchemeName);
        if (!this.colourScheme) this.colourScheme = ColourScheme.defaultScheme;
    }
}