import React from 'react';
import { Link } from 'react-router';

const HomePage = () => {
    return (
        <>
            <div id="hero">
                <h1>Турагенство "Вау"</h1>
            </div>
            <main>
                <section id="hotels">
                    <h2>Наші готелі</h2>
                    <div className="card">
                        <img src="https://placehold.co/400" alt="Hotel" />
                        <div>
                            <h3>Готель "Морський Бриз"</h3>
                            <p>Розташований на березі моря з прекрасними видами та басейном.</p>
                            <a href="#">Дізнатися більше</a>
                        </div>
                    </div>
                    <div className="card">
                        <img src="https://placehold.co/400" alt="Excursion" />
                        <div>
                            <h3>Екскурсія по місту</h3>
                            <p>Відкрийте для себе історичні пам'ятки та культурні скарби.</p>
                            <a href="#">Забронювати</a>
                        </div>
                    </div>
                </section>
                <section id="excursions">
                    <h2>Наші екскурсії</h2>
                    <div>
                        {[...Array(4)].map((_, index) => (
                            <div className="card" key={index}>
                                <img src="https://placehold.co/400" alt="Excursion" />
                                <div>
                                    <h3>Екскурсія по місту</h3>
                                    <p>Відкрийте для себе історичні пам'ятки та культурні скарби.</p>
                                    <a href="#">Забронювати</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <section id="about">
                    <div>
                        <h2>Про нас</h2>
                        <p>Ми віримо, що кожна подорож — це не просто зміна місця, а й можливість отримати незабутні емоції, відкрити нові горизонти та створити спогади на все життя. Наша мета — перетворити ваші мрії про ідеальний відпочинок на реальність.</p>
                        <p>
                            Залишились питання?<br /><br />
                            <Link to="/faq">Перегляньте FAQ →</Link>
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
};

export default HomePage;