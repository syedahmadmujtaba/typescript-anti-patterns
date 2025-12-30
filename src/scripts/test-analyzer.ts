
import { analyzeCode } from '../lib/analyzer';

const badCode = `
// 1. Any Type Abuse
function process(data: any): any {
    return data;
}

// 2. Long Parameter List
function createUser(name: string, age: number, email: string, address: string, phone: string) {
    console.log(name);
}

// 3. Magic Numbers
const total = price * 1.15;

// 4. God Class
class God {
    method1() {}
    method2() {}
    method3() {}
    method4() {}
    method5() {}
    method6() {}
    method7() {}
    method8() {}
    method9() {}
    method10() {}
    method11() {}
    method12() {}
    method13() {}
    method14() {}
    method15() {}
    method16() {}
    method17() {}
    method18() {}
    method19() {}
    method20() {}
    method21() {} // Limit is 20
}

// 5. Callback Hell
function doSomething() {
    a(() => {
        b(() => {
            c(() => {
                d(() => {
                    e(() => {
                        console.log('doom');
                    })
                })
            })
        })
    })
}

// 6. Non-Null Assertion
const name = user!.name;
`;

const results = analyzeCode(badCode);

console.log('--- Analysis Results ---');
console.log(JSON.stringify(results, null, 2));

const expectedIds = [
    'any-type',
    'any-type', // return type
    'long-param-list',
    'magic-number',
    'god-class',
    'callback-hell',
    'non-null-assertion'
];

let pass = true;
expectedIds.forEach(id => {
    if (!results.find(r => r.id === id)) {
        console.error(`FAILED: Expected ${id} to be detected.`);
        pass = false;
    }
});

if (pass) {
    console.log('SUCCESS: All patterns detected.');
} else {
    console.log('FAILED: Some patterns were missed.');
    process.exit(1);
}
