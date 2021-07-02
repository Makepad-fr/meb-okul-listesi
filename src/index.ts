import cityNames, { City } from './structs/city-names';
import SchoolInformation from './structs/school-information';
import SchoolNameListScraper from './structs/school-name-list-scraper';

export default async function (
  headless: boolean = true,
  browserArguments?: string[],
): Promise<SchoolInformation[]> {
  const bot: SchoolNameListScraper = new SchoolNameListScraper();
  await bot.init(headless, browserArguments);
  const result: SchoolInformation[] = [];
  for (let i = 0; i < cityNames.length; i += 1) {
    const c: City = cityNames[i];
    // eslint-disable-next-line no-await-in-loop
    const s = await bot.getSchoolList(c);
    result.push(...(s));
  }
  await bot.close();
  return result;
}
export { SchoolInformation };
