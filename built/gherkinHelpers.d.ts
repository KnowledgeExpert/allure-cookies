export declare class GherkinHelpers {
    static GIVEN(stepDescription?: string, steps?: () => void | Promise<void>): Promise<void>;
    static WHEN(stepDescription?: string, steps?: () => void | Promise<void>): Promise<void>;
    static THEN(stepDescription?: string, steps?: () => void | Promise<void>): Promise<void>;
    static AND(stepDescription?: string, steps?: () => void | Promise<void>): Promise<void>;
    static EXPECT(stepDescription?: string, steps?: () => void | Promise<void>): Promise<void>;
    static USER(stepDescription?: string): Promise<void>;
    static WITH(stepDescription?: string): Promise<void>;
}
