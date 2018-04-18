import {AllureReporterExtensions} from "./allureReporterExtensions";
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

