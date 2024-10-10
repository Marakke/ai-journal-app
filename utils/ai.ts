import { PromptTemplate } from '@langchain/core/prompts'
import { OpenAI } from '@langchain/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    subject: z.string().describe('The subject of the journal entry.'),
    summary: z.string().describe('Quick summary of the entire entry.'),
    mood: z
      .string()
      .describe('The mood of the person who wrote the journal entry.'),
    negative: z
      .boolean()
      .describe(
        'Is the journal entry negative? (For example does it contain negative emotions?).'
      ),
    color: z
      .string()
      .describe(
        'A hexidecimal color code that represents the mood of the entry. For example #0101fe for blue representing happiness.'
      ),
    sentimentScore: z
      .number()
      .describe(
        'Sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
      ),
  })
)

const getPrompt = async (content) => {
  const format_instructions = parser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })

  const input = await prompt.format({
    entry: content,
  })

  return input
}

export const analyze = async (content) => {
  const input = await getPrompt(content)
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
  const result = await model.invoke(input)

  try {
    return parser.parse(result)
  } catch (e) {
    console.log(e)
  }
}
