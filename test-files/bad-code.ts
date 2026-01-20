// Test file with multiple anti-patterns

// Anti-pattern 1: Any Type Abuse
function processData(input: any): any {
    return input;
}

// Anti-pattern 2: Long Parameter List (> 3 params)
function createUser(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    city: string
) {
    return { firstName, lastName, email, phone, address, city };
}

// Anti-pattern 3: Magic Numbers
function calculatePrice(basePrice: number): number {
    const tax = basePrice * 1.15; // Magic number!
    const discount = basePrice * 0.85; // Another one!
    return tax - discount + 25; // And another!
}

// Anti-pattern 4: Non-Null Assertion Abuse
function getUserName(user: { name?: string }): string {
    return user.name!.toUpperCase()!;
}

// Anti-pattern 5: Callback Hell (deep nesting)
function fetchData() {
    getData((data) => {
        processData((processed) => {
            validateData((validated) => {
                saveData((saved) => {
                    notifyUser((response) => {
                        logResult((logged) => {
                            console.log('Done!');
                        });
                    });
                });
            });
        });
    });
}

// Mixing multiple anti-patterns
function badFunction(a: any, b: any, c: any, d: any, e: any): any {
    const result = a! * 3.14159 + b! * 2.71828;
    return result;
}
