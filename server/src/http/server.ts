import fastify from "fastify";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { createGoalRoute } from "./routes/create-goal";
import { createCompletionGoalRoute } from "./routes/create-completion";
import { getWeeklyPendingGoalsRoute } from "./routes/get-pending-goals";
import { getWeekSummaryRoute } from "./routes/get-week-summary";
import fastifyCors from "@fastify/cors";
import { register } from "module";


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
    origin: '*',
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createGoalRoute)
app.register(createCompletionGoalRoute)
app.register(getWeeklyPendingGoalsRoute)
app.register(getWeekSummaryRoute)

app.listen({
    port: 3333
}).then(() => {
    console.log('HTTP server running')
})