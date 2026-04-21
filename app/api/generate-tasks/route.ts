import { generateText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Инициализация Groq клиента с API ключом
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// Схема одной задачи для валидации
const TaskSchema = z.object({
  week_number: z.number(),
  title: z.string(),
  description: z.string().nullable(),
})

// Схема всего ответа AI
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
    // Важно: просим вернуть ТОЛЬКО JSON без markdown
    const systemPrompt = isRussian
      ? `Ты — эксперт по планированию обучения хобби. 
Твоя задача — создать структурированный 4-недельный план задач для обучения хобби.
ВАЖНО: Верни ТОЛЬКО JSON-объект, без markdown, без объяснений, без \`\`\`json.
Формат: {"tasks": [{"week_number": 1, "title": "...", "description": "..."}]}
Создай 2-3 задачи на каждую неделю (week_number от 1 до 4, итого 8-12 задач).
Задачи должны постепенно усложняться от недели к неделе.
Все тексты задач возвращай НА РУССКОМ ЯЗЫКЕ.`
      : `You are an expert in hobby learning planning.
Your task is to create a structured 4-week task plan for learning a hobby.
IMPORTANT: Return ONLY a JSON object, no markdown, no explanations, no \`\`\`json.
Format: {"tasks": [{"week_number": 1, "title": "...", "description": "..."}]}
Create 2-3 tasks per week (week_number from 1 to 4, 8-12 tasks total).
Tasks should progressively increase in difficulty week by week.
Return all task texts IN ENGLISH.`

    const userPrompt = isRussian
      ? `Хобби: ${hobby}\nЦель на 4 недели: ${goal}`
      : `Hobby: ${hobby}\nGoal for 4 weeks: ${goal}`

    console.log('[v0] Generating tasks for hobby:', hobby, 'goal:', goal)

    // Вызов AI через Groq без structured output (не поддерживается llama-3.3-70b-versatile)
    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: userPrompt,
    })

    console.log('[v0] AI raw response:', result.text)

    // Парсим JSON из ответа AI
    let jsonText = result.text.trim()
    
    // Удаляем возможные markdown обёртки
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7)
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3)
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3)
    }
    jsonText = jsonText.trim()

    // Парсим и валидируем JSON
    const parsed = JSON.parse(jsonText)
    const validated = GeneratedTasksSchema.parse(parsed)

    console.log('[v0] Parsed tasks count:', validated.tasks.length)

    return NextResponse.json({ tasks: validated.tasks })
  } catch (error) {
    console.error('[v0] Error generating tasks:', error)
    return NextResponse.json(
      { error: 'Failed to generate tasks' },
      { status: 500 }
    )
  }
}
