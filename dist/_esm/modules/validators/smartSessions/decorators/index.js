import { grantPermission } from "./grantPermission.js";
import { usePermission } from "./usePermission.js";
/**
 * Creates actions for managing smart session creation.
 *
 * @param _ - Unused parameter (placeholder for potential future use).
 * @returns A function that takes a client and returns SmartSessionActions.
 */
export function smartSessionActions() {
    return (client) => ({
        usePermission: (args) => usePermission(client, args),
        grantPermission: (args) => grantPermission(client, args)
    });
}
export { usePermission, grantPermission };
//# sourceMappingURL=index.js.map