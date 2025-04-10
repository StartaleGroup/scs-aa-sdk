import { getSmartSessionsValidator } from "@rhinestone/module-sdk";
import { toValidator } from "../toValidator.js";
export const toSmartSessionsModule = (parameters) => {
    const { signer } = parameters ?? {};
    return toValidator({
        ...getSmartSessionsValidator({ useRegistry: false }),
        signer,
        type: "validator"
    });
};
//# sourceMappingURL=toSmartSessionsModule.js.map