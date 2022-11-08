import type { ScriptFilter, ScriptFilterItem } from 'alfred-types';
import * as process from "process";
import { getSuggestion } from "./suggestion";

const input = process.argv[2];
const output: ScriptFilter = { items: [] };

const MDN_ORIGIN = 'https://developer.mozilla.org';

const fallback: ScriptFilterItem = {
  title: '0 Doc Found',
  subtitle: `Search MDN for ${ input }`,
  valid: true,
  arg: `${ MDN_ORIGIN }?q=${ input }`,
  variables: {
    mdn: 'true'
  }
};


(async function () {

  const suggestions = await getSuggestion();

  const queries = input
    .split(/ +/)
    .map(query => query.toLowerCase());

  output.items = suggestions
    .filter(suggest => queries.every(query => suggest.title.toLowerCase().includes(query)))
    .map(({ title, url }) => {
      return {
        valid: true,
        title: title,
        subtitle: url,
        arg: MDN_ORIGIN + url,
        quicklookurl: MDN_ORIGIN + url,
      }
    })

  !output.items.length && output.items.push(fallback);

  console.log(JSON.stringify(output, undefined, 2));

})();
