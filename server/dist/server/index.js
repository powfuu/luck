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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../src/environments/environment");
var port = 3002;
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
var urlencoded = require("body-parser").urlencoded;
var mysql = require("mysql");
var multer = require("multer");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var test = "";
var db = mysql.createPool({
    host: "localhost",
    user: "evercode",
    password: "7780558",
    database: "luck",
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../src/db/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_luck_' + file.originalname);
    }
});
var upload = multer({ storage: storage });
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
var generateToken = function (user) {
    return jwt.sign(user, environment_1.environment.environment.S3CRET_K3Y0);
};
var validateToken = function (req, res, next) {
    var token = req.headers['authorization'];
    if (!token) {
        console.log('Access denied');
    }
    else {
        jwt.verify(token, environment_1.environment.environment.S3CRET_K3Y0, function (err, user) {
            if (err) {
                console.log('Access denied, token expired or incorrect');
            }
            else {
                next();
            }
        });
    }
};
app.listen(port, function () {
    console.log("Started at PORT: " + port);
});
app.post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, fullName, password, salt, signup;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                fullName = req.body.fullName;
                password = req.body.password;
                return [4 /*yield*/, bcrypt.genSalt(15)];
            case 1:
                salt = _a.sent();
                return [4 /*yield*/, bcrypt.hash(password, salt)];
            case 2:
                password = _a.sent();
                signup = "INSERT INTO accounts(email, fullname, password)";
                db.query(signup, [email, fullName, password], function (err, result) {
                    if (err) {
                        res.send({ failed_signup: "Email already exists" });
                    }
                    else {
                        res.send({ success_signup: "Signup Successfully" });
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
