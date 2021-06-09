"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("utils/config"));
const tempPassword = 'Tt123456!!';
const cognito = new aws_sdk_1.default.CognitoIdentityServiceProvider({
    accessKeyId: config_1.default.AWS.ACCESS_KEY,
    secretAccessKey: config_1.default.AWS.SECRET_ACCESS_KEY,
    region: config_1.default.AWS.REGION,
});
// ------------------------------------
// Helpers
// ------------------------------------
const createCognitoUsername = (name) => {
    const fullName = name.replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
    const names = fullName.split(' ');
    const first_name = names[0].toLowerCase() || '';
    const time = `_${new Date().getTime()}`;
    return first_name + time;
};
const generatePassword = () => {
    let pass = '';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    for (let i = 0; i < 5; i += 1) {
        const rand = Math.floor(Math.random() * upperChars.length);
        pass += upperChars.substring(rand, rand + 1);
    }
    for (let i = 0; i < 5; i += 1) {
        const rand = Math.floor(Math.random() * lowerChars.length);
        pass += lowerChars.substring(rand, rand + 1);
    }
    for (let i = 0; i < 5; i += 1) {
        const rand = Math.floor(Math.random() * numbers.length);
        pass += numbers.substring(rand, rand + 1);
    }
    return pass;
};
// ------------------------------------
// Cognito
// ------------------------------------
/**
 * create user in cognito
 * default user account status "FORCE_CHANGE_PASSWORD"
 * @param {string} name
 * @param {sting} email
 */
const createUser = (name, email) => new Promise((resolve, reject) => {
    cognito.adminCreateUser({
        UserAttributes: [
            { Name: 'name', Value: name },
            { Name: 'email', Value: email },
            { Name: 'preferred_username', Value: name },
            { Name: 'email_verified', Value: 'true' },
        ],
        Username: name,
        UserPoolId: config_1.default.AWS.COGNITO.USER_POOL_ID,
        TemporaryPassword: tempPassword,
        MessageAction: 'SUPPRESS',
    }, (err, data) => {
        if (err) {
            // if the email has already been registered
            if (err.code === 'UsernameExistsException') {
                resolve({ isNewUser: false });
                return;
            }
            reject(err);
            return;
        }
        if (data && !data.User) {
            reject(new Error('user does not exists'));
            return;
        }
        resolve({ isNewUser: true });
    });
});
/**
 * get session to update account status
 * @param {sting} name
 */
const initiateAuth = (name) => __awaiter(void 0, void 0, void 0, function* () {
    cognito.adminInitiateAuth({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        UserPoolId: config_1.default.AWS.COGNITO.USER_POOL_ID,
        ClientId: config_1.default.AWS.COGNITO.CLIENT_ID,
        AuthParameters: {
            USERNAME: name,
            PASSWORD: tempPassword,
        },
    }, (err, data) => {
        if (err)
            return err;
        return data;
    });
});
/**
 * respond to auth challenge to update account status to "Confirm"
 * @param {string} challengeName
 * @param {sting} session
 */
const respondToAuthChallenge = (input) => __awaiter(void 0, void 0, void 0, function* () {
    cognito.adminRespondToAuthChallenge(Object.assign(Object.assign({}, input), { UserPoolId: config_1.default.AWS.COGNITO.USER_POOL_ID, ClientId: config_1.default.AWS.COGNITO.CLIENT_ID }), (err, data) => {
        if (err)
            return err;
        return data;
    });
});
// ------------------------------------
// Accessors
// ------------------------------------
/**
 * create user in cognito and verify account
 * @param {string} name
 * @param {string} email
 */
const createCognitoUser = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = createCognitoUsername(name);
        const { isNewUser } = yield createUser(username, email);
        if (isNewUser) {
            const { ChallengeName, Session } = yield initiateAuth(username);
            yield respondToAuthChallenge({
                ChallengeName,
                Session,
                ChallengeResponses: {
                    NEW_PASSWORD: generatePassword(),
                    USERNAME: username,
                },
            });
        }
        return { isNewUser };
    }
    catch (err) {
        return err;
    }
});
exports.default = {
    createCognitoUser,
};
//# sourceMappingURL=cognito.js.map