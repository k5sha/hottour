
import { login } from '#handlers/account/login';
import { testInput } from '#tests/utils';

login(await testInput({
    login: '38063123456789',
    password: '123'
}))