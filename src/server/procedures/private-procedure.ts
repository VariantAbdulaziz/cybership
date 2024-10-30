import { procedure } from "../trpc";
import { withAuth } from "../middlewares/with-auth";

const privateProcedure = procedure.use(withAuth);

export { privateProcedure };
