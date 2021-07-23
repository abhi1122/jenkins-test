const jwt = require("jsonwebtoken");
const tableData = require("../../table-data/index");
const config = require("config");

class Support {

    constructor() {}

    async login(req) {
        const {
            supportTeam
        } = tableData;

        if (!req.body.id || !req.body.password) {
            return this.loginFailed();
        }

        let supportInfo = supportTeam.find((val) => val.id == req.body.id);

        if (!supportInfo) {
            return this.loginFailed();
        }

        if (supportInfo.password !== req.body.password) {
            return this.loginFailed();
        }

        const token = jwt.sign({
                id: supportInfo.id,
            },
            config.get('secret'), {
                expiresIn: 86400,
            }
        );
        let support = {
            ...supportInfo
        };
        delete support.password;
        support['token'] = token;
        return {
            status: 200,
            message: "login successfully",
            isAuthenticated: true,
            data: support,
        };
    }

    loginFailed() {
        return {
            status: 401,
            message: "Enter User Credentials!",
            isAuthenticated: false,
        };
    }

    async supportList() {
        const support = JSON.parse(JSON.stringify(tableData.supportTeam));
        support.forEach(obj => delete obj.password);
        return support;
    }

    async getQa() {
        return tableData.QaTable;
    }

}

module.exports.Support = Support;