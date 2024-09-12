import { and, count, eq, gte, lte, sql } from "drizzle-orm"
import dayjs from "dayjs";
import { db } from "../db"
import { goalCompletions, goals } from "../db/schema"

interface CreateGoalCompletionRequest {
    goalId: string
}

export async function createGoalCompletion({goalId}: CreateGoalCompletionRequest) {
    const lastDayOfWeek = dayjs().endOf('week').toDate()
    const firstDayOfWeek = dayjs().startOf('week').toDate()
   
    const goalCompletionsCounts =db.$with('goal-completions-counts').as(
        db.select({
            goalId: goalCompletions.goalId,
            completionCount: count(goalCompletions.id).as('completionCount'),
        })
        .from(goalCompletions)
        .where(and(
                lte(goalCompletions.createdAt, lastDayOfWeek),
                gte(goalCompletions.createdAt, firstDayOfWeek),
                eq(goalCompletions.goalId, goalId)
        ))
        .groupBy(goalCompletions.goalId)
    )
    const result = await db
    .with(goalCompletionsCounts)
    .select({
        desireWeeklyFrequency:goals.desiredWeeklyFrequency,
        completionCount: sql`
        COALESCE(${goalCompletionsCounts.completionCount}, 0)`
        .mapWith(Number)
    })
    .from(goals)
    .leftJoin(goalCompletionsCounts, eq(goalCompletionsCounts.goalId, goals.id))
    .where(eq(goals.id, goalId))

    const {completionCount, desireWeeklyFrequency} = result[0]

    if( completionCount<desireWeeklyFrequency){
        const insertResult = await db.insert(goalCompletions).values({goalId}).returning()
        const goalCompletion = result[0]

    }else{ throw new Error('Goal already completed this week!') }


    return{
        goalCompletions,
    }
    
}