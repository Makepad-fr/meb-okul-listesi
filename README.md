# school-names-turkey

A npm package that scrapes all school names in Turkey.

## To install

```sh
npm i school-names-turkey
```

## Usage example

```ts
import { writeFileSync } from 'fs';
import {default as getSchoolNames, SchoolInformation } from '@makepad/school-names-turkey';

getSchoolNames(true).then((result) =>   writeFileSync('result.json', JSON.stringify(result, undefined, 4), { encoding: 'utf-8' }));
```