import React, { useState } from 'react';
import {
    Layout, Button, Steps, Card, List, Typography,
    Row, Col, Space, Menu, Dropdown, message, QRCode,
    Avatar
} from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import '../App.scss';
import '../i18n';

type Consultant = {
    name: string;
    description: string;
};

type Consultants = {
    [key: string]: Consultant[];
};

const { Step } = Steps;
const { Title, Text } = Typography;

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedArea, setSelectedArea] = useState<string | null>(null);

    // Получаем локализованные данные о консультантах
    const consultants: any = t('consultantss', { returnObjects: true });
    const consultationAreas: any = t('consultationAreas', { returnObjects: true });

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
                            <Row gutter={[8, 8]}>
                                {Object.keys(consultationAreas).map((areaKey) => (
                                    <Col xs={24} sm={12} md={8} key={areaKey}>
                                        <Card hoverable className="area-card" onClick={() => { setSelectedArea(areaKey); next(); }}>
                                            <Title level={4} style={{ fontSize: '14px' }}>{consultationAreas[areaKey]}</Title>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
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
                            <Title level={3}>{t('consultantsForArea', { area: consultationAreas[selectedArea] })}</Title>
                            <List
                                itemLayout="vertical"
                                dataSource={consultants[selectedArea]}
                                renderItem={(consultant: any) => (
                                    <Card className="consultant-card">
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar size={48} shape='square' />}
                                                title={consultant.name}
                                                description={consultant.description}
                                            />
                                        </List.Item>
                                    </Card>
                                )}
                            />
                            <div className="additional-info">
                                <Title level={4}>{t('contactInfo')}</Title>
                                <Text><a href="tel: +996 (XXX) XXX-XXX">Элдияр: +996 (XXX) XXX-XXX</a></Text>
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

export default App;
