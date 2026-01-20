// React component with code smells

import React from 'react';

// Anti-pattern: Any type abuse in props
interface BadProps {
    data: any;
    onClick: any;
    config: any;
}

// Anti-pattern: Long parameter list in function
function setupComponent(
    theme: string,
    locale: string,
    apiKey: string,
    timeout: number,
    retries: number
) {
    return { theme, locale, apiKey, timeout, retries };
}

// Anti-pattern: Magic numbers in component
export default function BadComponent({ data, onClick, config }: BadProps) {
    const [count, setCount] = React.useState(0);

    // Magic numbers everywhere!
    const handleClick = () => {
        if (count < 100) {
            setCount(count + 5);
        }

        // Non-null assertion abuse
        const value = data!.items![0]!.value!;

        // More magic numbers
        setTimeout(() => {
            onClick!(value * 1.5);
        }, 3000);
    };

    // Callback hell in React
    React.useEffect(() => {
        fetchUser((user) => {
            getUserPosts((posts) => {
                getComments((comments) => {
                    processData((result) => {
                        updateUI((updated) => {
                            console.log('All done!');
                        });
                    });
                });
            });
        });
    }, []);

    return (
        <div style={{ padding: 20, margin: 15, fontSize: 16 }}>
            <h1>Count: {count}</h1>
            <button onClick={handleClick}>
                Increment by 5
            </button>
        </div>
    );
}

// Helper functions (with intentional bad patterns)
function fetchUser(callback: any) {
    setTimeout(() => callback({}), 1000);
}

function getUserPosts(callback: any) {
    setTimeout(() => callback([]), 1000);
}

function getComments(callback: any) {
    setTimeout(() => callback([]), 1000);
}

function processData(callback: any) {
    setTimeout(() => callback({}), 1000);
}

function updateUI(callback: any) {
    setTimeout(() => callback(true), 1000);
}
