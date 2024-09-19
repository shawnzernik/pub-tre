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

/***/ "./src/pages/copyright.tsx":
/*!*********************************!*\
  !*** ./src/pages/copyright.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _components_Navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Navigation */ "./src/components/Navigation.tsx");
/* harmony import */ var _components_BasePage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/BasePage */ "./src/components/BasePage.tsx");
/* harmony import */ var _components_Heading__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Heading */ "./src/components/Heading.tsx");
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





var Page = /** @class */ (function (_super) {
    __extends(Page, _super);
    function Page() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Page.prototype.render = function () {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Navigation__WEBPACK_IMPORTED_MODULE_2__.Navigation, { state: this.state, events: this.events, activeTopMenuGuid: "b9aeb1c2-4f07-4e91-bbef-25ed565b6ab3", activeLeftMenuGuid: "5a8a209b-e6c1-42e4-8bc9-f144feec6d8e" },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Heading__WEBPACK_IMPORTED_MODULE_4__.Heading, { level: 1 }, "TypeScript React Express"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "Copyright \u00A9 2024 Shawn Zernik"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version."),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details."),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.")));
    };
    return Page;
}(_components_BasePage__WEBPACK_IMPORTED_MODULE_3__.BasePage));
window.onload = function () {
    var element = document.getElementById('root');
    var root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(element);
    root.render(react__WEBPACK_IMPORTED_MODULE_0__.createElement(Page, null));
};


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
/******/ 			"copyright": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["common"], () => (__webpack_require__("./src/pages/copyright.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY29tbW9uLy4vc3JjL2xvZ2ljL0F1dGhMb2dpYy50cyIsIndlYnBhY2s6Ly9jb21tb24vLi9zcmMvbG9naWMvSnd0VG9rZW4udHMiLCJ3ZWJwYWNrOi8vY29tbW9uLy4vc3JjL3BhZ2VzL2NvcHlyaWdodC50c3giLCJ3ZWJwYWNrOi8vY29tbW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NvbW1vbi93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NvbW1vbi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jb21tb24vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NvbW1vbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NvbW1vbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NvbW1vbi93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2NvbW1vbi93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jb21tb24vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jb21tb24vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NvbW1vbi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVXNlckR0byB9IGZyb20gXCJjb21tb24vc3JjL21vZGVscy9Vc2VyRHRvXCI7XG5pbXBvcnQgeyBTZWN1cmFibGVEdG8gfSBmcm9tIFwiY29tbW9uL3NyYy9tb2RlbHMvU2VjdXJhYmxlRHRvXCI7XG5pbXBvcnQgeyBKd3RUb2tlbiB9IGZyb20gXCIuL0p3dFRva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBBdXRoTG9naWMge1xuICAgIHByaXZhdGUgc3RhdGljIGludmFsaWRUb2tlbk1zZyA9IFwiSW52YWxpZCB0b2tlbiFcIjtcblxuICAgIHB1YmxpYyB1c2VyOiBVc2VyRHRvIHwgdW5kZWZpbmVkO1xuICAgIHB1YmxpYyBzZWN1cmFibGVzOiBTZWN1cmFibGVEdG9bXSB8IHVuZGVmaW5lZDtcblxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgdG9rZW5Mb2dpbih0b2tlbjogc3RyaW5nLCBwdWJsaWNLZXk6IHN0cmluZyk6IFByb21pc2U8QXV0aExvZ2ljPiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aExvZ2ljLnRva2VuTG9naW4oKVwiKTtcblxuICAgICAgICBsZXQgcGF5bG9hZCA9IG51bGw7XG4gICAgICAgIHRyeSB7IFxuICAgICAgICAgICAgcGF5bG9hZCA9IGF3YWl0IEp3dFRva2VuLnZlcmlmeSh0b2tlbiwgcHVibGljS2V5KTsgLy8gQXdhaXQgdGhlIGFzeW5jIGZ1bmN0aW9uIFxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihBdXRoTG9naWMuaW52YWxpZFRva2VuTXNnKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuZGF0YSB8fCAhcGF5bG9hZC5kYXRhW1widXNlclwiXSB8fCAhcGF5bG9hZC5kYXRhW1wic2VjdXJhYmxlc1wiXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEF1dGhMb2dpYy5pbnZhbGlkVG9rZW5Nc2cpO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBBdXRoTG9naWMoKTtcbiAgICAgICAgcmV0LnVzZXIgPSBwYXlsb2FkLmRhdGFbXCJ1c2VyXCJdIGFzIFVzZXJEdG87XG4gICAgICAgIHJldC5zZWN1cmFibGVzID0gcGF5bG9hZC5kYXRhW1wic2VjdXJhYmxlc1wiXSBhcyBTZWN1cmFibGVEdG9bXTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59IiwiaW1wb3J0IHsgU2lnbkpXVCwgand0VmVyaWZ5LCBpbXBvcnRTUEtJLCBpbXBvcnRQS0NTOCB9IGZyb20gJ2pvc2UnO1xuXG5leHBvcnQgY2xhc3MgSnd0VG9rZW4ge1xuICAgIHB1YmxpYyBzdGF0aWMgZXhwaXJlc0luID0gXCIxaFwiO1xuICAgIHB1YmxpYyBzdGF0aWMgYXVkaWVuY2UgPSBcImxhZ292aXN0YXRlY2guY29tXCI7XG4gICAgcHVibGljIHN0YXRpYyBpc3N1ZXIgPSBcImxhZ292aXN0YXRlY2guY29tXCI7XG4gICAgcHVibGljIHN0YXRpYyBzdWJqZWN0ID0gXCJqd3RfdG9rZW5cIjtcblxuICAgIHB1YmxpYyBkYXRhOiBhbnk7XG4gICAgXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGRhdGE6IGFueSA9IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIH1cblxuICAgIC8vIHByaXZhdGUgc3RhdGljIGFzeW5jIGltcG9ydFB1YmxpY0tleShwZW1LZXk6IHN0cmluZyk6IFByb21pc2U8Q3J5cHRvS2V5PiB7XG4gICAgLy8gICAgIGNvbnN0IGtleURhdGEgPSBwZW1LZXlcbiAgICAvLyAgICAgICAgIC5yZXBsYWNlKC8tLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLS8sICcnKVxuICAgIC8vICAgICAgICAgLnJlcGxhY2UoLy0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLS8sICcnKVxuICAgIC8vICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCAnJyk7XG5cbiAgICAvLyAgICAgY29uc3QgYmluYXJ5RGVyU3RyaW5nID0gd2luZG93LmF0b2Ioa2V5RGF0YSk7XG4gICAgLy8gICAgIGNvbnN0IGJpbmFyeURlciA9IFVpbnQ4QXJyYXkuZnJvbShiaW5hcnlEZXJTdHJpbmcsIGNoYXIgPT4gY2hhci5jaGFyQ29kZUF0KDApKTtcblxuICAgIC8vICAgICByZXR1cm4gYXdhaXQgaW1wb3J0U1BLSShiaW5hcnlEZXIsICdSUzUxMicpO1xuICAgIC8vIH1cbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBpbXBvcnRQdWJsaWNLZXkocGVtS2V5OiBzdHJpbmcpOiBQcm9taXNlPENyeXB0b0tleT4ge1xuICAgICAgICByZXR1cm4gYXdhaXQgaW1wb3J0U1BLSShwZW1LZXksICdSUzUxMicpO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHZlcmlmeSh0b2tlbjogc3RyaW5nLCBwdWJsaWNLZXlQZW06IHN0cmluZykge1xuICAgICAgICBjb25zdCBwdWJsaWNLZXkgPSBhd2FpdCBKd3RUb2tlbi5pbXBvcnRQdWJsaWNLZXkocHVibGljS2V5UGVtKTtcblxuICAgICAgICBjb25zdCB7IHBheWxvYWQgfSA9IGF3YWl0IGp3dFZlcmlmeSh0b2tlbiwgcHVibGljS2V5LCB7XG4gICAgICAgICAgICBhdWRpZW5jZTogSnd0VG9rZW4uYXVkaWVuY2UsXG4gICAgICAgICAgICBpc3N1ZXI6IEp3dFRva2VuLmlzc3VlcixcbiAgICAgICAgICAgIHN1YmplY3Q6IEp3dFRva2VuLnN1YmplY3QsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBKd3RUb2tlbihwYXlsb2FkLmRhdGEpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn0iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNyZWF0ZVJvb3QgfSBmcm9tIFwicmVhY3QtZG9tL2NsaWVudFwiO1xuaW1wb3J0IHsgTmF2aWdhdGlvbiB9IGZyb20gXCIuLi9jb21wb25lbnRzL05hdmlnYXRpb25cIjtcbmltcG9ydCB7IEJhc2VQYWdlLCBCYXNlUGFnZVN0YXRlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvQmFzZVBhZ2VcIjtcbmltcG9ydCB7IEhlYWRpbmcgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9IZWFkaW5nXCI7XG5cbmludGVyZmFjZSBQcm9wcyB7IH1cbmludGVyZmFjZSBTdGF0ZSBleHRlbmRzIEJhc2VQYWdlU3RhdGUgeyB9XG5cbmNsYXNzIFBhZ2UgZXh0ZW5kcyBCYXNlUGFnZTxQcm9wcywgU3RhdGU+IHtcbiAgICBwdWJsaWMgcmVuZGVyKCk6IFJlYWN0LlJlYWN0Tm9kZSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8TmF2aWdhdGlvblxuICAgICAgICAgICAgICAgIHN0YXRlPXt0aGlzLnN0YXRlfSBldmVudHM9e3RoaXMuZXZlbnRzfVxuICAgICAgICAgICAgICAgIGFjdGl2ZVRvcE1lbnVHdWlkPVwiYjlhZWIxYzItNGYwNy00ZTkxLWJiZWYtMjVlZDU2NWI2YWIzXCJcbiAgICAgICAgICAgICAgICBhY3RpdmVMZWZ0TWVudUd1aWQ9XCI1YThhMjA5Yi1lNmMxLTQyZTQtOGJjOS1mMTQ0ZmVlYzZkOGVcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxIZWFkaW5nIGxldmVsPXsxfT5UeXBlU2NyaXB0IFJlYWN0IEV4cHJlc3M8L0hlYWRpbmc+XG4gICAgICAgICAgICAgICAgPHA+Q29weXJpZ2h0ICZjb3B5OyAyMDI0IFNoYXduIFplcm5pazwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgICAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICAgICAgICAgICAgICAgICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXNcbiAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlXG4gICAgICAgICAgICAgICAgICAgIExpY2Vuc2UsIG9yIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICAgICAgICAgICAgICAgICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICAgICAgICAgICAgICAgICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgICAgICAgICAgICAgICAgICBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgICAgICAgICAgICAgICAgICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlICZsdDtodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLyZndDsuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9OYXZpZ2F0aW9uPlxuICAgICAgICApO1xuICAgIH1cbn1cblxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcbiAgICBjb25zdCByb290ID0gY3JlYXRlUm9vdChlbGVtZW50KTtcbiAgICByb290LnJlbmRlcig8UGFnZSAvPilcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiY29weXJpZ2h0XCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NvbW1vblwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjb21tb25cIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcImNvbW1vblwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wYWdlcy9jb3B5cmlnaHQudHN4XCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=