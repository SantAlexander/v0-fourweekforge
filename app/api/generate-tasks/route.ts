import { generateText, Output } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Инициализация Groq клиента с API ключом
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// Схема одной задачи
const TaskSchema = z.object({
  week_number: z.number(),
  title: z.string(),
  description: z.string().nullable(),
})

// Схема всего ответа AI — 4 недели по несколько задач
const GeneratedTasksSchema = z.object({
  tasks: z.array(TaskSchema),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { hobby, goal, locale } = await request.json()

    if (!hobby || !goal) {
      return NextResponse.json(
        { error: 'Hobby and goal are required' },
        { status: 400 }
      )
    }

    const isRussian = locale === 'ru'

    // Системный промпт — объясняет AI что нужно сделать
    const systemPrompt = isRussian
      ? `Ты — эксперт по планированию обучения хобби. 
Твоя задача — создать структурированный 4-недельный план задач для обучения хобби.
Возвращай задачи в виде JSON-объекта с полем "tasks" — массивом задач.
Каждая задача должна содержать: week_number (1-4), title (краткое название), description (подробное описание).
Создай 2-3 задачи на каждую неделю (итого 8-12 задач).
Задачи должны постепенно усложняться от недели к неделе.
Все тексты задач возвращай НА РУССКОМ ЯЗЫКЕ.`
      : `You are an expert in hobby learning planning.
Your task is to create a structured 4-week task plan for learning a hobby.
Return tasks as a JSON object with a "tasks" field — an array of tasks.
Each task must contain: week_number (1-4), title (short name), description (detailed description).
Create 2-3 tasks per week (8-12 tasks total).
Tasks should progressively increase in difficulty week by week.
Return all task texts IN ENGLISH.`

    const userPrompt = isRussian
      ? `Хобби: ${hobby}\nЦель на 4 недели: ${goal}\n\nСоздай подробный план задач по неделям.`
      : `Hobby: ${hobby}\nGoal for 4 weeks: ${goal}\n\nCreate a detailed weekly task plan.`

    console.log('[v0] Generating tasks for hobby:', hobby, 'goal:', goal)

    // Вызов AI через Groq — используем бесплатную модель llama-3.3-70b-versatile
    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: userPrompt,
      output: Output.object({
        schema: GeneratedTasksSchema,
      }),
    })

    console.log('[v0] AI result:', JSON.stringify(result.output, null, 2))

    if (!result.output || !result.output.tasks) {
      console.error('[v0] No tasks in AI response')
      return NextResponse.json(
        { error: 'AI did not return valid tasks' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tasks: result.output.tasks })
  } catch (error) {
    console.error('[v0] Error generating tasks:', error)
    return NextResponse.json(
      { error: 'Failed to generate tasks' },
      { status: 500 }
    )
  }
}
