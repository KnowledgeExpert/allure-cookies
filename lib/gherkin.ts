import {AllureReporterExtensions} from "./allureReporterExtensions";
import Heading = AllureReporterExtensions.Heading;

export class Gherkin {
    //steps are needed only for verbose reporting
    @Heading()
    public static GIVEN(stepDescription?: string) {
    }

    @Heading()
    public static WHEN(stepDescription?: string) {
    }

    @Heading()
    public static THEN(stepDescription?: string) {
    }

    @Heading()
    public static AND(stepDescription?: string) {
    }

    @Heading()
    public static USER(stepDescription?: string) {
    }
}

