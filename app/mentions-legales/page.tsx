import Link from 'next/link';

export default function MentionsLegales() {
    return (
        <div className="py-12 sm:py-16 md:py-20">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-wood-900 mb-8">Реквизиты и правовая информация</h1>

                    <div className="space-y-8 text-wood-700">

                        {/* Informations légales & administratives */}
                        <section className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-wood-900 mb-4">Юридическая информация</h2>
                            <ul className="space-y-2">
                                <li><strong>Официальное наименование:</strong> ООО «ЛЕС»</li>
                                <li><strong>Юридический адрес:</strong> Россия, Вологодская область, Никольский район, деревня Кумбисер, д. 2а</li>
                                <li><strong>Дата регистрации:</strong> 2 октября 2017 г.</li>
                            </ul>
                        </section>

                        {/* Identifiants officiels */}
                        <section className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-wood-900 mb-4">Официальные реквизиты</h2>
                            <ul className="space-y-2">
                                <li><strong>ОГРН:</strong> 1173525030910</li>
                                <li><strong>ИНН:</strong> 3514008268</li>
                                <li><strong>КПП:</strong> 351401001</li>
                            </ul>
                        </section>

                        {/* Direction & propriétaires */}
                        <section className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-wood-900 mb-4">Руководство и собственники</h2>
                            <ul className="space-y-2">
                                <li><strong>Генеральный директор:</strong> Рыжкова Елена Васильевна</li>
                                <li><strong>Владелец / Учредитель:</strong> Рыжкова Елена Васильевна (100% уставного капитала)</li>
                            </ul>
                        </section>

                        {/* Activités déclarées */}
                        <section className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-wood-900 mb-4">Виды деятельности</h2>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Распиловка и строгание древесины</li>
                                <li>Лесозаготовки</li>
                                <li>Оптовая торговля лесоматериалами и строительными материалами (агент)</li>
                            </ul>
                        </section>

                        {/* Contacts disponibles */}
                        <section className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-wood-900 mb-4">Контакты</h2>
                            <p><strong>Email:</strong> <a href="mailto:LES3514008268@MAIL.RU" className="text-fire-600 hover:text-fire-700">LES3514008268@MAIL.RU</a></p>
                        </section>

                        <div className="mt-8 text-center">
                            <Link href="/" className="text-fire-600 hover:text-fire-700 font-semibold transition">
                                Вернуться на главную
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
