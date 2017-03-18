# npm-check

Finds multiple modules versions in your node_modules

## Why?
It is possible that a single package gets included multiple times in your bundle due to different package versions, resulting in extra bloat and may lead to bugs.

## Install
npm i @streamrail/npm-check --save-dev

## Usage 
I recommend running this script before your tests in the following way:

In package.json:
```
"scripts": {
  "test": "node node_modules/@streamrail/npm-check/npm-check.js && ... build && ... test",
},
```

The default behaviour of the script is to exit with error when multiple versions found.

## Output examples:
Valid:

![valid](https://cloud.githubusercontent.com/assets/5019994/24069225/694b1082-0bab-11e7-8332-a6f7177c2475.png)

Invalid:

![invalid](https://cloud.githubusercontent.com/assets/5019994/24069132/3adea076-0ba9-11e7-99e5-d154d420867f.png)
