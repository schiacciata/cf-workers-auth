import { IBaseClass, BaseClassOptions, AuthenticateOpts, LoginOpts, User } from "../types/Base";

abstract class BaseAuthenticator implements IBaseClass {
    isEnabled: boolean;
    debug: boolean;
    users: User[];
    constructor(options: BaseClassOptions) {
        this.isEnabled = options.isEnabled || true;
        this.debug = options.debug || false;
        this.users = options.users || [];
    };

    isAuthenticated(_opts: AuthenticateOpts): boolean | Promise<boolean> {
        throw new Error('Not implemented');
    };

    login(_opts: LoginOpts): any {
        throw new Error('Not implemented');
    };
}

export default BaseAuthenticator;