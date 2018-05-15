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