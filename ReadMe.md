# Typescript Declaration Json

Simple package which reads typescript source files in modules and returns the declarations in JSON format

## Usage

```sh
npm i ts-declaration-json
```

```js
import { getModuleDeclarations } from "ts-declaration-json";

const result = await getModuleDeclarations(pathToModule);
```

## Example Output

```json
{
    "WeekdaysProps": {
        "name": "WeekdaysProps",
        "implementation": {
            "calendarType": {
                "optional": false,
                "type": {
                    "text": "CalendarType | undefined",
                    "type": ["CalendarType", "undefined"]
                },
                "text": "calendarType: CalendarType | undefined;"
            },
            "formatShortWeekday": {
                "optional": true,
                "type": "string",
                "text": "formatShortWeekday?: typeof defaultFormatShortWeekday;"
            },
            "formatWeekday": {
                "optional": true,
                "type": "string",
                "text": "formatWeekday?: typeof defaultFormatWeekday;"
            },
            "locale": {
                "optional": true,
                "type": "string",
                "text": "locale?: string;"
            },
            "onMouseLeave": {
                "optional": true,
                "type": {
                    "type": "function",
                    "text": "() => void"
                },
                "text": "onMouseLeave?: () => void;"
            }
        },
        "text": "type WeekdaysProps = {\n    /**\n     * Type of calendar that should be used. Can be `'gregory`, `'hebrew'`, `'islamic'`, `'iso8601'`. Setting to `\"gregory\"` or `\"hebrew\"` will change the first day of the week to Sunday. Setting to `\"islamic\"` will change the first day of the week to Saturday. Setting to `\"islamic\"` or `\"hebrew\"` will make weekends appear on Friday to Saturday.\n     *\n     * @example 'iso8601'\n     */\n    calendarType: CalendarType | undefined;\n    /**\n     * Function called to override default formatting of weekday names (shortened). Can be used to use your own formatting function.\n     *\n     * @example (locale, date) => formatDate(date, 'dd')\n     */\n    formatShortWeekday?: typeof defaultFormatShortWeekday;\n    /**\n     * Function called to override default formatting of weekday names. Can be used to use your own formatting function.\n     *\n     * @example (locale, date) => formatDate(date, 'dd')\n     */\n    formatWeekday?: typeof defaultFormatWeekday;\n    /**\n     * Locale that should be used by the calendar. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag). **Note**: When using SSR, setting this prop may help resolving hydration errors caused by locale mismatch between server and client.\n     *\n     * @example 'hu-HU'\n     */\n    locale?: string;\n    onMouseLeave?: () => void;\n};"
    }
}
```

## warning

Implementation is not full a lot of edge cases weren't considered and need work. The purpose of this was to parse out Props from react components from packages that aren't well known
