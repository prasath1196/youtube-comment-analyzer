import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();


const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


const getSentiment = async (content) => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Analyze the sentiment of the following comments. Use one of these categories: positive, negative, neutral, or curious.
          
          Examples:
          Comment: "Awesome video! I love it!"
          Sentiment: positive
          
          Comment: "This video is terrible. I hate it."
          Sentiment: negative
          
          Comment: "This video is good. I like it."
          Sentiment: neutral
          
          Comment: "Ok, but does it know how many fingers and arms a human has?"
          Sentiment: curious
          
          Comment: "o3 is probably smart enough to deliberately get 3.3% of the mathematics wrong, to avoid looking too smart."
          Sentiment: curious
          
          Comment: "${content}"
          Sentiment: `,
        },
      ],
      max_tokens: 7,
      temperature: 0,
    });
  
    console.log("Called OpenAI API");
    console.log(completion.choices[0].message.content, content);
    return completion.choices[0].message.content;
  };
  
  export { getSentiment };
  
