const fs = require('fs');
const readline = require('readline');

const logPath = "C:\\Users\\Tlenek\\.gemini\\antigravity-cli\\brain\\1feeca0a-2a89-467f-8f2b-44543b99f951\\.system_generated\\logs\\transcript_full.jsonl";

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    try {
        const data = JSON.parse(line);
        if (data.step_index === 279) {
            console.log("CHUNK 0 TargetContent:", JSON.stringify(data.tool_calls[0].args.ReplacementChunks[0].TargetContent, null, 2));
            console.log("CHUNK 1 TargetContent:", JSON.stringify(data.tool_calls[0].args.ReplacementChunks[1].TargetContent, null, 2));
        }
    } catch (e) {
    }
});
