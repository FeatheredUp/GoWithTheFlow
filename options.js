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

    static defaultScheme = new ColourScheme('default', '#110011', '#330033', '#FF0000', '#FFFF00', '#ABCDEF');
    static monochromeScheme = new ColourScheme('monochrome', '#FFFFFF', '#EEEEEE', '#000000', '#AAAAAA', '#FFFFFF');
    static garishScheme = new ColourScheme('garish', '#05EFFF', '#05FFFF', '#FF0000', '#FF00FF', '#FFFFFF');

    static allSchemes = [ColourScheme.defaultScheme, ColourScheme.monochromeScheme, ColourScheme.garishScheme];
}

class Options {
    colourScheme;
    constructor(colourSchemeName) {
        this. colourScheme = ColourScheme.allSchemes.find((scheme) => scheme.name == colourSchemeName);
        if (!this.colourScheme) this.colourScheme = ColourScheme.defaultScheme;
    }
}