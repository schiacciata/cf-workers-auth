import { AuthenticateOpts, BaseClassOptions, IBaseClass, LoginOpts, User } from "./Base";

interface IBearerClass extends IBaseClass {
    secret: string;
    algorithm: Algorithm;
};

interface BearerClassOptions extends BaseClassOptions {
    secret: string;
    algorithm?: Algorithm;
};

type Algorithm = { 
    name: string;
    hash: string;
};

interface BearerAuthenticateOpts extends AuthenticateOpts {
    users?: User[];
};

type Payload = {
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: number;
};

type BearerLoginOpts<P extends User> = LoginOpts & {
    users?: User[];
    payload: P & Payload;
};

export type {
    IBearerClass,
    BearerClassOptions,
    BearerAuthenticateOpts,

    Algorithm,
    User,
    BearerLoginOpts,
}