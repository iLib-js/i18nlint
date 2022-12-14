/*
 * XliffPlugin.js - plugin that can parse an Xliff file
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

import Plugin from '../Plugin.js';
import XliffParser from './XliffParser.js';

/**
 * @class Plugin that can parse XLIFF files
 */
class XliffPlugin extends Plugin {
    /**
     *
     */
    constructor(options) {
        super(options);
    }

    /**
     * @override
     */
    getType() {
        return "parser";
    }

    /**
     * @override
     */
    getExtensions() {
        return ["xliff", "xlif", "xlf"];
    }

    /**
     * For a "parser" type of plugin, this returns a list of Parser classes
     * that this plugin implements.
     *
     * @returns {Array.<Parser>} list of Parser classes implemented by this
     * plugin
     */
    getParsers() {
        return [XliffParser];
    }
};

export default XliffPlugin;
