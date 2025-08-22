import { UrlObject } from "url";

// this will define the type for the buttons
type ButtonsType = {
    path: string | UrlObject,
    name: string,
}

export type { ButtonsType };