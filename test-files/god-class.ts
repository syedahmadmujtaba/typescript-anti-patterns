// Anti-pattern: God Class (too many methods and responsibilities)

class UserManager {
    // This class does EVERYTHING - a clear violation of Single Responsibility Principle

    method1() { return 1; }
    method2() { return 2; }
    method3() { return 3; }
    method4() { return 4; }
    method5() { return 5; }
    method6() { return 6; }
    method7() { return 7; }
    method8() { return 8; }
    method9() { return 9; }
    method10() { return 10; }
    method11() { return 11; }
    method12() { return 12; }
    method13() { return 13; }
    method14() { return 14; }
    method15() { return 15; }
    method16() { return 16; }
    method17() { return 17; }
    method18() { return 18; }
    method19() { return 19; }
    method20() { return 20; }
    method21() { return 21; }
    method22() { return 22; }

    // Even more anti-patterns within the god class
    processUserData(data: any): any {
        return data!.value! * 3.14;
    }

    createUserWithLotsOfParams(
        name: string,
        email: string,
        phone: string,
        address: string,
        city: string,
        zip: string
    ) {
        return { name, email, phone, address, city, zip };
    }
}

export default UserManager;
