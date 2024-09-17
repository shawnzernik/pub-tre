import { CSSProperties } from "react";
import { Theme } from "./Theme";

export class FieldTheme {

    public static field: CSSProperties = {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: "1em",
        alignItems: "center"
    };

    public static fieldLabel: CSSProperties = {
        width: Theme.FormLabelWidthEm + "em",
        minWidth: Theme.FormLabelWidthEm + "em",
        textAlign: "right"
    };
}