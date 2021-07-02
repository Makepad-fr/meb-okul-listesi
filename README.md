# school-names-turkey

A npm package that scrapes all school names in Turkey.

## To install

```sh
npm i school-names-turkey
```

## Usage example

```ts
import { writeFileSync } from 'fs';
import SchoolNameListScraper from './structs/school-name-list-scraper';
import cityNames, { City } from './structs/city-names';

async function main() {
  const bot: SchoolNameListScraper = new SchoolNameListScraper();
  await bot.init(true);
  const result: SchoolInformation[] = [];
  for (let i = 0; i < cityNames.length; i += 1) {
    const c: City = cityNames[i];
    console.log(`Scraping ${c.name}`);
    // eslint-disable-next-line no-await-in-loop
    const s = await browser.getSchoolList(c);
    result.push(...(s));
  }
  await bot.close();
  return result;
}

main().then((result) =>   writeFileSync('result.json', JSON.stringify(result, undefined, 4), { encoding: 'utf-8' }));
```