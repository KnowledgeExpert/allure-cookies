"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const allureReporterExtensions_1 = require("./allureReporterExtensions");
var Heading = allureReporterExtensions_1.AllureReporterExtensions.Heading;
class Gherkin {
    //steps are needed only for verbose reporting
    static GIVEN(stepDescription) {
    }
    static WHEN(stepDescription) {
    }
    static THEN(stepDescription) {
    }
    static AND(stepDescription) {
    }
    static USER(stepDescription) {
    }
}
__decorate([
    Heading()
], Gherkin, "GIVEN", null);
__decorate([
    Heading()
], Gherkin, "WHEN", null);
__decorate([
    Heading()
], Gherkin, "THEN", null);
__decorate([
    Heading()
], Gherkin, "AND", null);
__decorate([
    Heading()
], Gherkin, "USER", null);
exports.Gherkin = Gherkin;
//# sourceMappingURL=gherkin.js.map