// ace-builds ships type declarations but does not point at them from its
// package.json, so `moduleResolution: "bundler"` never finds them. Referencing
// the entry declaration file directly pulls in the module declarations for
// `ace-builds/src-noconflict/*` used by AceCodeEditor.
/// <reference path="../node_modules/ace-builds/ace.d.ts" />
