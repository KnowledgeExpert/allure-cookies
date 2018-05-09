/// <reference types="node" />
export declare namespace AllureReporterExtensions {
    function reportStepsWithTags(tags: string[]): void;
    function setScreenshotProvider(screenshotFunction: Function): void;
    function getJasmineAllureReporter(options?: {
        basePath: string;
        resultsDir: string;
    }): any;
    function attachScreenshot(description?: string): Promise<void>;
    function createAttachment(description: string, attachmentBuffer: Buffer, mimeType: string): void;
    function addDescription(text: any): void;
    function addArgument(name: string, value: string): void;
    function addFeature(name: string): void;
    function addStory(story: string): void;
    function addEnvironment(name: string, value: string): void;
    function Gherkin(): (target: any, methodName: any, descriptor: PropertyDescriptor) => void;
    function Heading(): (target: any, methodName: any, descriptor: PropertyDescriptor) => void;
    function ScreenedStep(tags?: any[], title?: string): (target: any, methodName: any, descriptor: PropertyDescriptor) => void;
    function Step(tags?: any[], title?: string): (target: any, methodName: any, descriptor: PropertyDescriptor) => void;
    function startStep(...descriptions: string[]): void;
    function endStep(status?: TestStatus): void;
    enum TestStatus {
        PASSED = "passed",
        BROKEN = "broken",
    }
}
