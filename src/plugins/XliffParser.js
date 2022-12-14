/*
 * XliffParser.js - common SPI for parser plugins
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

import fs from 'node:fs';
import { ResourceXliff } from 'ilib-tools-common';

import Parser from '../Parser.js';

/**
 * @class common SPI for parser plugins
 * @abstract
 */
class XliffParser extends Parser {
    /**
     * Construct a new plugin.
     */
    constructor(options) {
        super(options);
        this.path = options.filePath;
        this.xliff = new ResourceXliff({
            path: options.filePath
        });
    }

    /**
     * Parse the current file into an intermediate representation.
     */
    parse() {
        const data = fs.readFileSync(this.path, "utf-8");
        this.xliff.parse(data);
    }

    /**
     * For a "resource" type of plugin, this returns a list of Resource instances
     * that result from parsing the file.
     *
     * @returns {Array.<Resource>} list of Resource instances in this file
     */
    getResources() {
        return this.xliff.getResources();
    }
};

export default XliffParser;
