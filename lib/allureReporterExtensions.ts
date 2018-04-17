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

    export function Heading() {
        return createStepAnnotation({screen: false, title: null as string, heading: true});
    }

    export function ScreenedStep(title = null as string) {
        return createStepAnnotation({screen: true, heading: false, title: title, logClass: true});
    }

    export function Step(title = null as string) {
        return createStepAnnotation({screen: false, title: title, heading: false, logClass: true});
    }

    function createStepAnnotation(stepInfo?: { screen?: boolean, title?: string, heading?: boolean, logClass?: boolean }) {
        return (target, methodName, descriptor: PropertyDescriptor) => {
            const originalMethod = descriptor.value;
            const isOriginalAsync = originalMethod[Symbol.toStringTag] === 'AsyncFunction';

            const screen = stepInfo && stepInfo.screen;
            const title = stepInfo ? stepInfo.title : "";
            const heading = stepInfo && stepInfo.heading;
            const logClass = stepInfo && stepInfo.logClass;

            const methodDescription = title ? title : methodNametoPlainText(methodName, heading);
            const rawMethodContextName = target.constructor.name.trim();
            const methodContextName = rawMethodContextName === `Function` ? `` : `(${rawMethodContextName})`;

            let status = TestStatus.PASSED;

            descriptor.value = isOriginalAsync || screen ? async function () {
                try {
                    const argumentsDescription = argsToPlainText(arguments);
                    startStep(methodDescription, argumentsDescription, methodContextName);
                    return await originalMethod.apply(this, arguments);
                } catch (error) {
                    status = TestStatus.BROKEN;
                    throw error;
                } finally {
                    if (screen) {
                        await AllureReporterExtensions.attachScreenshot();
                    }
                    endStep(status);
                }
            } : function () {
                try {
                    const argumentsDescription = argsToPlainText(arguments);
                    startStep(methodDescription, argumentsDescription, methodContextName);
                    return originalMethod.apply(this, arguments);
                } catch (error) {
                    status = TestStatus.BROKEN;
                    throw error;
                } finally {
                    endStep(status);
                }
            };
        }
    }

    function startStep(...descriptions: string[]) {
        runtime._allure.startStep(descriptions.join(" "));
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
        return completeArguments.length === 0 ? '' : `[${completeArguments.toString()}]`
    }

    function methodNametoPlainText(methodName: string, heading = false): string {
        const stepTitle = methodName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
        return heading ? `* ${stepTitle.toUpperCase()}` : stepTitle;
    }

    enum TestStatus {
        PASSED = 'passed',
        BROKEN = 'broken'
    }
}