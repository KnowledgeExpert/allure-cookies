import * as AllureCore from 'allure-js-commons';
import * as AllureRuntime from 'allure-js-commons/runtime';
import JasmineAllureReporter from "./jasmineAllureReporter";


export namespace AllureReporterExtensions {

    const core = new AllureCore();
    const runtime = new AllureRuntime(core);
    let screenshotProvider;

    // export function addToJasmine() {
    //     jasmine.getEnv().addReporter(getAllureReporter({basePath: './build', resultsDir: 'allure-results'}));
    // }

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

    export function setScreenshotProvider(screenshotFunction: Function) {
        screenshotProvider = screenshotFunction;
    }

    export function getJasmineAllureReporter(options = {basePath: '.', resultsDir: 'allure-results'}) {
        return new JasmineAllureReporter({
            basePath: options.basePath,
            resultsDir: options.resultsDir
        }, core);
    }

    export async function attachScreenshot(description = "Screenshot") {
        try {
            const png = await screenshotProvider();
            AllureReporterExtensions.createAttachment(description, new Buffer(png, 'base64'), 'image/png');
        } catch (ignore) {
        }
    }

    export function createAttachment(description: string, attachmentBuffer: Buffer, mimeType: string) {
        runtime.createAttachment(description, attachmentBuffer, mimeType);
    }

    export function addDescription(text) {
        runtime.description(text, 'markdown');
    }

    export function addArgument(name: string, value: string): void {
        runtime.addArgument(name, value);
    }

    export function addFeature(name: string): void {
        runtime.feature(name);
    }

    export function addStory(story: string): void {
        runtime.story(story);
    }

    export function addEnvironment(name: string, value: string): void {
        runtime.addEnvironment(name, value);
    }

    export function Gherkin() {
        return createStepAnnotation({screen: false, title: null as string, heading: false, gherkin: true});
    }

    export function Heading() {
        return createStepAnnotation({screen: false, title: null as string, heading: true});
    }

    export function ScreenedStep(title = null as string) {
        return createStepAnnotation({screen: true, heading: false, title: title, logClass: true});
    }

    export function Step(title = null as string) {
        return createStepAnnotation({screen: false, title: title, heading: false, logClass: true});
    }

    function createStepAnnotation(stepInfo?: { screen?: boolean, title?: string, heading?: boolean, logClass?: boolean, gherkin?: boolean }) {
        return (target, methodName, descriptor: PropertyDescriptor) => {
            const originalMethod = descriptor.value;
            const isOriginalAsync = originalMethod[Symbol.toStringTag] === 'AsyncFunction';

            const screen = stepInfo && stepInfo.screen;
            const title = stepInfo ? stepInfo.title : "";
            const heading = stepInfo && stepInfo.heading;
            const logClass = stepInfo && stepInfo.logClass;
            const gherkin = stepInfo && stepInfo.gherkin;

            const methodDescription = title ? title : methodNametoPlainText(methodName, heading, gherkin);
            const methodContextName = target.toString() !== '[object Object]'
                ? target.toString()
                : target.constructor.name.trim() === 'Function'
                    ? ''
                    : `(${target.constructor.name.trim()})`;

            let testStatus = TestStatus.PASSED;

            if (gherkin) {
                descriptor.value = function () {
                    try {
                        const argumentsDescription = argsToPlainText(arguments);
                        startStep(methodDescription, '-', argumentsDescription);
                        return originalMethod.apply(this, arguments);
                    } finally {
                        endStep(testStatus);
                    }
                }
            } else {
                descriptor.value = isOriginalAsync || screen ? async function () {
                    try {
                        const argumentsRawDescription = argsToPlainText(arguments);
                        const argumentsDescription = argumentsRawDescription ? `[${argumentsRawDescription}]` : ``;
                        startStep(methodDescription, argumentsDescription, methodContextName);
                        return await originalMethod.apply(this, arguments);
                    } catch (error) {
                        testStatus = TestStatus.BROKEN;
                        throw error;
                    } finally {
                        if (screen) {
                            await AllureReporterExtensions.attachScreenshot();
                        }
                        endStep(testStatus);
                    }
                } : function () {
                    try {
                        const argumentsRawDescription = argsToPlainText(arguments);
                        const argumentsDescription = argumentsRawDescription ? `[${argumentsRawDescription}]` : ``;
                        startStep(methodDescription, argumentsDescription, methodContextName);
                        return originalMethod.apply(this, arguments);
                    } catch (error) {
                        testStatus = TestStatus.BROKEN;
                        throw error;
                    } finally {
                        endStep(testStatus);
                    }
                };
            }
        }
    }

    function startStep(...descriptions: string[]) {
        runtime._allure.startStep(descriptions.filter(descr => descr.length !== 0).join(" "));
    }

    function endStep(status: TestStatus) {
        runtime._allure.endStep(status);
    }

    function argsToPlainText(args): string {
        if (!args) {
            return "";
        }
        (args as any)._map = [].map;
        const completeArguments = args._map(a => a.toString()).join();
        return completeArguments.length === 0 ? '' : completeArguments.toString();
    }

    function methodNametoPlainText(methodName: string, heading = false, gherkin = false): string {
        const stepTitle = methodName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
        if (heading) {
            return `* ${stepTitle.toUpperCase()}`;
        } else if (gherkin) {
            return stepTitle.replace(/ /g, '').toUpperCase();
        } else {
            return stepTitle;
        }
    }

    enum TestStatus {
        PASSED = 'passed',
        BROKEN = 'broken'
    }
}