"use strict";
// Copyright 2018 Knowledge Expert SA
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const allureReporterExtensions_1 = require("./allureReporterExtensions");
var Gherkin = allureReporterExtensions_1.AllureReporterExtensions.Gherkin;
class GherkinHelpers {
    //steps are needed only for verbose reporting
    static GIVEN(stepDescription, steps) {
        if (steps) {
            return steps();
        }
    }
    static WHEN(stepDescription, steps) {
        if (steps) {
            return steps();
        }
    }
    static THEN(stepDescription, steps) {
        if (steps) {
            return steps();
        }
    }
    static AND(stepDescription, steps) {
        if (steps) {
            return steps();
        }
    }
    static EXPECT(stepDescription, steps) {
        if (steps) {
            return steps();
        }
    }
    static USER(stepDescription, steps) {
        if (steps) {
            return steps();
        }
    }
    static WITH(stepDescription, steps) {
        if (steps) {
            return steps();
        }
    }
}
__decorate([
    Gherkin()
], GherkinHelpers, "GIVEN", null);
__decorate([
    Gherkin()
], GherkinHelpers, "WHEN", null);
__decorate([
    Gherkin()
], GherkinHelpers, "THEN", null);
__decorate([
    Gherkin()
], GherkinHelpers, "AND", null);
__decorate([
    Gherkin()
], GherkinHelpers, "EXPECT", null);
__decorate([
    Gherkin()
], GherkinHelpers, "USER", null);
__decorate([
    Gherkin()
], GherkinHelpers, "WITH", null);
exports.GherkinHelpers = GherkinHelpers;
//# sourceMappingURL=gherkinHelpers.js.map