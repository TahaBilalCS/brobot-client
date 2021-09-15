/*
These brackets are necessary so that it turns this file "from a module, into a script."
This will "disregard the fact that there is an existing definition" for 'express-session'
 */
export {};

/*
Interface/Declaration Merging. Because req.session.some_property does not exist
https://stackoverflow.com/questions/61964943/typescript-error-this-expression-is-not-callable-type-typeof-importkoa-sess
https://github.com/expressjs/session/issues/792
 */
declare module 'express-session' {
    export interface SessionData {
        loggedIn: boolean | undefined;
    }
}
