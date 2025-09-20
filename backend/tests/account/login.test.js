
import { login } from '#handlers/account/login';
import { testInput } from '#tests/utils';

login(await testInput({
    login: '1',
    password: '123'
}))