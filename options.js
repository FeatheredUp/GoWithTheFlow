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
}

class Options {
    colourScheme;

    defaultScheme = new ColourScheme('default', '#110011', '#110011', '#FF0000', '#FFFF00', '#FFFFFF');
    monochromeScheme = new ColourScheme('monochrome', '#FFFFFF', '#FFFFFF', '#000000', '#AAAAAA', '#FFFFFF');
    garishScheme = new ColourScheme('garish', '#05EFFF', '#05EFFF', '#FF0000', '#FF00FF', '#FFFFFF');
    riverScheme = new ColourScheme('river', '#00AAFF', '#00AAFF', '#0000AA', '#444444', '#FFFFFF');

    allSchemes = [this.defaultScheme, this.monochromeScheme, this.garishScheme, this.riverScheme];

    constructor(colourSchemeName) {
        this.colourScheme = this.allSchemes.find((scheme) => scheme.name == colourSchemeName);
        if (!this.colourScheme) this.colourScheme = this.defaultScheme;
    }
}