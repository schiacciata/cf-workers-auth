interface IBaseClass {
    isEnabled: boolean;
    debug: boolean;
    users: User[];
    isAuthenticated(opts: AuthenticateOpts): boolean | Promise<boolean>;
    login(_opts: LoginOpts): any;
};
interface BaseClassOptions {
    isEnabled?: boolean;
    debug?: boolean;
    users?: User[];
};

type User = {
    username: string;
    password: string;
};

type AuthenticateOpts = {
    request: Request;
}

type LoginOpts = {};

export type {
    IBaseClass,
    BaseClassOptions,
    User,

    AuthenticateOpts,
    LoginOpts,
}