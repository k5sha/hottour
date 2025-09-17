import React from 'react';

const LoginPage = () => {
    return (
        <main>
            <section id="login">
                <h2>Вхід</h2>
                <form method="post" action="/api/login">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" />
                    <label htmlFor="password">Пароль</label>
                    <input type="password" name="password" id="password" />
                    <input className="button" type="submit" value="Увійти" />
                </form>
            </section>
        </main>
    );
};

export default LoginPage;