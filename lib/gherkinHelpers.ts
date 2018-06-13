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

export class GherkinHelpers {
    //steps are needed only for verbose reporting
    @Gherkin()
    public static GIVEN(stepDescription?: string) {
    }

    @Gherkin()
    public static WHEN(stepDescription?: string) {
    }

    @Gherkin()
    public static THEN(stepDescription?: string) {
    }

    @Gherkin()
    public static AND(stepDescription?: string) {
    }

    @Gherkin()
    public static USER(stepDescription?: string) {
    }
}

