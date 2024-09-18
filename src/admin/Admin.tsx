import React, { useEffect, useState } from 'react';
import { Layout, Button, Table, Form, Input, Modal, message, Select, Tabs } from 'antd';
import axios from 'axios';

const { Header, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

const AdminPanel: React.FC = () => {
    const [areas, setAreas] = useState<any>([]);
    const [consultants, setConsultants] = useState<any>([]);
    const [editingConsultant, setEditingConsultant] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAreaModalVisible, setIsAreaModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [areaForm] = Form.useForm();

    // Получаем данные с сервера
    const fetchAreas = async () => {
        try {
            const response = await axios.get('http://localhost:5888/consultationAreas');
            setAreas(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке сфер консультаций:', error);
        }
    };

    const fetchConsultants = async () => {
        try {
            const response = await axios.get('http://localhost:5888/consultants');
            setConsultants(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке консультантов:', error);
        }
    };

    useEffect(() => {
        fetchAreas();
        fetchConsultants();
    }, []);

    // Открытие модального окна для редактирования консультанта
    const handleEditConsultant = (consultant: any) => {
        setEditingConsultant(consultant);
        form.setFieldsValue(consultant);
        setIsModalVisible(true);
    };

    // Сохранение изменений консультанта
    const handleSaveConsultant = async (values: any) => {
        try {
            if (editingConsultant) {
                await axios.put(`http://localhost:5888/consultants/${editingConsultant.id}`, values);
                message.success('Консультант успешно обновлен');
            } else {
                await axios.post('http://localhost:5888/consultants', values);
                message.success('Консультант успешно добавлен');
            }
            fetchConsultants();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Ошибка при сохранении консультанта:', error);
            message.error('Не удалось сохранить консультанта');
        }
    };

    // Добавление новой сферы консультации
    const handleAddArea = async (values: any) => {
        try {
            await axios.post('http://localhost:5888/consultationAreas', values);
            message.success('Сфера консультации успешно добавлена');
            fetchAreas();
            setIsAreaModalVisible(false);
        } catch (error) {
            console.error('Ошибка при добавлении сферы консультации:', error);
            message.error('Не удалось добавить сферу консультации');
        }
    };

    // Удаление консультанта
    const handleDeleteConsultant = async (id: any) => {
        try {
            await axios.delete(`http://localhost:5888/consultants/${id}`);
            message.success('Консультант успешно удален');
            fetchConsultants();
        } catch (error) {
            console.error('Ошибка при удалении консультанта:', error);
            message.error('Не удалось удалить консультанта');
        }
    };

    // Колонки для таблицы консультантов
    const consultantColumns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Описание (РУ)',
            dataIndex: 'description_ru',
            key: 'description_ru',
        },
        {
            title: 'Описание (КГ)',
            dataIndex: 'description_kg',
            key: 'description_kg',
        },
        {
            title: 'Сфера консультации',
            dataIndex: 'area',
            key: 'area',
            render: (areaKey: string) => {
                const area = areas.find((a: any) => a.key === areaKey);
                return area ? area.title_ru : 'Неизвестная сфера';
            }
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (text: any, record: any) => (
                <>
                    <Button onClick={() => handleEditConsultant(record)}>Редактировать</Button>
                    <Button danger onClick={() => handleDeleteConsultant(record.id)} style={{ marginLeft: '10px' }}>Удалить</Button>
                </>
            ),
        },
    ];

    return (
        <Layout>
            <Header className="header">
                <div className="logo">Админ Панель</div>
            </Header>
            <Content className="content">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Консультанты" key="1">
                        <h2>Консультанты</h2>
                        <Button type="primary" onClick={() => { setEditingConsultant(null); setIsModalVisible(true); }}>Добавить консультанта</Button>
                        <Table columns={consultantColumns} dataSource={consultants} rowKey="id" style={{ marginTop: '20px' }} />
                    </TabPane>

                    <TabPane tab="Сферы консультаций" key="2">
                        <h2>Сферы консультаций</h2>
                        <Button type="primary" onClick={() => setIsAreaModalVisible(true)}>Добавить сферу консультации</Button>
                        <Table
                            columns={[
                                { title: 'Название (РУ)', dataIndex: 'title_ru', key: 'title_ru' },
                                { title: 'Название (КГ)', dataIndex: 'title_kg', key: 'title_kg' },
                            ]}
                            dataSource={areas}
                            rowKey="id"
                            style={{ marginTop: '20px' }}
                        />
                    </TabPane>
                </Tabs>

                {/* Модальное окно для добавления/редактирования консультанта */}
                <Modal
                    title={editingConsultant ? 'Редактировать консультанта' : 'Добавить консультанта'}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onOk={() => form.submit()}
                >
                    <Form form={form} layout="vertical" onFinish={handleSaveConsultant}>
                        <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description_ru" label="Описание (РУ)" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description_kg" label="Описание (КГ)" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="area" label="Сфера консультации" rules={[{ required: true }]}>
                            <Select>
                                {areas.map((area: any) => (
                                    <Option key={area.key} value={area.key}>
                                        {area.title_ru}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Модальное окно для добавления сферы консультации */}
                <Modal
                    title="Добавить сферу консультации"
                    visible={isAreaModalVisible}
                    onCancel={() => setIsAreaModalVisible(false)}
                    onOk={() => areaForm.submit()}
                >
                    <Form form={areaForm} layout="vertical" onFinish={handleAddArea}>
                        <Form.Item name="title_ru" label="Название (РУ)" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="title_kg" label="Название (КГ)" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="key" label="Ключ" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default AdminPanel;
