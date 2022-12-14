/*
 * FormatterFactory.js - Factory to create and return the right formatter
 *
 * Copyright © 2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import AnsiConsoleFormatter from './formatters/AnsiConsoleFormatter.js';

const formatterCache = {};

const cfmt = new AnsiConsoleFormatter();
formatterCache[cfmt.getName()] = cfmt;

/**
 * @class Represent an output formatter
 * @abstract
 */
function FormatterFactory(options) {
    let fmt = formatterCache[cfmt.getName()];

    if (options && options.formatter && formatterCache[options.formatter]) {
        fmt = formatterCache[options.formatter];
    }

    return fmt;
}

export default FormatterFactory;