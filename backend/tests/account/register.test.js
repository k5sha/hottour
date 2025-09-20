
import { register } from '#handlers/account/register'; 
import { testInput } from '#tests/utils';

register(await testInput({
    username: '1',
    email: '1@domain.com',
    password: '123',
    full_name: 'full name',
    sex: 'male',
    phone: '+38063123456789',
    birth_date: '2025-09-15',
}))