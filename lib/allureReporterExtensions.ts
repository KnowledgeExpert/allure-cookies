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

import * as AllureCore from 'allure-js-commons';
import * as AllureRuntime from 'allure-js-commons/runtime';
import JasmineAllureReporter from './jasmineAllureReporter';


export namespace AllureReporterExtensions {

    const core = new AllureCore();
    const runtime = new AllureRuntime(core);
    let screenshotProvider;
    let whitelistTags: string[] = [] || (process.env.ALLURE_TAGS_TO_REPORT && process.env.ALLURE_TAGS_TO_REPORT.split(',').filter(s => s.length !== 0));

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

    export function reportStepsWithTags(tags: string[]) {
        whitelistTags = tags;
    }

    export function setScreenshotProvider(screenshotFunction: Function) {
        screenshotProvider = screenshotFunction;
    }

    export function getJasmineAllureReporter(options = {basePath: '.', resultsDir: 'allure-results'}) {
        return new JasmineAllureReporter({
            basePath: options.basePath,
            resultsDir: options.resultsDir
        }, core);
    }

    export async function attachScreenshot(description = 'Screenshot') {
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
        return createStepAnnotation({gherkin: true});
    }

    export function Heading() {
        return createStepAnnotation({heading: true});
    }

    export function ScreenedStep(tags = [], title = null as string) {
        return createStepAnnotation({screen: true, title: title, tags: tags});
    }

    export function Step(tags = [], title = null as string) {
        return createStepAnnotation({title: title, tags: tags});
    }

    function createStepAnnotation(stepInfo?: { screen?: boolean, title?: string, heading?: boolean, gherkin?: boolean, tags?: string[] }) {
        return (target, methodName, descriptor: PropertyDescriptor) => {
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
                        } finally {
                            endStep(testStatus);
                        }
                    }
                } else {
                    descriptor.value = isOriginalAsync || screen ? async function () {
                        try {

                            if (arguments.length === 1 && arguments[0] === undefined) {
                                return; // no need to annotate; method should be skipped
                            }

                            const argumentsDescription = argsToPlainText(arguments) ? `[${argsToPlainText(arguments)}]` : ``;
                            const methodContextDescription = this.toString() !== '[object Object]' ? this.toString() : methodContextName;

                            startStep(methodDescription, argumentsDescription, methodContextDescription);

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

                            if (arguments.length === 1 && arguments[0] === undefined) {
                                return; // no need to annotate; method should be skipped
                            }
                            
                            const argumentsDescription = argsToPlainText(arguments) ? `[${argsToPlainText(arguments)}]` : ``;
                            const methodContextDescription = this.toString() !== '[object Object]' ? this.toString() : methodContextName;

                            startStep(methodDescription, argumentsDescription, methodContextDescription);

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
    }

    export function startStep(...descriptions: string[]) {
        if (!descriptions) {
            throw new Error(`Cannot start step with arguments '${descriptions}'`);
        }
        runtime._allure.startStep(descriptions.filter(description => description.length !== 0).join(' '));
    }

    export function endStep(status = TestStatus.PASSED) {
        runtime._allure.endStep(status);
    }

    function isHaveWhitelistTag(tags: string[]): boolean {
        return whitelistTags.length === 0 || (tags.filter(tag => whitelistTags.includes(tag)).length > 0);
    }

    function argsToPlainText(args): string {
        if (!args) {
            return '';
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

    export enum TestStatus {
        PASSED = 'passed',
        BROKEN = 'broken'
    }
}