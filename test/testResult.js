/*
 * testResult.js - test the result object
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

import Result from '../src/Result.js';
import ResourceQuoteStyle from '../src/rules/ResourceQuoteStyle.js';

const rule = new ResourceQuoteStyle();

export const testResult = {
    testResultNormal: function(test) {
        test.expect(1);

        const result = new Result({
            severity: "warning",
            pathName: "a/b/c.js",
            description: "test",
            rule
        });

        test.ok(result);

        test.done();
    },

    testResultFull: function(test) {
        test.expect(8);

        const result = new Result({
            severity: "warning",
            pathName: "a/b/c.js",
            description: "test",
            id: "x",
            highlight: "test<e0/>",
            lineNumber: 23,
            locale: "de-DE",
            rule
        });

        test.ok(result);
        
        test.equal(result.severity, "warning");
        test.equal(result.pathName, "a/b/c.js");
        test.equal(result.description, "test");
        test.equal(result.id, "x");
        test.equal(result.highlight, "test<e0/>");
        test.equal(result.lineNumber, 23);
        test.equal(result.locale, "de-DE");

        test.done();
    },

    testResultNormalizeSeverity: function(test) {
        test.expect(4);

        const result = new Result({
            severity: "issue",
            pathName: "a/b/c.js",
            description: "test",
            rule
        });

        test.ok(result);
        test.equal(result.severity, "warning");
        test.equal(result.pathName, "a/b/c.js");
        test.equal(result.description, "test");

        test.done();
    },

    testResultMissingSeverity: function(test) {
        test.expect(1);

        test.throws(test => {
            new Result({
                pathName: "a/b/c.js",
                description: "test",
                rule
            });
        });

        test.done();
    },

    testResultMissingPathName: function(test) {
        test.expect(1);

        test.throws(test => {
            new Result({
                severity: "issue",
                description: "test",
                rule
            });
        });

        test.done();
    },

    testResultMissingDescription: function(test) {
        test.expect(1);

        test.throws(test => {
            new Result({
                severity: "issue",
                pathName: "a/b/c.js",
                rule
            });
        });

        test.done();
    },

    testResultMissingRule: function(test) {
        test.expect(1);

        test.throws(test => {
            new Result({
                severity: "issue",
                pathName: "a/b/c.js",
                description: "test"
            });
        });

        test.done();
    },

    testResultMissingEverything: function(test) {
        test.expect(1);

        test.throws(test => {
            new Result({});
        });

        test.done();
    },

    testResultMissingParameter: function(test) {
        test.expect(1);

        test.throws(test => {
            new Result();
        });

        test.done();
    },
};

