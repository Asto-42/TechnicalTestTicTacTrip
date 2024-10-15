import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

export const app = express();
const port = process.env.PORT || 3000;
const tokens: { [key: string]: string } = {};
const tokenUsage: { [key: string]: { wordsUsed: number, lastUsedDate: string } } = {};


app.use(bodyParser.json());


app.post('/api/token', (req: Request, res: Response) =>
{
    const {email} = req.body;
    if (!email)
    {
        return res.status(400).send("Email required");
    }
    const token = uuidv4();
    tokens[email] = token;
    res.json({token});
});

const authenticate = (req: Request, res: Response, next: () => void) =>
{
    const authHeader = req.headers.authorization;

    if (!authHeader)
    {
        return res.status(401).send("Token required");
    }
    const token = authHeader.split(' ')[1];
    const email = Object.keys(tokens).find(key => tokens[key] === token);
    if (!email)
    {
        return res.status(401).send("Invalid token");
    }
    const body = typeof req.body === 'string' ? req.body : '';
    const wordCount = body.split(/\s+/).length;
    const today = new Date().toISOString().split('T')[0];

    if (!tokenUsage[token])
    {
        tokenUsage[token] = { wordsUsed: 0, lastUsedDate: today };
    }

    if (tokenUsage[token].lastUsedDate !== today)
    {
        tokenUsage[token].wordsUsed = 0;
        tokenUsage[token].lastUsedDate = today;
    }

    if (tokenUsage[token].wordsUsed + wordCount > 80000)
    {
        return res.status(402).send("Rate limit of 80,000 words exceeded");
    }
    tokenUsage[token].wordsUsed += wordCount;
    next();
};

app.post('/api/justify', bodyParser.text(), authenticate, (req: Request, res: Response) => {
    const text = req.body;

    if (!text)
    {
        console.log("No text");
        return res.status(400).send("No text provided");
    }

    try
    {
        const justifiedText = justifyText(text);
        res.send(justifiedText);
    }
    catch (error) 
    {
        console.error("justification error : ", error);
        res.status(500).send("Erreur interne du serveur");
    }
});

app.get('/', (req:Request, res: Response) =>
{
    res.send('Welcome to the API');
})

function justifyText(text: string): string {
    const maxLineLength = 80;
    const words = text.split(/\s+/);
    let lines: string[] = [];
    let currentLine: string[] = [];
    let currentLineLength = 0;

    for (const word of words)
    {
        if (currentLineLength + word.length + currentLine.length > maxLineLength) {
            lines.push(justifyLine(currentLine, currentLineLength, maxLineLength));
            currentLine = [];
            currentLineLength = 0;
        }
        currentLine.push(word);
        currentLineLength += word.length;
    }

    if (currentLine.length > 0)
    {
        lines.push(currentLine.join(' '));
    }

    return lines.join('\n');
}

function justifyLine(words: string[], currentLength: number, maxLineLength: number): string {
    const spacesToAdd = maxLineLength - currentLength;
    const gaps = words.length - 1;

    if (gaps === 0)
    {
        return words[0] + ' '.repeat(spacesToAdd);
    }

    const spacesPerGap = Math.floor(spacesToAdd / gaps);
    const extraSpaces = spacesToAdd % gaps;

    let justifiedLine = '';
    for (let i = 0; i < words.length - 1; i++)
    {
        justifiedLine += words[i];
        justifiedLine += ' '.repeat(spacesPerGap + (i < extraSpaces ? 1 : 0));
    }
    justifiedLine += words[words.length - 1];

    return justifiedLine;
}

export default app;
