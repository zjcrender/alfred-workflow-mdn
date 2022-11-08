import * as https from "node:https";
import * as process from "process";
import * as fs from "fs";
import * as path from "path";

type Suggestions = {
  title: string;
  url: string;
}

const suggestionURL = 'https://developer.mozilla.org/zh-CN/search-index.json';

const FILE_PATH = path.join(process.env.alfred_workflow_data ?? __dirname, 'data.json');

export function getSuggestion(): Promise<Suggestions[]> {
  return new Promise((resolve, reject) => {
    let suggestions: Suggestions[] | null = null;

    try {
      const dataStr = fs.readFileSync(
        FILE_PATH,
        { encoding: 'utf-8' }
      );
      const { loadTime, data } = JSON.parse(dataStr);
      if (Date.now() - loadTime < 3 * 24 * 60 * 60 * 1000) suggestions = data as Suggestions[];
    } catch (e) {
    }

    if (suggestions) {
      resolve(suggestions!);
      return;
    }

    const req = https.get(suggestionURL, res => {
      if (res.statusCode !== 200) reject(res);

      let data: string = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        suggestions = JSON.parse(data);

        try {
          fs.writeFileSync(
            FILE_PATH,
            JSON.stringify({ loadTime: Date.now(), data: suggestions }, null, 2)
          )
        } catch (e) {
        }

        resolve(suggestions!);
      });
    });

    req.on('error', reject);
    req.end()
  })
}
