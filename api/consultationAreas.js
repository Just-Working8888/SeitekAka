export default function handler(req, res) {
    if (req.method === 'GET') {
        // Возвращаем список сфер консультаций
        res.status(200).json([
            { id: 1, title_ru: "Стратегия и бизнес-планирование", title_kg: "Стратегия жана бизнес-пландоо" },
            { id: 2, title_ru: "Маркетинг и брендинг", title_kg: "Маркетинг жана брендинг" }
        ]);
    } else {
        // Обрабатываем другие HTTP методы
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
