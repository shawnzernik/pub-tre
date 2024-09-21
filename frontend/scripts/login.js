/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/logic/AuthLogic.ts":
/*!********************************!*\
  !*** ./src/logic/AuthLogic.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthLogic: () => (/* binding */ AuthLogic)
/* harmony export */ });
/* harmony import */ var _JwtToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./JwtToken */ "./src/logic/JwtToken.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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

var AuthLogic = /** @class */ (function () {
    function AuthLogic() {
    }
    AuthLogic.tokenLogin = function (token, publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, err_1, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("AuthLogic.tokenLogin()");
                        payload = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, _JwtToken__WEBPACK_IMPORTED_MODULE_0__.JwtToken.verify(token, publicKey)];
                    case 2:
                        payload = _a.sent(); // Await the async function 
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        throw new Error(AuthLogic.invalidTokenMsg);
                    case 4:
                        if (!payload || !payload.data || !payload.data["user"] || !payload.data["securables"]) {
                            throw new Error(AuthLogic.invalidTokenMsg);
                        }
                        ret = new AuthLogic();
                        ret.user = payload.data["user"];
                        ret.securables = payload.data["securables"];
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    AuthLogic.invalidTokenMsg = "Invalid token!";
    return AuthLogic;
}());



/***/ }),

/***/ "./src/logic/JwtToken.ts":
/*!*******************************!*\
  !*** ./src/logic/JwtToken.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JwtToken: () => (/* binding */ JwtToken)
/* harmony export */ });
/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jose */ "./node_modules/jose/dist/browser/key/import.js");
/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jose */ "./node_modules/jose/dist/browser/jwt/verify.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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

var JwtToken = /** @class */ (function () {
    function JwtToken(data) {
        if (data === void 0) { data = undefined; }
        this.data = data;
    }
    // private static async importPublicKey(pemKey: string): Promise<CryptoKey> {
    //     const keyData = pemKey
    //         .replace(/-----BEGIN PUBLIC KEY-----/, '')
    //         .replace(/-----END PUBLIC KEY-----/, '')
    //         .replace(/\n/g, '');
    //     const binaryDerString = window.atob(keyData);
    //     const binaryDer = Uint8Array.from(binaryDerString, char => char.charCodeAt(0));
    //     return await importSPKI(binaryDer, 'RS512');
    // }
    JwtToken.importPublicKey = function (pemKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0,jose__WEBPACK_IMPORTED_MODULE_0__.importSPKI)(pemKey, 'RS512')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    JwtToken.verify = function (token, publicKeyPem) {
        return __awaiter(this, void 0, void 0, function () {
            var publicKey, payload, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, JwtToken.importPublicKey(publicKeyPem)];
                    case 1:
                        publicKey = _a.sent();
                        return [4 /*yield*/, (0,jose__WEBPACK_IMPORTED_MODULE_1__.jwtVerify)(token, publicKey, {
                                audience: JwtToken.audience,
                                issuer: JwtToken.issuer,
                                subject: JwtToken.subject,
                            })];
                    case 2:
                        payload = (_a.sent()).payload;
                        ret = new JwtToken(payload.data);
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    JwtToken.expiresIn = "1h";
    JwtToken.audience = "lagovistatech.com";
    JwtToken.issuer = "lagovistatech.com";
    JwtToken.subject = "jwt_token";
    return JwtToken;
}());



/***/ }),

/***/ "./src/pages/login.tsx":
/*!*****************************!*\
  !*** ./src/pages/login.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _components_Heading__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Heading */ "./src/components/Heading.tsx");
/* harmony import */ var _components_Navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/Navigation */ "./src/components/Navigation.tsx");
/* harmony import */ var _components_BasePage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/BasePage */ "./src/components/BasePage.tsx");
/* harmony import */ var _components_Form__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/Form */ "./src/components/Form.tsx");
/* harmony import */ var _components_Field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/Field */ "./src/components/Field.tsx");
/* harmony import */ var _components_StringInput__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/StringInput */ "./src/components/StringInput.tsx");
/* harmony import */ var _components_Button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/Button */ "./src/components/Button.tsx");
/* harmony import */ var _services_AuthService__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../services/AuthService */ "./src/services/AuthService.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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










var Page = /** @class */ (function (_super) {
    __extends(Page, _super);
    function Page(props) {
        var _this = _super.call(this, props) || this;
        _this.model = {
            emailAddress: "",
            password: ""
        };
        _this.state = __assign({}, _components_BasePage__WEBPACK_IMPORTED_MODULE_4__.BasePage.defaultState);
        _services_AuthService__WEBPACK_IMPORTED_MODULE_9__.AuthService.setToken("");
        return _this;
    }
    Page.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.events.setLoading(true)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        return [4 /*yield*/, _services_AuthService__WEBPACK_IMPORTED_MODULE_9__.AuthService.login(this.model.emailAddress, this.model.password)];
                    case 3:
                        token = _a.sent();
                        _services_AuthService__WEBPACK_IMPORTED_MODULE_9__.AuthService.setToken(token);
                        window.location.assign("copyright.html");
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _a.sent();
                        return [4 /*yield*/, this.events.setMessage({
                                title: "Error",
                                content: "".concat(err_1),
                                buttons: [{
                                        label: "OK", onClicked: function () {
                                        }
                                    }]
                            })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [4 /*yield*/, this.events.setLoading(false)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.render = function () {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Navigation__WEBPACK_IMPORTED_MODULE_3__.Navigation, { state: this.state, events: this.events, activeTopMenuGuid: "b9aeb1c2-4f07-4e91-bbef-25ed565b6ab3", activeLeftMenuGuid: "db0d6063-2266-4bfb-8c96-44dbb90cddf2", showMenu: false },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Heading__WEBPACK_IMPORTED_MODULE_2__.Heading, { level: 1 }, "Login"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Form__WEBPACK_IMPORTED_MODULE_5__.Form, null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_6__.Field, { size: 3, label: "Email Address" },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_StringInput__WEBPACK_IMPORTED_MODULE_7__.StringInput, { model: this.model, property: "emailAddress" })),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Field__WEBPACK_IMPORTED_MODULE_6__.Field, { size: 3, label: "Password" },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_StringInput__WEBPACK_IMPORTED_MODULE_7__.StringInput, { password: true, model: this.model, property: "password" }))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Form__WEBPACK_IMPORTED_MODULE_5__.Form, null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Button__WEBPACK_IMPORTED_MODULE_8__.Button, { label: "Login", onClick: this.login.bind(this) }))));
    };
    return Page;
}(_components_BasePage__WEBPACK_IMPORTED_MODULE_4__.BasePage));
window.addEventListener("load", function () {
    var element = document.getElementById('root');
    var root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(element);
    root.render(react__WEBPACK_IMPORTED_MODULE_0__.createElement(Page, null));
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"login": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcommon"] = self["webpackChunkcommon"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["common"], () => (__webpack_require__("./src/pages/login.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLENBQUMsQ0FBQzs7Ozs7OztVQ2pGSDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NKQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb21tb24vLi9zcmMvbG9naWMvQXV0aExvZ2ljLnRzIiwid2VicGFjazovL2NvbW1vbi8uL3NyYy9sb2dpYy9Kd3RUb2tlbi50cyIsIndlYnBhY2s6Ly9jb21tb24vLi9zcmMvcGFnZXMvbG9naW4udHN4Iiwid2VicGFjazovL2NvbW1vbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jb21tb24vd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9jb21tb24vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vY29tbW9uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jb21tb24vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jb21tb24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jb21tb24vd2VicGFjay9ydW50aW1lL25vZGUgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9jb21tb24vd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY29tbW9uL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY29tbW9uL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jb21tb24vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVzZXJEdG8gfSBmcm9tIFwiY29tbW9uL3NyYy9tb2RlbHMvVXNlckR0b1wiO1xuaW1wb3J0IHsgU2VjdXJhYmxlRHRvIH0gZnJvbSBcImNvbW1vbi9zcmMvbW9kZWxzL1NlY3VyYWJsZUR0b1wiO1xuaW1wb3J0IHsgSnd0VG9rZW4gfSBmcm9tIFwiLi9Kd3RUb2tlblwiO1xuXG5leHBvcnQgY2xhc3MgQXV0aExvZ2ljIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnZhbGlkVG9rZW5Nc2cgPSBcIkludmFsaWQgdG9rZW4hXCI7XG5cbiAgICBwdWJsaWMgdXNlcjogVXNlckR0byB8IHVuZGVmaW5lZDtcbiAgICBwdWJsaWMgc2VjdXJhYmxlczogU2VjdXJhYmxlRHRvW10gfCB1bmRlZmluZWQ7XG5cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHRva2VuTG9naW4odG9rZW46IHN0cmluZywgcHVibGljS2V5OiBzdHJpbmcpOiBQcm9taXNlPEF1dGhMb2dpYz4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkF1dGhMb2dpYy50b2tlbkxvZ2luKClcIik7XG5cbiAgICAgICAgbGV0IHBheWxvYWQgPSBudWxsO1xuICAgICAgICB0cnkgeyBcbiAgICAgICAgICAgIHBheWxvYWQgPSBhd2FpdCBKd3RUb2tlbi52ZXJpZnkodG9rZW4sIHB1YmxpY0tleSk7IC8vIEF3YWl0IHRoZSBhc3luYyBmdW5jdGlvbiBcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoQXV0aExvZ2ljLmludmFsaWRUb2tlbk1zZyk7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmRhdGEgfHwgIXBheWxvYWQuZGF0YVtcInVzZXJcIl0gfHwgIXBheWxvYWQuZGF0YVtcInNlY3VyYWJsZXNcIl0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihBdXRoTG9naWMuaW52YWxpZFRva2VuTXNnKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zdCByZXQgPSBuZXcgQXV0aExvZ2ljKCk7XG4gICAgICAgIHJldC51c2VyID0gcGF5bG9hZC5kYXRhW1widXNlclwiXSBhcyBVc2VyRHRvO1xuICAgICAgICByZXQuc2VjdXJhYmxlcyA9IHBheWxvYWQuZGF0YVtcInNlY3VyYWJsZXNcIl0gYXMgU2VjdXJhYmxlRHRvW107XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufSIsImltcG9ydCB7IFNpZ25KV1QsIGp3dFZlcmlmeSwgaW1wb3J0U1BLSSwgaW1wb3J0UEtDUzggfSBmcm9tICdqb3NlJztcblxuZXhwb3J0IGNsYXNzIEp3dFRva2VuIHtcbiAgICBwdWJsaWMgc3RhdGljIGV4cGlyZXNJbiA9IFwiMWhcIjtcbiAgICBwdWJsaWMgc3RhdGljIGF1ZGllbmNlID0gXCJsYWdvdmlzdGF0ZWNoLmNvbVwiO1xuICAgIHB1YmxpYyBzdGF0aWMgaXNzdWVyID0gXCJsYWdvdmlzdGF0ZWNoLmNvbVwiO1xuICAgIHB1YmxpYyBzdGF0aWMgc3ViamVjdCA9IFwiand0X3Rva2VuXCI7XG5cbiAgICBwdWJsaWMgZGF0YTogYW55O1xuICAgIFxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihkYXRhOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG5cbiAgICAvLyBwcml2YXRlIHN0YXRpYyBhc3luYyBpbXBvcnRQdWJsaWNLZXkocGVtS2V5OiBzdHJpbmcpOiBQcm9taXNlPENyeXB0b0tleT4ge1xuICAgIC8vICAgICBjb25zdCBrZXlEYXRhID0gcGVtS2V5XG4gICAgLy8gICAgICAgICAucmVwbGFjZSgvLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0vLCAnJylcbiAgICAvLyAgICAgICAgIC5yZXBsYWNlKC8tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0vLCAnJylcbiAgICAvLyAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJycpO1xuXG4gICAgLy8gICAgIGNvbnN0IGJpbmFyeURlclN0cmluZyA9IHdpbmRvdy5hdG9iKGtleURhdGEpO1xuICAgIC8vICAgICBjb25zdCBiaW5hcnlEZXIgPSBVaW50OEFycmF5LmZyb20oYmluYXJ5RGVyU3RyaW5nLCBjaGFyID0+IGNoYXIuY2hhckNvZGVBdCgwKSk7XG5cbiAgICAvLyAgICAgcmV0dXJuIGF3YWl0IGltcG9ydFNQS0koYmluYXJ5RGVyLCAnUlM1MTInKTtcbiAgICAvLyB9XG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgaW1wb3J0UHVibGljS2V5KHBlbUtleTogc3RyaW5nKTogUHJvbWlzZTxDcnlwdG9LZXk+IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGltcG9ydFNQS0kocGVtS2V5LCAnUlM1MTInKTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyB2ZXJpZnkodG9rZW46IHN0cmluZywgcHVibGljS2V5UGVtOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcHVibGljS2V5ID0gYXdhaXQgSnd0VG9rZW4uaW1wb3J0UHVibGljS2V5KHB1YmxpY0tleVBlbSk7XG5cbiAgICAgICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhd2FpdCBqd3RWZXJpZnkodG9rZW4sIHB1YmxpY0tleSwge1xuICAgICAgICAgICAgYXVkaWVuY2U6IEp3dFRva2VuLmF1ZGllbmNlLFxuICAgICAgICAgICAgaXNzdWVyOiBKd3RUb2tlbi5pc3N1ZXIsXG4gICAgICAgICAgICBzdWJqZWN0OiBKd3RUb2tlbi5zdWJqZWN0LFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXQgPSBuZXcgSnd0VG9rZW4ocGF5bG9hZC5kYXRhKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjcmVhdGVSb290IH0gZnJvbSBcInJlYWN0LWRvbS9jbGllbnRcIjtcbmltcG9ydCB7IEhlYWRpbmcgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9IZWFkaW5nXCI7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvTmF2aWdhdGlvblwiO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL01lc3NhZ2VcIjtcbmltcG9ydCB7IEJhc2VQYWdlLCBCYXNlUGFnZVN0YXRlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvQmFzZVBhZ2VcIjtcbmltcG9ydCB7IEZvcm0gfSBmcm9tIFwiLi4vY29tcG9uZW50cy9Gb3JtXCI7XG5pbXBvcnQgeyBMb2dpbkR0byB9IGZyb20gXCJjb21tb24vc3JjL21vZGVscy9Mb2dpbkR0b1wiO1xuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9GaWVsZFwiO1xuaW1wb3J0IHsgU3RyaW5nSW5wdXQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9TdHJpbmdJbnB1dFwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9BdXRoU2VydmljZVwiO1xuXG5pbnRlcmZhY2UgUHJvcHMgeyB9XG5pbnRlcmZhY2UgU3RhdGUgZXh0ZW5kcyBCYXNlUGFnZVN0YXRlIHtcbiAgICBsb2FkaW5nOiBib29sZWFuO1xuICAgIG1lc3NhZ2U6IE1lc3NhZ2UgfCBudWxsO1xufVxuXG5jbGFzcyBQYWdlIGV4dGVuZHMgQmFzZVBhZ2U8UHJvcHMsIFN0YXRlPiB7XG4gICAgcHJpdmF0ZSBtb2RlbDogTG9naW5EdG8gPSB7XG4gICAgICAgIGVtYWlsQWRkcmVzczogXCJcIixcbiAgICAgICAgcGFzc3dvcmQ6IFwiXCJcbiAgICB9XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJvcHM6IFByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgLi4uQmFzZVBhZ2UuZGVmYXVsdFN0YXRlXG4gICAgICAgIH07XG5cbiAgICAgICAgQXV0aFNlcnZpY2Uuc2V0VG9rZW4oXCJcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGxvZ2luKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmV2ZW50cy5zZXRMb2FkaW5nKHRydWUpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IEF1dGhTZXJ2aWNlLmxvZ2luKHRoaXMubW9kZWwuZW1haWxBZGRyZXNzLCB0aGlzLm1vZGVsLnBhc3N3b3JkKTtcbiAgICAgICAgICAgIEF1dGhTZXJ2aWNlLnNldFRva2VuKHRva2VuKTtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oXCJjb3B5cmlnaHQuaHRtbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmV2ZW50cy5zZXRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJFcnJvclwiLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGAke2Vycn1gLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk9LXCIsIG9uQ2xpY2tlZDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMuZXZlbnRzLnNldExvYWRpbmcoZmFsc2UpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKTogUmVhY3QuUmVhY3ROb2RlIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxOYXZpZ2F0aW9uIFxuICAgICAgICAgICAgICAgIHN0YXRlPXt0aGlzLnN0YXRlfSBldmVudHM9e3RoaXMuZXZlbnRzfVxuICAgICAgICAgICAgICAgIGFjdGl2ZVRvcE1lbnVHdWlkPVwiYjlhZWIxYzItNGYwNy00ZTkxLWJiZWYtMjVlZDU2NWI2YWIzXCJcbiAgICAgICAgICAgICAgICBhY3RpdmVMZWZ0TWVudUd1aWQ9XCJkYjBkNjA2My0yMjY2LTRiZmItOGM5Ni00NGRiYjkwY2RkZjJcIlxuICAgICAgICAgICAgICAgIHNob3dNZW51PXtmYWxzZX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8SGVhZGluZyBsZXZlbD17MX0+TG9naW48L0hlYWRpbmc+XG4gICAgICAgICAgICAgICAgPEZvcm0+XG4gICAgICAgICAgICAgICAgICAgIDxGaWVsZCBzaXplPXszfSBsYWJlbD1cIkVtYWlsIEFkZHJlc3NcIj48U3RyaW5nSW5wdXQgbW9kZWw9e3RoaXMubW9kZWx9IHByb3BlcnR5PVwiZW1haWxBZGRyZXNzXCIgLz48L0ZpZWxkPlxuICAgICAgICAgICAgICAgICAgICA8RmllbGQgc2l6ZT17M30gbGFiZWw9XCJQYXNzd29yZFwiPjxTdHJpbmdJbnB1dCBwYXNzd29yZD17dHJ1ZX0gbW9kZWw9e3RoaXMubW9kZWx9IHByb3BlcnR5PVwicGFzc3dvcmRcIiAvPjwvRmllbGQ+XG4gICAgICAgICAgICAgICAgPC9Gb3JtPlxuICAgICAgICAgICAgICAgIDxGb3JtPlxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGxhYmVsPVwiTG9naW5cIiBvbkNsaWNrPXt0aGlzLmxvZ2luLmJpbmQodGhpcyl9IC8+XG4gICAgICAgICAgICAgICAgPC9Gb3JtPlxuICAgICAgICAgICAgPC9OYXZpZ2F0aW9uPlxuICAgICAgICApO1xuICAgIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcbiAgICBjb25zdCByb290ID0gY3JlYXRlUm9vdChlbGVtZW50KTtcbiAgICByb290LnJlbmRlcig8UGFnZSAvPilcbn0pO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubm1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUucGF0aHMgPSBbXTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJsb2dpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjb21tb25cIl0gPSBzZWxmW1wid2VicGFja0NodW5rY29tbW9uXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJjb21tb25cIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvcGFnZXMvbG9naW4udHN4XCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=