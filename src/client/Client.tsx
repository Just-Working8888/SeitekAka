import React, { useState, useEffect } from 'react';
import {
    Layout, Button, Steps, Card, List, Typography,
    Row, Col, Space, Menu, Dropdown, message, QRCode,
    Avatar
} from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../App.scss';
import '../i18n';

const { Step } = Steps;
const { Title, Text } = Typography;

const Client: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedArea, setSelectedArea] = useState<string | null>(null);
    const [areas, setAreas] = useState<any>([]);
    const [consultants, setConsultants] = useState<any>([]);
    const [loadingAreas, setLoadingAreas] = useState(false);
    const [loadingConsultants, setLoadingConsultants] = useState(false);

    const API_BASE_URL = 'https://seitek-aka-tyaz.vercel.app/api'

    // Fetch data from server
    const fetchAreas = async () => {
        setLoadingAreas(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/consultationAreas`);
            setAreas(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке сфер консультаций:', error);
            message.error('Ошибка при загрузке сфер консультаций');
        } finally {
            setLoadingAreas(false);
        }
    };

    const fetchConsultants = async () => {
        setLoadingConsultants(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/consultants`);
            setConsultants(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке консультантов:', error);
            message.error('Ошибка при загрузке консультантов');
        } finally {
            setLoadingConsultants(false);
        }
    };

    useEffect(() => {
        fetchAreas();
        fetchConsultants();
    }, []);

    const next = () => setCurrentStep(prev => prev + 1);
    const prev = () => setCurrentStep(prev => prev - 1);

    const handleLanguageChange = ({ key }: any) => {
        i18n.changeLanguage(key);
        message.success(t('languageChanged'));
    };

    const languageMenu = (
        <Menu onClick={handleLanguageChange}>
            <Menu.Item key="ru">{t('russian')}</Menu.Item>
            <Menu.Item key="kg">{t('kyrgyz')}</Menu.Item>
        </Menu>
    );
    console.log('Selected Area:', selectedArea);
    console.log('Consultants:', consultants);
    
    return (
        <Layout className="consultation-layout">
            <Layout.Header className="header">
                <div className="logo">{t('consultations')}</div>
                <Dropdown overlay={languageMenu} placement="bottomRight">
                    <Button icon={<GlobalOutlined />} shape="circle" />
                </Dropdown>
            </Layout.Header>

            <Layout.Content className="content">
                <Card className="consultation-card">
                    <Steps current={currentStep} className="steps" size="small">
                        <Step title={t('language')} />
                        <Step title={t('consultationArea')} />
                        <Step title={t('consultants')} />
                    </Steps>

                    {/* Шаг 1: Выбор языка */}
                    {currentStep === 0 && (
                        <div className="step-content">
                            <Title level={3}>{t('welcome')}</Title>
                            <Text>{t('chooseLanguage')}</Text>
                            <div className="language-buttons">
                                <Button onClick={() => i18n.changeLanguage('ru')} type={i18n.language === 'ru' ? 'primary' : 'default'}>
                                    {t('russian')}
                                </Button>
                                <Button onClick={() => i18n.changeLanguage('kg')} type={i18n.language === 'kg' ? 'primary' : 'default'}>
                                    {t('kyrgyz')}
                                </Button>
                            </div>
                            <Button type="primary" onClick={next} size="small" icon={<RightOutlined />}>
                                {t('next')}
                            </Button>
                        </div>
                    )}

                    {/* Шаг 2: Выбор сферы консультации */}
                    {currentStep === 1 && (
                        <div className="step-content">
                            <Title level={3}>{t('consultationArea')}</Title>
                            {loadingAreas ? (
                                <p>{t('loading')}...</p>
                            ) : (
                                <Row gutter={[8, 8]}>
                                    {areas.map((area: any) => (
                                        <Col xs={24} sm={12} md={8} key={area.id}>
                                            <Card hoverable className="area-card" onClick={() => { setSelectedArea(area.key); next(); }}>
                                                <Title level={4} style={{ fontSize: '14px' }}>
                                                    {i18n.language === 'ru' ? area.title_ru : area.title_kg}
                                                </Title>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                            <br />
                            <Space>
                                <Button onClick={prev} size="small" icon={<LeftOutlined />}>
                                    {t('back')}
                                </Button>
                            </Space>
                        </div>
                    )}

                    {/* Шаг 3: Список консультантов */}
                    {currentStep === 2 && selectedArea && (
                        <div className="step-content">
                            <Title level={3}>
                                {t('consultantsForArea', { area: areas.find((area: any) => area.key === selectedArea)?.title_ru })}
                            </Title>
                            {loadingConsultants ? (
                                <p>{t('loading')}...</p>
                            ) : (
                                <List
                                    itemLayout="vertical"
                                    dataSource={consultants.filter((consultant: any) => consultant.area === selectedArea)}
                                    renderItem={(consultant: any) => (
                                        <Card className="consultant-card">
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar size={48} shape='square' />}
                                                    title={consultant.name}
                                                    description={i18n.language === 'ru' ? consultant.description_ru : consultant.description_kg}
                                                />
                                            </List.Item>
                                        </Card>
                                    )}
                                />
                            )}
                            <div className="additional-info">
                                <Title level={4}>{t('contactInfo')}</Title>
                                <Text>Элдияр: +996 (XXX) XXX-XXX</Text>
                            </div>
                            <div className="qr-section">
                                <Title level={4}>{t('qrCode')}</Title>
                                <QRCode value="https://yourwebsite.com" size={100} />
                            </div>
                            <br />
                            <Space>
                                <Button onClick={prev} size="small" icon={<LeftOutlined />}>
                                    {t('back')}
                                </Button>
                            </Space>
                        </div>
                    )}
                </Card>
            </Layout.Content>

            <Layout.Footer className="footer">
                © {new Date().getFullYear()} {t('allRightsReserved')}
            </Layout.Footer>
        </Layout>
    );
};

export default Client;
