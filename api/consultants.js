export default function handler(req, res) {
    if (req.method === 'GET') {
        // Возвращаем список консультантов
        res.status(200).json([
            { id: 1, name: 'Алексей Иванов', description_ru: 'Эксперт по бизнес-планированию' },
            { id: 2, name: 'Мария Петрова', description_ru: 'Специалист по стратегии' },
        ]);
    } else {
        // Обрабатываем другие методы
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
