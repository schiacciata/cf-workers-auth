import { AuthenticateOpts, BaseClassOptions, IBaseClass, LoginOpts, User } from "./Base";

interface IBasicClass extends IBaseClass {};

interface BasicClassOptions extends BaseClassOptions {};

interface BasicAuthenticateOpts extends AuthenticateOpts {
    users?: User[];
};

type BasicLoginOpts = LoginOpts & User & {
    users?: User[];
};

export type {
    IBasicClass,
    BasicClassOptions,
    BasicAuthenticateOpts,

    User,
    BasicLoginOpts,
}