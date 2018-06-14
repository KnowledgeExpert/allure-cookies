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
Object.defineProperty(exports, "__esModule", { value: true });
const allureReporterExtensions_1 = require("./allureReporterExtensions");
const gherkinHelpers_1 = require("./gherkinHelpers");
var TestStatus = allureReporterExtensions_1.AllureReporterExtensions.TestStatus;
exports.addArgument = allureReporterExtensions_1.AllureReporterExtensions.addArgument;
exports.addDescription = allureReporterExtensions_1.AllureReporterExtensions.addDescription;
exports.addEnvironment = allureReporterExtensions_1.AllureReporterExtensions.addEnvironment;
exports.createAttachment = allureReporterExtensions_1.AllureReporterExtensions.createAttachment;
exports.attachScreenshot = allureReporterExtensions_1.AllureReporterExtensions.attachScreenshot;
exports.addFeature = allureReporterExtensions_1.AllureReporterExtensions.addFeature;
exports.addStory = allureReporterExtensions_1.AllureReporterExtensions.addStory;
exports.getJasmineAllureReporter = allureReporterExtensions_1.AllureReporterExtensions.getJasmineAllureReporter;
exports.setScreenshotProvider = allureReporterExtensions_1.AllureReporterExtensions.setScreenshotProvider;
exports.reportStepsWithTags = allureReporterExtensions_1.AllureReporterExtensions.reportStepsWithTags;
exports.Step = allureReporterExtensions_1.AllureReporterExtensions.Step;
exports.ScreenedStep = allureReporterExtensions_1.AllureReporterExtensions.ScreenedStep;
exports.Heading = allureReporterExtensions_1.AllureReporterExtensions.Heading;
exports.Gherkin = allureReporterExtensions_1.AllureReporterExtensions.Gherkin;
exports.GIVEN = gherkinHelpers_1.GherkinHelpers.GIVEN;
exports.WHEN = gherkinHelpers_1.GherkinHelpers.WHEN;
exports.THEN = gherkinHelpers_1.GherkinHelpers.THEN;
exports.AND = gherkinHelpers_1.GherkinHelpers.AND;
exports.runtime = {
    startstep(...descriptions) {
        allureReporterExtensions_1.AllureReporterExtensions.startStep(...descriptions);
    },
    endstep(stepSuccess = true) {
        allureReporterExtensions_1.AllureReporterExtensions.endStep(stepSuccess ? TestStatus.PASSED : TestStatus.BROKEN);
    }
};
//# sourceMappingURL=index.js.map