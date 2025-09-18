import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';

const faqs = [
    {
        q: "Як забронювати тур?",
        a: "Ви можете забронювати тур безпосередньо на нашому сайті, заповнивши форму бронювання, або зв'язавшись з нашим менеджером за телефоном. Ми також запрошуємо вас відвідати наш офіс для особистої консультації."
    },
    {
        q: "Які способи оплати доступні?",
        a: "Ми приймаємо оплату банківським переказом, кредитною карткою (Visa, MasterCard) або готівкою в нашому офісі. Деталі оплати будуть надані після підтвердження бронювання."
    },
    {
        q: "Чи можна скасувати або змінити бронювання?",
        a: "Умови скасування або зміни туру залежать від конкретного туроператора та готелю. Будь ласка, уважно ознайомтеся з умовами бронювання або зв'яжіться з нами для отримання детальної інформації."
    },
    {
        q: "Чи надаєте ви візову підтримку?",
        a: "Так, ми надаємо повну візову підтримку для наших клієнтів. Наші фахівці допоможуть вам зібрати всі необхідні документи та подати їх у відповідне консульство чи візовий центр."
    },
    {
        q: "Що робити, якщо виникли проблеми під час подорожі?",
        a: "Наші клієнти можуть розраховувати на цілодобову підтримку. У разі виникнення будь-яких проблем, будь ласка, зателефонуйте на наш номер екстреної допомоги, і ми зробимо все можливе, щоб вам допомогти."
    }
];

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-black text-white pt-20">
            <main className="max-w-4xl mx-auto px-4 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-indigo-900/30 px-8 py-4 rounded-full mb-6">
                        <HelpCircle className="w-8 h-8 text-indigo-400" />
                        <h1 className="text-4xl font-bold">Часті запитання</h1>
                    </div>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Знайдіть відповіді на найпопулярніші запитання про наші послуги, бронювання та подорожі
                    </p>
                </div>

                {/* FAQ Section */}
                <section className="space-y-4 mb-20">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className="bg-gray-900 rounded-2xl p-6 transition-all duration-300 hover:bg-gray-800/50"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between text-left"
                            >
                                <h3 className="text-xl font-semibold pr-4">{faq.q}</h3>
                                {openIndex === index ? (
                                    <ChevronUp className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                                )}
                            </button>
                            
                            {openIndex === index && (
                                <div className="mt-4 pl-2">
                                    <div className="border-l-2 border-indigo-400 pl-4">
                                        <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                {/* Contact Support Section */}
                <section className="bg-gray-900 rounded-3xl p-12 text-center">
                    <h2 className="text-3xl font-bold mb-6">Не знайшли відповідь?</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Наша команда підтримки завжди готова допомогти вам
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                        <a 
                            href="tel:+380123456789" 
                            className="flex flex-col items-center gap-3 bg-indigo-600 hover:bg-indigo-700 p-4 rounded-2xl transition-colors duration-300"
                        >
                            <Phone className="w-8 h-8" />
                            <span>Телефон</span>
                        </a>
                        
                        <a 
                            href="mailto:info@wow-travel.com" 
                            className="flex flex-col items-center gap-3 bg-green-600 hover:bg-green-700 p-4 rounded-2xl transition-colors duration-300"
                        >
                            <Mail className="w-8 h-8" />
                            <span>Email</span>
                        </a>
                        
                        <a 
                            href="https://t.me/wow_travel" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-3 bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl transition-colors duration-300"
                        >
                            <MessageCircle className="w-8 h-8" />
                            <span>Telegram</span>
                        </a>
                    </div>
                    
                    <p className="text-gray-400 mt-8">
                        Гаряча лінія: цілодобово, 7 днів на тиждень
                    </p>
                </section>
            </main>
        </div>
    );
};

export default FAQPage;