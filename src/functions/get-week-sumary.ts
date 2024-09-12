import { and, count, eq, gte, lte, sql } from "drizzle-orm"
import { db } from "../db"
import { goalCompletions, goals } from "../db/schema"
import dayjs from "dayjs"

export async function getWeekSummary() {
    const lastDayOfWeek = dayjs().endOf('week').toDate()
    const firstDayOfWeek = dayjs().startOf('week').toDate()

    
    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db.select({
            id: goals.id,
            title: goals.title,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            createdAt: goals.createdAt
        })
        .from(goals)
        .where(lte(goals.createdAt, lastDayOfWeek))
    )
    const goalCompletionsInWeek =db.$with('goal_completions_counts').as(
        db.select({
            id: goals.id,
            title:goals.title,
            completedAt: goalCompletions.createdAt,
            completedAtDate:sql `DATE ${goalCompletions.createdAt}`.as('completedAtDate')
            
        })
        .from(goalCompletions)
        .innerJoin(goals, eq(goals.id, goalCompletions.id))
        .where(and(
                lte(goalCompletions.createdAt, lastDayOfWeek),
                gte(goalCompletions.createdAt, firstDayOfWeek)
        ))
        .groupBy(goalCompletions.goalId)
    )
    const goalsCompletedByWeekDay =db.$with('goals_completed_by_week_day').as(
        db
        .select({
            completedAtDate: goalCompletionsInWeek.completedAtDate,
            completions: sql`
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', ${goalCompletionsInWeek.id},    
                        'title', ${goalCompletionsInWeek.title},    
                        'completedAt', ${goalCompletionsInWeek.completedAt}
                    )
                )
            `.as('completions'),
        })
        .from(goalCompletionsInWeek)
        .groupBy(goalCompletionsInWeek.completedAtDate)
    )
    const result = await db
    .with(goalsCreatedUpToWeek, goalCompletionsInWeek, goalsCompletedByWeekDay)
    .select()
    .from(goalsCompletedByWeekDay)
    return{
        summary: result
    }
    
}