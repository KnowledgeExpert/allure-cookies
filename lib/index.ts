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

import {AllureReporterExtensions} from './allureReporterExtensions';
import {GherkinHelpers} from './gherkinHelpers';
import TestStatus = AllureReporterExtensions.TestStatus;

export const addArgument = AllureReporterExtensions.addArgument;
export const addDescription = AllureReporterExtensions.addDescription;
export const addEnvironment = AllureReporterExtensions.addEnvironment;
export const createAttachment = AllureReporterExtensions.createAttachment;
export const attachScreenshot = AllureReporterExtensions.attachScreenshot;
export const addFeature = AllureReporterExtensions.addFeature;
export const addStory = AllureReporterExtensions.addStory;

export const getJasmineAllureReporter = AllureReporterExtensions.getJasmineAllureReporter;

export const setScreenshotProvider = AllureReporterExtensions.setScreenshotProvider;
export const reportStepsWithTags = AllureReporterExtensions.reportStepsWithTags;

export const Step = AllureReporterExtensions.Step;
export const GeneralStep = AllureReporterExtensions.GeneralStep;
export const ScreenedStep = AllureReporterExtensions.ScreenedStep;
export const Heading = AllureReporterExtensions.Heading;
export const Gherkin = AllureReporterExtensions.Gherkin;

export const GIVEN = GherkinHelpers.GIVEN;
export const WHEN = GherkinHelpers.WHEN;
export const THEN = GherkinHelpers.THEN;
export const AND = GherkinHelpers.AND;
export const EXPECT = GherkinHelpers.EXPECT;
export const WITH = GherkinHelpers.WITH;

export const runtime = {
    startstep(...descriptions: string[]) {
        AllureReporterExtensions.startStep(...descriptions);
    },
    endstep(stepSuccess = true) {
        AllureReporterExtensions.endStep(stepSuccess? TestStatus.PASSED : TestStatus.BROKEN);
    }
};
