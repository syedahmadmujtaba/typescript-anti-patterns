// Clean code example - should produce ZERO issues

interface UserConfig {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

const TAX_RATE = 0.15;
const DISCOUNT_RATE = 0.10;
const SHIPPING_FEE = 5.99;

function createUser(config: UserConfig): UserConfig {
    return config;
}

function calculateTotalPrice(basePrice: number): number {
    const tax = basePrice * TAX_RATE;
    const discount = basePrice * DISCOUNT_RATE;
    const total = basePrice + tax - discount + SHIPPING_FEE;
    return total;
}

async function fetchUserData(): Promise<string> {
    const response = await fetch('/api/user');
    const data = await response.json();
    return data?.name ?? 'Unknown';
}

class UserService {
    getUser(id: string): Promise<User | null> {
        return fetch(`/api/users/${id}`)
            .then(res => res.json())
            .catch(() => null);
    }

    updateUser(user: User): Promise<boolean> {
        return fetch(`/api/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(user)
        }).then(res => res.ok);
    }
}

interface User {
    id: string;
    name: string;
    email: string;
}

export { UserService, createUser, calculateTotalPrice, fetchUserData };
