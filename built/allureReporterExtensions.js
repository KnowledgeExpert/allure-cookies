"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AllureCore = require("allure-js-commons");
const AllureRuntime = require("allure-js-commons/runtime");
const jasmineAllureReporter_1 = require("./jasmineAllureReporter");
var AllureReporterExtensions;
(function (AllureReporterExtensions) {
    const core = new AllureCore();
    const runtime = new AllureRuntime(core);
    let screenshotProvider;
    let whitelistTags = [] || (process.env.ALLURE_TAGS_TO_REPORT && process.env.ALLURE_TAGS_TO_REPORT.split(',').filter(s => s.length !== 0));
    // export async function setEnvironmentAsFeatureAndStory() {
    //     const caps = (await browser.getProcessedConfig()).capabilities;
    //     AllureReporterExtensions.addFeature(`${caps.browserName} ${caps.version || 'defaultVersion'}`);
    //     AllureReporterExtensions.addStory(caps.platform || 'default-platform');
    // }
    //
    // export async function addEnvironmentInfo() {
    //     const openedForReportInformation: string[] = ['platform', 'version', 'browserName'];
    //
    //     const capabilities = (await browser.getProcessedConfig()).capabilities;
    //     for (let key in capabilities) {
    //         if (capabilities.hasOwnProperty(key) && openedForReportInformation.includes(key)) {
    //             AllureReporterExtensions.addArgument(key, capabilities[key]);
    //         }
    //     }
    // }
    function reportStepsWithTags(tags) {
        whitelistTags = tags;
    }
    AllureReporterExtensions.reportStepsWithTags = reportStepsWithTags;
    function setScreenshotProvider(screenshotFunction) {
        screenshotProvider = screenshotFunction;
    }
    AllureReporterExtensions.setScreenshotProvider = setScreenshotProvider;
    function getJasmineAllureReporter(options = { basePath: '.', resultsDir: 'allure-results' }) {
        return new jasmineAllureReporter_1.default({
            basePath: options.basePath,
            resultsDir: options.resultsDir
        }, core);
    }
    AllureReporterExtensions.getJasmineAllureReporter = getJasmineAllureReporter;
    async function attachScreenshot(description = "Screenshot") {
        try {
            const png = await screenshotProvider();
            AllureReporterExtensions.createAttachment(description, new Buffer(png, 'base64'), 'image/png');
        }
        catch (ignore) {
        }
    }
    AllureReporterExtensions.attachScreenshot = attachScreenshot;
    function createAttachment(description, attachmentBuffer, mimeType) {
        runtime.createAttachment(description, attachmentBuffer, mimeType);
    }
    AllureReporterExtensions.createAttachment = createAttachment;
    function addDescription(text) {
        runtime.description(text, 'markdown');
    }
    AllureReporterExtensions.addDescription = addDescription;
    function addArgument(name, value) {
        runtime.addArgument(name, value);
    }
    AllureReporterExtensions.addArgument = addArgument;
    function addFeature(name) {
        runtime.feature(name);
    }
    AllureReporterExtensions.addFeature = addFeature;
    function addStory(story) {
        runtime.story(story);
    }
    AllureReporterExtensions.addStory = addStory;
    function addEnvironment(name, value) {
        runtime.addEnvironment(name, value);
    }
    AllureReporterExtensions.addEnvironment = addEnvironment;
    function Gherkin() {
        return createStepAnnotation({ gherkin: true });
    }
    AllureReporterExtensions.Gherkin = Gherkin;
    function Heading() {
        return createStepAnnotation({ heading: true });
    }
    AllureReporterExtensions.Heading = Heading;
    function ScreenedStep(tags = [], title = null) {
        return createStepAnnotation({ screen: true, title: title, tags: tags });
    }
    AllureReporterExtensions.ScreenedStep = ScreenedStep;
    function Step(tags = [], title = null) {
        return createStepAnnotation({ title: title, tags: tags });
    }
    AllureReporterExtensions.Step = Step;
    function createStepAnnotation(stepInfo) {
        return (target, methodName, descriptor) => {
            const originalMethod = descriptor.value;
            const isOriginalAsync = originalMethod[Symbol.toStringTag] === 'AsyncFunction';
            const screen = stepInfo && stepInfo.screen;
            const title = stepInfo ? stepInfo.title : '';
            const heading = stepInfo && stepInfo.heading;
            const gherkin = stepInfo && stepInfo.gherkin;
            const tags = stepInfo && stepInfo.tags;
            const isReportStep = isHaveWhitelistTag(tags);
            if (isReportStep) {
                const methodDescription = title ? title : methodNametoPlainText(methodName, heading, gherkin);
                const methodContextName = target.constructor.name.trim() !== 'Function' ? `(${target.constructor.name.trim()})` : '';
                let testStatus = TestStatus.PASSED;
                if (gherkin) {
                    descriptor.value = function () {
                        try {
                            const argumentsDescription = argsToPlainText(arguments);
                            startStep(methodDescription, '-', argumentsDescription);
                            return originalMethod.apply(this, arguments);
                        }
                        finally {
                            endStep(testStatus);
                        }
                    };
                }
                else {
                    descriptor.value = isOriginalAsync || screen ? async function () {
                        try {
                            const argumentsDescription = argsToPlainText(arguments) ? `[${argsToPlainText(arguments)}]` : ``;
                            const methodContextDescription = this.toString() !== '[object Object]' ? this.toString() : methodContextName;
                            startStep(methodDescription, argumentsDescription, methodContextDescription);
                            return await originalMethod.apply(this, arguments);
                        }
                        catch (error) {
                            testStatus = TestStatus.BROKEN;
                            throw error;
                        }
                        finally {
                            if (screen) {
                                await AllureReporterExtensions.attachScreenshot();
                            }
                            endStep(testStatus);
                        }
                    } : function () {
                        try {
                            const argumentsDescription = argsToPlainText(arguments) ? `[${argsToPlainText(arguments)}]` : ``;
                            const methodContextDescription = this.toString() !== '[object Object]' ? this.toString() : methodContextName;
                            startStep(methodDescription, argumentsDescription, methodContextDescription);
                            return originalMethod.apply(this, arguments);
                        }
                        catch (error) {
                            testStatus = TestStatus.BROKEN;
                            throw error;
                        }
                        finally {
                            endStep(testStatus);
                        }
                    };
                }
            }
        };
    }
    function startStep(...descriptions) {
        runtime._allure.startStep(descriptions.filter(descr => descr.length !== 0).join(" "));
    }
    function endStep(status) {
        runtime._allure.endStep(status);
    }
    function isHaveWhitelistTag(tags) {
        return whitelistTags.length === 0 || (tags.filter(tag => whitelistTags.includes(tag)).length > 0);
    }
    function argsToPlainText(args) {
        if (!args) {
            return "";
        }
        args._map = [].map;
        const completeArguments = args._map(a => a.toString()).join();
        return completeArguments.length === 0 ? '' : completeArguments.toString();
    }
    function methodNametoPlainText(methodName, heading = false, gherkin = false) {
        const stepTitle = methodName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
        if (heading) {
            return `* ${stepTitle.toUpperCase()}`;
        }
        else if (gherkin) {
            return stepTitle.replace(/ /g, '').toUpperCase();
        }
        else {
            return stepTitle;
        }
    }
    let TestStatus;
    (function (TestStatus) {
        TestStatus["PASSED"] = "passed";
        TestStatus["BROKEN"] = "broken";
    })(TestStatus || (TestStatus = {}));
})(AllureReporterExtensions = exports.AllureReporterExtensions || (exports.AllureReporterExtensions = {}));
//# sourceMappingURL=allureReporterExtensions.js.map