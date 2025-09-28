const bcrypt = require('bcrypt');
async function hashPassword(pw) {
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hash = await bcrypt.hash(pw, salt);
    console.log(hash);
}


async function login(password, hashedPw) {
    const result = await bcrypt.compare(password, hashedPw);
    if (result) {
        console.log("LOGGED YOU IN! SUCCESSFUL MATCH!");
    } else {
        console.log("INCORRECT");
    }
}

login('monkey', '$2b$10$SKT9oBP9Hz.OeE8YyN2Xme39hK0G5tmxu45RLrmyMlgRGHpyqn0iS'); // example hashed password