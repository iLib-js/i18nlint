/*
 * testRegExpRules.js - test the built-in regular-expression-based rules
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
import { ResourceString } from 'ilib-tools-common';

import ResourceRegExpChecker from '../src/rules/ResourceRegExpChecker.js';

import Result from '../src/Result.js';

const rules = {
    url: {
        name: "resource-url-match",
        description: "Ensure that URLs that appear in the source string are also used in the translated string",
        note: "URL '{matchString}' from source string does not appear in target string",
        regexps: [ "((https?|github|ftps?|mailto|file|data|irc):\\/\\/)([\\da-zA-Z\\.-]+)\\.([a-zA-Z\\.]{2,6})([\\/\w\\.-]*)*\\/?" ]
    },
    namedParams: {
        name: "resource-named-params",
        description: "Ensure that named parameters that appear in the source string are also used in the translated string",
        note: "The named parameter '{matchString}' from the source string does not appear in the target string",
        regexps: [ "\\{\\w+\\}" ]
    }
};

export const testRegExpRules = {
    testResourceRegExpChecker: function(test) {
        test.expect(1);

        const rule = new ResourceRegExpChecker(rules.url);
        test.ok(rule);

        test.done();
    },

    testResourceRegExpCheckerMissingName: function(test) {
        test.expect(1);

        test.throws(() => {
            const rule = new ResourceRegExpChecker({
                description: "a",
                note: "b",
                regexps: [ "a" ]
            });
        });

        test.done();
    },

    testResourceRegExpCheckerMissingDescription: function(test) {
        test.expect(1);

        test.throws(() => {
            const rule = new ResourceRegExpChecker({
                name: "a",
                note: "b",
                regexps: [ "a" ]
            });
        });

        test.done();
    },

    testResourceRegExpCheckerMissingNote: function(test) {
        test.expect(1);

        test.throws(() => {
            const rule = new ResourceRegExpChecker({
                name: "a",
                description: "a",
                regexps: [ "a" ]
            });
        });

        test.done();
    },

    testResourceRegExpCheckerMissingRegexps: function(test) {
        test.expect(1);

        test.throws(() => {
            const rule = new ResourceRegExpChecker({
                name: "a",
                description: "a",
                note: "b"
            });
        });

        test.done();
    },

    testResourceURLMatch: function(test) {
        test.expect(2);

        const rule = new ResourceRegExpChecker(rules.url);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'This has an URL in it http://www.box.com',
                targetLocale: "de-DE",
                target: "Dies hat ein URL http://www.box.com",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceURLMatchMismatch: function(test) {
        test.expect(9);

        const rule = new ResourceRegExpChecker(rules.url);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'This has an URL in it http://www.box.com',
                targetLocale: "de-DE",
                target: "Dies hat ein URL http://www.yahoo.com",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.equal(actual.length, 1);

        test.equal(actual[0].severity, "error");
        test.equal(actual[0].id, "url.test");
        test.equal(actual[0].description, "URL 'http://www.box.com' from source string does not appear in target string");
        test.equal(actual[0].highlight, "Target: Dies hat ein URL http://www.yahoo.com<e0></e0>");
        test.equal(actual[0].source, 'This has an URL in it http://www.box.com');
        test.equal(actual[0].pathName, "x/y");

        test.done();
    },

    testResourceURLMatchMultiple: function(test) {
        test.expect(2);

        const rule = new ResourceRegExpChecker(rules.url);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'This has a few URLs in it http://www.box.com http://www.google.com/',
                targetLocale: "de-DE",
                target: "Dies hat ein URL http://www.box.com http://www.google.com/",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceURLMatchMultipleReverseOrder: function(test) {
        test.expect(2);

        const rule = new ResourceRegExpChecker(rules.url);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'This has a few URLs in it http://www.box.com http://www.google.com/',
                targetLocale: "de-DE",
                target: "Dies hat ein URL http://www.google.com/ http://www.box.com",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceURLMatchMultipleMissing: function(test) {
        test.expect(3);

        const rule = new ResourceRegExpChecker(rules.url);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'This has a few URLs in it http://www.box.com http://www.google.com/',
                targetLocale: "de-DE",
                target: "Dies hat ein URL http://www.google.com/",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.equal(actual.length, 1);

        test.done();
    },

    testResourceURLNonMatch1: function(test) {
        test.expect(2);

        const rule = new ResourceRegExpChecker(rules.url);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'Click on the menu choice "Open with..." to select a different program.',
                targetLocale: "de-DE",
                target: 'Klicken Sie auf die Menüauswahl "Öffnen mit...", um ein anderes Programm auszuwählen.',
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceURLNonMatch2: function(test) {
        test.expect(2);

        const rule = new ResourceRegExpChecker(rules.url);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'You can remove any of these to reset the association. (e.g. removing an association will allow you to use another acccount.)',
                targetLocale: "de-DE",
                target: 'Sie können diese entfernen, um die Zuordnung zurückzusetzen. (z.B. Wenn Sie eine Verknüpfung entfernen, können Sie ein anderes Konto verwenden.)',
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceNamedParamsMatch: function(test) {
        test.expect(9);

        const rule = new ResourceRegExpChecker(rules.namedParams);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'This has an {URL} in it.',
                targetLocale: "de-DE",
                target: "Dies hat ein {job} drin.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.equal(actual.length, 1);

        test.equal(actual[0].severity, "error");
        test.equal(actual[0].id, "url.test");
        test.equal(actual[0].description, "The named parameter '{URL}' from the source string does not appear in the target string");
        test.equal(actual[0].highlight, "Target: Dies hat ein {job} drin.<e0></e0>");
        test.equal(actual[0].source, 'This has an {URL} in it.');
        test.equal(actual[0].pathName, "x/y");

        test.done();
    },

    testResourceNamedParamsNoMatch: function(test) {
        test.expect(2);

        const rule = new ResourceRegExpChecker(rules.namedParams);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'This has an {job} in it.',
                targetLocale: "de-DE",
                target: "Dies hat ein {job} drin.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceNamedParamsNoMatchCapitals: function(test) {
        test.expect(2);

        const rule = new ResourceRegExpChecker(rules.namedParams);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'This has an {URL} in it.',
                targetLocale: "de-DE",
                target: "Dies hat ein {URL} drin.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceNamedParamsMatch: function(test) {
        test.expect(9);

        const rule = new ResourceRegExpChecker(rules.namedParams);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'This has an {URL} in it.',
                targetLocale: "de-DE",
                target: "Dies hat ein {job} drin.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.equal(actual.length, 1);

        test.equal(actual[0].severity, "error");
        test.equal(actual[0].id, "url.test");
        test.equal(actual[0].description, "The named parameter '{URL}' from the source string does not appear in the target string");
        test.equal(actual[0].highlight, "Target: Dies hat ein {job} drin.<e0></e0>");
        test.equal(actual[0].source, 'This has an {URL} in it.');
        test.equal(actual[0].pathName, "x/y");

        test.done();
    },

    testResourceNamedParamsNotInPlurals: function(test) {
        test.expect(2);

        const rule = new ResourceRegExpChecker(rules.namedParams);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'In {number} {days, plural, one {day} other {days}}',
                targetLocale: "de-DE",
                target: "In {number} {days, plural, one {Tag} other {Tagen}}",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });

        // {day} is part of the plural, not a replacement param
        test.ok(!actual);

        test.done();
    },

    testResourceNamedParamsNotInPluralsButOutsideOfThem: function(test) {
        test.expect(9);

        const rule = new ResourceRegExpChecker(rules.namedParams);
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: 'In {number} {days, plural, one {day} other {days}}',
                targetLocale: "de-DE",
                target: "In {num} {days, plural, one {Tag} other {Tagen}}",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(actual);
        test.equal(actual.length, 1);

        test.equal(actual[0].severity, "error");
        test.equal(actual[0].id, "url.test");
        test.equal(actual[0].description, "The named parameter '{number}' from the source string does not appear in the target string");
        test.equal(actual[0].highlight, "Target: In {num} {days, plural, one {Tag} other {Tagen}}<e0></e0>");
        test.equal(actual[0].source, 'In {number} {days, plural, one {day} other {days}}');
        test.equal(actual[0].pathName, "x/y");

        test.done();
    }
};

