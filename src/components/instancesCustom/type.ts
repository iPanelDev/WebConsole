export declare type Component =
    | Radio
    | CardBox
    | Button
    | ButtonGroup
    | Input
    | CheckBox
    | Switch
    | Select;

export declare type ComponentBaseWithId = {
    id: string;
};

export declare type ComponentBaseWithHelp = {
    help?: string;
} & ComponentBaseWithId;

export declare type ComponentBaseWithDisabled = {
    disabled?: boolean;
} & ComponentBaseWithId;

export declare type CardBox = {
    type: "cardbox";
    title?: string;
};

export declare type Radio = {
    type: "radio";
    label: string;
} & ComponentBaseWithHelp;

export declare type CheckBox = {
    type: "checkbox";
    label: string;
} & ComponentBaseWithHelp;

export declare type Switch = {
    type: "switch";
    label: string;
} & ComponentBaseWithHelp;

export declare type Button = {
    type: "button";
    color: string;
    to?: string;
} & ComponentBaseWithHelp &
    ComponentBaseWithDisabled;

export declare type ButtonGroup = {
    type: "buttonGroup";
    items: Button[];
};

export declare type Input = {
    type: "input";
    placeholder?: string;
    autocomplete?: string;
    maxlength?: number;
} & ComponentBaseWithHelp &
    ComponentBaseWithDisabled;

export declare type Select = {
    type: "input";
    items: string[];
} & ComponentBaseWithHelp;
