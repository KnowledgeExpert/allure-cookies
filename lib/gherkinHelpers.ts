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
import Heading = AllureReporterExtensions.Heading;
import Gherkin = AllureReporterExtensions.Gherkin;

async function callFnOrAsyncFn(fn) {
    if (fn) {
        if (fn[Symbol.toStringTag] === 'AsyncFunction') {
            await fn();
        } else {
            fn();
        }
    }
}

export class GherkinHelpers {
    //steps are needed only for verbose reporting
    @Gherkin()
    public static async GIVEN(stepDescription = '', steps?: () => void | Promise<void>) {
        await callFnOrAsyncFn(steps);
    }

    @Gherkin()
    public static async WHEN(stepDescription = '', steps?: () => void | Promise<void>) {
        await callFnOrAsyncFn(steps);
    }

    @Gherkin()
    public static async THEN(stepDescription = '', steps?: () => void | Promise<void>) {
        await callFnOrAsyncFn(steps);
    }

    @Gherkin()
    public static async AND(stepDescription = '', steps?: () => void | Promise<void>) {
        await callFnOrAsyncFn(steps);
    }

    @Gherkin()
    public static async EXPECT(stepDescription = '', steps?: () => void | Promise<void>) {
        await callFnOrAsyncFn(steps);
    }

    @Gherkin()
    public static async USER(stepDescription = '') {
    }

    @Gherkin()
    public static async WITH(stepDescription = '') {
    }
}

