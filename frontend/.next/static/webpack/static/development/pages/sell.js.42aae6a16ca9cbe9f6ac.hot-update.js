webpackHotUpdate("static/development/pages/sell.js",{

/***/ "./components/PleaseSignin.js":
/*!************************************!*\
  !*** ./components/PleaseSignin.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_adopt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-adopt */ "./node_modules/react-adopt/dist/index.m.js");
/* harmony import */ var _User__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./User */ "./components/User.js");
/* harmony import */ var _Signin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Signin */ "./components/Signin.js");
var _jsxFileName = "/Users/emilybaumgartner/Desktop/Advanced-React/sick-fits/frontend/components/PleaseSignin.js";





var PleaseSignin = function PleaseSignin(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_adopt__WEBPACK_IMPORTED_MODULE_1__["Query"], {
    query: _User__WEBPACK_IMPORTED_MODULE_2__["CURRENT_USER_QUERY"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: this
  }, function (data, loading) {
    if (loading) return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 8
      },
      __self: this
    }, "Loading..."); //   if (!data.me) {
    //     return (
    //       <div>
    //         <p>Please sign in before continuing</p>
    //         <Signin />
    //       </div>
    //     );
    //   }

    return props.children;
  });
};

/* harmony default export */ __webpack_exports__["default"] = (PleaseSignin);

/***/ })

})
//# sourceMappingURL=sell.js.42aae6a16ca9cbe9f6ac.hot-update.js.map