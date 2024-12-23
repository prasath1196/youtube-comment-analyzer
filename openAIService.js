import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const getCompletion = async (prompt) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        store: true,
    messages: [
        {"role": "user", 
        "content": "write a haiku about ai"
    }
    ]
})
return completion.choices[0].message.content;
}