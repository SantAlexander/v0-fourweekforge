import { generateText, Output } from 'ai'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const taskSchema = z.object({
  week_number: z.number().min(1).max(4),
  title: z.string(),
  description: z.string(),
})

const tasksResponseSchema = z.object({
  tasks: z.array(taskSchema).length(28),
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

    const systemPrompt = isRussian
      ? `Ты эксперт по обучению хобби. Создай детальный 4-недельный план с 28 задачами (по 7 задач на каждую неделю) для освоения хобби.

Правила:
- Каждая задача должна быть конкретной и выполнимой
- Задачи должны постепенно усложняться от недели к неделе
- Первая неделя - базовые навыки и знакомство
- Вторая неделя - практика основ
- Третья неделя - развитие и углубление
- Четвертая неделя - продвинутые техники и закрепление

Отвечай на русском языке.`
      : `You are an expert hobby learning coach. Create a detailed 4-week plan with 28 tasks (7 tasks per week) for learning a hobby.

Rules:
- Each task should be specific and actionable
- Tasks should progressively increase in difficulty from week to week
- Week 1 - basic skills and introduction
- Week 2 - practicing fundamentals
- Week 3 - development and deepening
- Week 4 - advanced techniques and consolidation

Respond in English.`

    const userPrompt = isRussian
      ? `Создай 28 задач для изучения хобби "${hobby}" с целью: "${goal}".

Распредели по 7 задач на каждую из 4 недель. Каждая задача должна иметь краткое название и описание.`
      : `Create 28 tasks for learning the hobby "${hobby}" with the goal: "${goal}".

Distribute 7 tasks for each of the 4 weeks. Each task should have a brief title and description.`

    const { output } = await generateText({
      model: 'openai/gpt-4o-mini',
      output: Output.object({
        schema: tasksResponseSchema,
      }),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    if (!output) {
      return NextResponse.json(
        { error: 'Failed to generate tasks' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tasks: output.tasks })
  } catch (error) {
    console.error('Error generating tasks:', error)
    return NextResponse.json(
      { error: 'Failed to generate tasks' },
      { status: 500 }
    )
  }
}
