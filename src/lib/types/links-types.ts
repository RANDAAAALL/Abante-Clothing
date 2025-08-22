import { UrlObject } from "url";

// this will define the type for the links for the nav-bar link lists
type LinksType = {
    path: string | UrlObject,
    name: string,
}

export type { LinksType };