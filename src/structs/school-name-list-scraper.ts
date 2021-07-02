/* eslint-disable no-await-in-loop */
import puppeteer from 'puppeteer';
import { City } from './city-names';

export default class SchoolNameListScraper {
  private browser: puppeteer.Browser | undefined;

  private page: puppeteer.Page | undefined;

  private config: (
    puppeteer.LaunchOptions &
    puppeteer.BrowserLaunchArgumentOptions &
    puppeteer.BrowserConnectOptions &
    {
      product?: puppeteer.Product | undefined;
    }) | undefined;

  /**
   * Function initalises the Browser instance
   * @param {boolean} headless
   */
  public async init(
    headless: boolean = true,
    args: string[] = [
      '--no-sandbox',
      '--disable-setuid-sendbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  ) {
    this.config = {
      headless,
      args,
    };
    if (process.arch === 'arm' || process.arch === 'arm64') {
      // If processor architecture is arm or arm64 we need to use chromium browser
      this.config.executablePath = 'chromium-browser';
    }
    this.browser = await puppeteer.launch(this.config);
    this.page = await this.browser.newPage();
  }

  public async getSchoolList(city: City) {
    await this.page?.goto(`http://www.meb.gov.tr/baglantilar/okullar/index.php?ILKODU=${city.code}`, { timeout: 500000 });
    const listSelector: string = '//table[@id="icerik-listesi"]/tbody/tr';

    await this.page?.waitForXPath(listSelector);
    const s = await this.page?.$x(listSelector);
    const result: SchoolInformation[] = [];
    for (let i = 0; i < (s ? s?.length : 0); i += 1) {
      const schoolNameSelector: string = `${listSelector}[${i + 1}]/td[1]/a`;
      const sne = (await this.page?.$x(schoolNameSelector))![0];
      const sn = await this.page?.evaluate((e) => e.innerText, sne);
      const sl = await this.page?.evaluate((e) => e.getAttribute('href'), sne);
      const t = sn.split(' - ');
      result.push({
        cityName: t[0].trim(),
        provinceName: t[1].trim(),
        schoolName: t[2].trim(),
        url: sl.trim(),
      });
    }
    return result;
  }

  public async close() {
    await this.browser?.close();
  }
}
