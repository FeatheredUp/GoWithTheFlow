// Represents the colours used
class ColourScheme {
    name;
    back;
    touched;
    flow;
    noFlow;
    flowStart;
    flowHighlight;

    constructor(name, back, touched, flow, noFlow, flowStart, flowHighlight) {
        this.name = name;
        this.back = back;
        this.touched = touched;
        this.flow = flow;
        this.noFlow = noFlow;
        this.flowStart = flowStart;
        this.flowHighlight = flowHighlight;
    }
}

class Options {
    colourScheme;

    //                                  name          back       touched    flow       no flow    start      highlight
    defaultScheme = new ColourScheme(   'default',    '#110011', '#110011', '#FF0000', '#FFFF00', '#0000FF', '#FFFFFF');
    monochromeScheme = new ColourScheme('monochrome', '#FFFFFF', '#FFFFFF', '#000000', '#AAAAAA', '#777777', '#FFFFFF');
    garishScheme = new ColourScheme(    'garish',     '#05EFFF', '#05EFFF', '#FF0000', '#FF00FF', '#0000FF', '#FFFFFF');
    riverScheme = new ColourScheme(     'river',      '#00AAFF', '#00AAFF', '#0000AA', '#444444', '#00FFFF', '#FFFFFF');

    allSchemes = [this.defaultScheme, this.monochromeScheme, this.garishScheme, this.riverScheme];

    constructor(colourSchemeName) {
        this.colourScheme = this.allSchemes.find((scheme) => scheme.name == colourSchemeName);
        if (!this.colourScheme) this.colourScheme = this.defaultScheme;
    }
}