import React from "react";
// repOP ? repOP.id : "..."
// {repOP ? repOP.descripcion : "..."}

const VistaWeb = ({ repOP }) => {
 
  return (
    <>
  {/* saved from url=(0035)http://localhost:3000/views/op/1/34 */}
  <link
    type="text/css"
    id="dark-mode"
    rel="stylesheet"
    href="http://localhost:3000/views/op/1/34"
  />
  <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
  <link type="text/css" rel="stylesheet" href="./34_files/sheet.css" />
  <style
    type="text/css"
    dangerouslySetInnerHTML={{
      __html:
        "\n    .ritz .waffle a {\n        color: inherit;\n    }\n    \n    .ritz .waffle .s18 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s18n {\n        border-bottom: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-weight: bold;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s50 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s53 {\n        background-color: #ffffff;\n        border-left: 1px SOLID #000000;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s53bis {\n        background-color: #ffffff;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s30 {\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s30l {\n        background-color: #ffffff;\n        border-left: 1px SOLID #000000;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s57 {\n        border-bottom: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s41 {\n        border-left: none;\n        border-right: none;\n        background-color: #ffffff;\n        border-left: 1px SOLID #000000;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s29 {\n        border-bottom: 2px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s44 {\n        border-bottom: 2px SOLID #000000;\n        background-color: #ffffff;\n        border-left: 1px SOLID #000000;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s25 {\n        background-color: #ffffff;\n        border-left: 1px SOLID #000000;\n        text-align: left;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s5 {\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 11pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s6 {\n        background-color: #ffffff;\n        text-align: center;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 8pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s6l {\n        background-color: #ffffff;\n        border-left: 1px SOLID #000000;\n        text-align: center;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 8pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s20 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: right;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s35 {\n        background-color: #ffffff;\n        text-align: left;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: top;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s8 {\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 8pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s23 {\n        border-bottom: 2px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s51 {\n        background-color: #ffffff;\n        text-align: left;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 11pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s14 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        background-color: #d8d8d8;\n        text-align: center;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s47 {\n        border-bottom: 2px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 8pt;\n        vertical-align: bottom;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s11 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #d8d8d8;\n        text-align: center;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s11l {\n        border-bottom: 1px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #d8d8d8;\n        text-align: center;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s17 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: normal;\n        overflow: hidden;\n        word-wrap: break-word;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s19 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s43 {\n        background-color: #ffffff;\n        text-align: right;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s0 {\n        border-bottom: 2px SOLID #000000;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 14pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s0l {\n        border-bottom: 2px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 14pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s0i {\n        border-bottom: 2px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        text-align: left;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 14pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s54 {\n        background-color: #ffffff;\n        text-align: left;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s40 {\n        border-bottom: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s49 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s39 {\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s24 {\n        border-bottom: 2px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 10pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s10 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 8pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s33 {\n        border-left: none;\n        background-color: #ffffff;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s13 {\n        border-left: none;\n        border-bottom: 1px SOLID #000000;\n        background-color: #d8d8d8;\n        text-align: center;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s56 {\n        border-bottom: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: top;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s7 {\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 8pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s31 {\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s26 {\n        border-bottom: 2px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 8pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s2 {\n        border-bottom: 1px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 14pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s15 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s15l {\n        border-bottom: 1px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s34 {\n        border-left: none;\n        border-bottom: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s52 {\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 11pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s38 {\n        border-bottom: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s45 {\n        border-bottom: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s9 {\n        border-bottom: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 8pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s9l {\n        border-bottom: 1px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 8pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s37 {\n        background-color: #ffffff;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s37l {\n        background-color: #ffffff;\n        border-left: 1px SOLID #000000;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s46 {\n        border-bottom: 2px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s55 {\n        border-bottom: 2px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: top;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s16 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        text-decoration: underline;\n        -webkit-text-decoration-skip: none;\n        text-decoration-skip-ink: none;\n        color: #1155cc;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s21 {\n        border-bottom: 2px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s28 {\n        border-bottom: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: right;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s22 {\n        border-bottom: 2px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s27 {\n        border-bottom: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s36 {\n        border-right: none;\n        background-color: #ffffff;\n        text-align: right;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s48 {\n        border-bottom: 1px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s48l {\n        border-bottom: 1px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s48c {\n        border-bottom: 1px SOLID #000000;\n        border-left: 1px SOLID #000000;\n        border-right: 1px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s48n {\n        border-bottom: 1px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-weight: bold;\n        font-size: 6pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s3 {\n        border-bottom: 1px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        background-color: #ffffff;\n        text-align: center;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 14pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s4 {\n        background-color: #ffffff;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 11pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s4l {\n        background-color: #ffffff;\n        border-left: 1px SOLID #000000;\n        text-align: left;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 11pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s1 {\n        border-bottom: 2px SOLID #000000;\n        border-right: 2px SOLID #000000;\n        text-align: center;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 14pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s12 {\n        border-right: none;\n        border-bottom: 1px SOLID #000000;\n        background-color: #d8d8d8;\n        text-align: center;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s42 {\n        border-left: none;\n        border-bottom: 2px SOLID #000000;\n        background-color: rgb(182, 181, 181);\n        text-align: center;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 8pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n    \n    .ritz .waffle .s32 {\n        border-right: none;\n        background-color: #ffffff;\n        text-align: left;\n        font-weight: bold;\n        color: #000000;\n        font-family: 'docs-Calibri', Arial;\n        font-size: 7pt;\n        vertical-align: middle;\n        white-space: nowrap;\n        direction: ltr;\n        padding: 0px 3px 0px 3px;\n    }\n"
    }}
  />
  <div className="ritz grid-container" dir="ltr">
    <table className="waffle no-grid" cellSpacing={0} cellPadding={0}>
      <thead>
        <tr>
          <th
            id="863323947C0"
            style={{ width: 38 }}
            className="column-headers-background"
          />
          <th
            id="863323947C1"
            style={{ width: 44 }}
            className="column-headers-background"
          />
          <th
            id="863323947C2"
            style={{ width: 99 }}
            className="column-headers-background"
          />
          <th
            id="863323947C3"
            style={{ width: 52 }}
            className="column-headers-background"
          />
          <th
            id="863323947C4"
            style={{ width: 53 }}
            className="column-headers-background"
          />
          <th
            id="863323947C5"
            style={{ width: 67 }}
            className="column-headers-background"
          />
        </tr>
      </thead>
      <tbody>
        <tr style={{ height: 45, backgroundColor: "DarkGreen" }}>
          <td
            style={{
              color: "#fff",
              fontFamily: '"docs-Calibri", Arial',
              fontSize: "10pt",
              textAlign: "center"
            }}
            colSpan={6}
          >
            <img width="50%" src="./34_files/logo_fide_1.png" />
          </td>
        </tr>
        <tr style={{ height: 35 }}>
          <td className="s2 " dir="ltr " colSpan={5}>
            SOLICITUD DE PAGO Nº
          </td>
          <td className="s3 " dir="ltr ">
            55
          </td>
        </tr>
        <tr style={{ height: 7 }}>
          <td className="s4l " />
          <td className="s4 " />
          <td className="s4 " />
          <td className="s4 " />
          <td className="s4 " />
          <td className="s5 " />
        </tr>
        <tr style={{ height: 26 }}>
          <td className="s6l " />
          <td className="s7 " />
          <td className="s7 " />
          <td className="s7 " />
          <td className="s6 ">Fecha</td>
          <td className="s8 " dir="ltr ">
            1/10/2021
          </td>
        </tr>
        <tr style={{ height: 5 }}>
          <td className="s9l " />
          <td className="s9 " />
          <td className="s9 " />
          <td className="s9 " />
          <td className="s9 " />
          <td className="s10 " />
        </tr>
        <tr style={{ height: 24 }}>
          <td className="s11l " colSpan={2}>
            Proveedor
          </td>
          <td className="s11 ">Detalle</td>
          <td className="s11 ">Nº Factura</td>
          <td className="s11 ">Nº OC</td>
          <td className="s14 ">Importe</td>
        </tr>
        <tr style={{ height: 24 }}>
          <td className="s15l " dir="ltr " colSpan={2}>
            Abelson s.a.
          </td>
          <td className="s16 " dir="ltr "></td>
          <td className="s17 " dir="ltr ">
            555
          </td>
          <td className="s18 " />
          <td className="s19 " dir="ltr ">
            55000.00
          </td>
        </tr>
        <tr style={{ height: 24 }}>
          <td className="s15l " dir="ltr " colSpan={2}>
            Abelson s.a.
          </td>
          <td className="s16 " dir="ltr "></td>
          <td className="s17 " dir="ltr ">
            20
          </td>
          <td className="s18 " />
          <td className="s19 " dir="ltr ">
            40000.00
          </td>
        </tr>
        <tr style={{ height: 24 }}>
          <td className="s15l " dir="ltr " colSpan={2}></td>
          <td className="s16 " dir="ltr "></td>
          <td className="s17 " dir="ltr "></td>
          <td className="s18 " />
          <td className="s19 " dir="ltr "></td>
        </tr>
        <tr style={{ height: 24 }}>
          <td className="s15l " dir="ltr " colSpan={2}></td>
          <td className="s16 " dir="ltr "></td>
          <td className="s17 " dir="ltr "></td>
          <td className="s18 " />
          <td className="s19 " dir="ltr "></td>
        </tr>
        <tr style={{ height: 24 }}>
          <td className="s15l " dir="ltr " colSpan={2}></td>
          <td className="s16 " dir="ltr "></td>
          <td className="s17 " dir="ltr "></td>
          <td className="s18 " />
          <td className="s19 " dir="ltr "></td>
        </tr>
        <tr style={{ height: 24 }}>
          <td className="s21 " dir="ltr " colSpan={2} />
          <td className="s22 " />
          <td className="s22 " />
          <td className="s22 " />
          <td className="s23 " />
        </tr>
        <tr style={{ height: 29 }}>
          <td className="s24 " dir="ltr " colSpan={6}>
            APROBACION TECNICA
          </td>
        </tr>
        <tr style={{ height: 19 }}>
          <td className="s25 " colSpan={5}>
            Detalles:
          </td>
          {/* td class="s7 "></td>
          <td class="s7 "></td>
          <td class="s7 "></td */}
          <td className="s8 " />
        </tr>
        <tr style={{ height: 25 }}>
          <td className="s26 " />
          <td colSpan={2} className="s27 ">
            dddd
          </td>
          {/* td class="s27 "></td */}
          <td className="s27 " />
          <td className="s28 " dir="ltr ">
            Aprobado por
          </td>
          <td className="s29 " dir="ltr ">
            martin
          </td>
        </tr>
        <tr style={{ height: 29 }}>
          <td className="s24 " dir="ltr " colSpan={6}>
            APROBACIÓN ADMINISTRATIVA
          </td>
        </tr>
        <tr style={{ height: 9 }}>
          <td className="s30l " />
          <td className="s30 " />
          <td className="s30 " />
          <td className="s30 " />
          <td className="s30 " />
          <td className="s31 " />
        </tr>
        <tr style={{ height: 24 }}>
          <td className="s37l " />
          <td className="s37 " dir="ltr ">
            FACTURAS:
          </td>
          <td className="s38 " dir="ltr ">
            95000.00
          </td>
          <td className="s30 " />
          <td className="s30 " />
          <td className="s31 " />
        </tr>
        <tr style={{ height: 24 }}>
          <td className="s37l " />
          <td className="s37 " dir="ltr ">
            RET SUSS:
          </td>
          <td className="s38 " dir="ltr ">
            10000.00
          </td>
          <td className="s30 " />
          <td className="s30 " />
          <td className="s31 " />
        </tr>
        <tr style={{ height: 24 }}>
          <td className="s37l " />
          <td className="s37 " dir="ltr ">
            RET GAN:
          </td>
          <td className="s38 " dir="ltr ">
            10000.00
          </td>
          <td className="s30 " />
          <td className="s30 " />
          <td className="s31 " />
        </tr>
        <tr style={{ height: 24 }}>
          <td className="s37l " />
          <td className="s37 " dir="ltr ">
            RET IVA:
          </td>
          <td className="s38 " dir="ltr ">
            10000.00
          </td>
          <td className="s30 " />
          <td className="s30 " />
          <td className="s31 " />
        </tr>
        <tr style={{ height: 9 }}>
          <td className="s37l " />
          <td className="s39 " />
          <td className="s40 " />
          <td className="s30 " />
          <td className="s30 " />
          <td className="s31 " />
        </tr>
        <tr style={{ height: 25 }}>
          <td className="s41 " />
          <td className="s33 softmerge " dir="ltr ">
            <div
              className="softmerge-inner "
              style={{ width: 87, left: "-46px" }}
            >
              Monto a Abonar{" "}
            </div>
          </td>
          <td className="s42 ">$ 65000.00</td>
          <td className="s37 " />
          <td className="s43 " dir="ltr ">
            Aprobado por
          </td>
          <td className="s31 " dir="ltr "></td>
        </tr>
        <tr style={{ height: 9 }}>
          <td className="s44 " />
          <td className="s45 " />
          <td className="s45 " />
          <td className="s45 " />
          <td className="s45 " />
          <td className="s46 " />
        </tr>
        <tr style={{ height: 29 }}>
          <td className="s24 " colSpan={6}>
            PAGO
          </td>
        </tr>
        <tr style={{ height: 23 }}>
          <td className="s47 " colSpan={6}>
            VALORES
          </td>
        </tr>
        <tr style={{ height: 19 }}>
          <td className="s49 ">BANCO</td>
          <td className="s18n ">NRO</td>
          <td className="s18n " />
          <td className="s18n ">FECHA</td>
          <td className="s18n " />
          <td className="s48n ">MONTO</td>
        </tr>
        <tr style={{ height: 19 }}>
          <td className="s48l " dir="ltr ">
            b11
          </td>
          <td className="s18 ">11</td>
          <td className="s18 " dir="ltr ">
            dd1
          </td>
          <td className="s18 " dir="ltr ">
            f11
          </td>
          <td className="s18 " />
          <td className="s19 " dir="ltr ">
            33.00
          </td>
        </tr>
        <tr style={{ height: 19 }}>
          <td className="s48l " dir="ltr ">
            b22
          </td>
          <td className="s18 ">22</td>
          <td className="s18 " dir="ltr ">
            dd2
          </td>
          <td className="s18 " dir="ltr ">
            f22
          </td>
          <td className="s18 " />
          <td className="s19 " dir="ltr ">
            44.00
          </td>
        </tr>
        <tr style={{ height: 19 }}>
          <td className="s48l " dir="ltr ">
            b33
          </td>
          <td className="s18 ">33</td>
          <td className="s18 " dir="ltr ">
            dd3
          </td>
          <td className="s18 " dir="ltr ">
            f33
          </td>
          <td className="s18 " />
          <td className="s19 " dir="ltr ">
            55.00
          </td>
        </tr>
        <tr style={{ height: 19 }}>
          <td className="s48l " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s19 " />
        </tr>
        <tr style={{ height: 19 }}>
          <td className="s48l " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s19 " />
        </tr>
        <tr style={{ height: 19 }}>
          <td className="s48l " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s19 " />
        </tr>
        <tr style={{ height: 19 }}>
          <td className="s48l " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s18 " />
          <td className="s19 " />
        </tr>
        <tr style={{ height: 19 }}>
          <td className="s48l " />
          <td className="s50 " />
          <td className="s50 " />
          <td className="s50 " />
          <td className="s18 " />
          <td className="s19 " />
        </tr>
        <tr style={{ height: 4 }}>
          <td className="s53 " />
          <td className="s51 " />
          <td className="s51 " />
          <td className="s4 " />
          <td className="s4 " />
          <td className="s52 " />
        </tr>
        <tr style={{ height: 31 }}>
          <td className="s53 " dir="ltr ">
            CBU:
          </td>
          <td className="s54 " dir="ltr ">
            0070088720000002642004
          </td>
          <td className="s54 " dir="ltr ">
            Cuenta Bancaria: 2642-0088-0
          </td>
          <td className="s53bis " colSpan={2}>
            TOTAL:
          </td>
          <td className="s31 ">$ 198.00</td>
        </tr>
        <tr style={{ height: 14 }}>
          <td className="s55 " dir="ltr ">
            CUIT:
          </td>
          <td className="s56 softmerge " dir="ltr ">
            <div
              className="softmerge-inner "
              style={{ width: 41, left: "-1px" }}
            >
              30652000076
            </div>
          </td>
          <td colSpan={2} className="s56 " dir="ltr ">
            Email: &nbsp; test@verelmail.com
          </td>
          <td className="s57 "></td>
          {/* td class="s57 "></td */}
          <td className="s29 " />
        </tr>
      </tbody>
    </table>
  </div>
</>
  );
};

export default VistaWeb;