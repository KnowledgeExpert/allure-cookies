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

import * as path from 'path';

export default function JasmineAllureReporter(userDefinedConfig = {basePath: '.', resultsDir: 'allure-results'}, allure: any) {

    (function (allureConfig) {
        const outDir = path.resolve(allureConfig.basePath, allureConfig.resultsDir);
        allure.setOptions({targetDir: outDir});
    })(userDefinedConfig);

    this.suiteStarted = function (suite) {
        allure.startSuite(suite.fullName);
    };
    this.suiteDone = function () {
        allure.endSuite();
    };
    this.specStarted = function (spec) {
        allure.startCase(spec.description);
    };
    this.specDone = function (spec) {
        const status = getTestcaseStatus(spec.status);
        const errorInfo = getTestcaseError(spec);
        allure.endCase(status, errorInfo);
    };

    function getTestcaseStatus(status) {
        if (status === 'disabled' || status === 'pending') {
            return 'pending';
        } else if (status === 'passed') {
            return 'passed';
        } else {
            return 'failed';
        }
    }

    function getTestcaseError(result) {
        if (result.status === 'disabled') {
            return {
                message: 'This test was ignored',
                stack: ''
            };
        } else if (result.status === 'pending') {
            return {
                message: result.pendingReason,
                stack: ''
            };
        }
        return result.failedExpectations
            ? result.failedExpectations[0]
            : {
                message: 'No failure expectations found.',
                stack: ''
            };
    }
}