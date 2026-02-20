import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CheckoutStep {
    id: 'address' | 'payment' | 'review' | 'confirmation';
    title: string;
}

interface AddressData {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
}

interface ShippingOption {
    service: string;
    deliveryTime: string;
    price: number;
}

export function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<CheckoutStep['id']>('address');
    const [addressData, setAddressData] = useState<AddressData>({
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
    });
    const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
    const [loadingCep, setLoadingCep] = useState(false);
    const [loadingShipping, setLoadingShipping] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<string>('');

    const steps: CheckoutStep[] = [
        { id: 'address', title: 'Endereço' },
        { id: 'payment', title: 'Pagamento' },
        { id: 'review', title: 'Revisão' },
        { id: 'confirmation', title: 'Confirmação' },
    ];

    // Monitorar mudanças no total do carrinho e recalcular frete
    useEffect(() => {
        // Se já temos opções de frete calculadas, recalcular quando o total mudar
        if (shippingOptions.length > 0) {
            const freeShippingThreshold = 150;
            const isFreeShipping = total >= freeShippingThreshold;

            // Atualizar opções de frete com novos preços
            const updatedOptions = [
                {
                    service: 'Entrega Padrão',
                    deliveryTime: '40-60 minutos',
                    price: isFreeShipping ? 0 : 8.90
                },
                {
                    service: 'Retirada no Local',
                    deliveryTime: '15-20 minutos',
                    price: 0
                },
            ];
            setShippingOptions(updatedOptions);

            // Se tinha uma opção selecionada, atualizar com o novo preço
            if (selectedShipping) {
                const updatedSelection = updatedOptions.find(
                    opt => opt.service === selectedShipping.service
                );
                if (updatedSelection) {
                    setSelectedShipping(updatedSelection);
                }
            }
        }
    }, [total]);

    // Buscar endereço pelo CEP usando ViaCEP (API gratuita)
    async function fetchAddressByCep(cep: string) {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        setLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setAddressData(prev => ({
                    ...prev,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf,
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        } finally {
            setLoadingCep(false);
        }
    }

    // Calcular frete (simulação)
    async function calculateShipping() {
        if (!addressData.cep) return;

        setLoadingShipping(true);
        try {
            // Simulação de chamada de API de frete
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simular opções baseadas em valor do pedido
            const freeShippingThreshold = 150;
            const isFreeShipping = total >= freeShippingThreshold;

            setShippingOptions([
                {
                    service: 'Entrega Padrão',
                    deliveryTime: '40-60 minutos',
                    price: isFreeShipping ? 0 : 8.90
                },
                {
                    service: 'Retirada no Local',
                    deliveryTime: '15-20 minutos',
                    price: 0
                },
            ]);
        } catch (error) {
            console.error('Erro ao calcular frete:', error);
        } finally {
            setLoadingShipping(false);
        }
    }

    function handleFinishOrder() {
        // Simular processamento do pedido
        const orderId = Math.random().toString(36).substring(2, 9).toUpperCase();

        // Salvar dados do pedido no localStorage (simulação)
        const orderData = {
            id: orderId,
            items,
            total: total + (selectedShipping?.price || 0),
            address: addressData,
            shipping: selectedShipping,
            payment: paymentMethod,
            date: new Date().toISOString(),
        };
        localStorage.setItem('lastOrder', JSON.stringify(orderData));

        // Limpar carrinho
        clearCart();

        // Ir para confirmação
        setCurrentStep('confirmation');
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] pt-20 pb-12">
            <div className="max-w-5xl mx-auto px-4">
                {/* Progress steps */}
                <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => {
                        const stepIndex = steps.findIndex(s => s.id === currentStep);
                        const isActive = index === stepIndex;
                        const isCompleted = index < stepIndex;

                        return (
                            <div key={step.id} className="flex items-center flex-1">
                                <div className={`flex items-center gap-2 ${isActive ? 'text-red-500' : isCompleted ? 'text-green-500' : 'text-gray-500'
                                    }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isActive ? 'bg-red-500 text-white' :
                                        isCompleted ? 'bg-green-500 text-white' :
                                            'bg-white/10 text-gray-500'
                                        }`}>
                                        {isCompleted ? '✓' : index + 1}
                                    </div>
                                    <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-white/10'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Step: Address */}
                {currentStep === 'address' && (
                    items.length === 0 ? (
                        <div className="bg-[#1a1a1a] rounded-2xl p-8 text-center">
                            <span className="text-6xl mb-4 block">🍱</span>
                            <p className="text-gray-400 mb-6">Seu carrinho está vazio</p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                            >
                                Ver Cardápio
                            </button>
                        </div>
                    ) : (
                        <div className="bg-[#1a1a1a] rounded-2xl p-6">
                            <h2 className="text-white text-2xl font-bold mb-6">Endereço de entrega</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-400 text-sm block mb-2">CEP</label>
                                    <input
                                        type="text"
                                        value={addressData.cep}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                                            setAddressData(prev => ({ ...prev, cep: value }));
                                            if (value.length === 8) fetchAddressByCep(value);
                                        }}
                                        placeholder="00000-000"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500"
                                        disabled={loadingCep}
                                    />
                                    {loadingCep && <p className="text-gray-400 text-sm mt-1">Buscando endereço...</p>}
                                </div>

                                <div>
                                    <label className="text-gray-400 text-sm block mb-2">Rua</label>
                                    <input
                                        type="text"
                                        value={addressData.street}
                                        onChange={(e) => setAddressData(prev => ({ ...prev, street: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-gray-400 text-sm block mb-2">Número</label>
                                        <input
                                            type="text"
                                            value={addressData.number}
                                            onChange={(e) => setAddressData(prev => ({ ...prev, number: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-sm block mb-2">Complemento</label>
                                        <input
                                            type="text"
                                            value={addressData.complement}
                                            onChange={(e) => setAddressData(prev => ({ ...prev, complement: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500"
                                            placeholder="Opcional"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-gray-400 text-sm block mb-2">Bairro</label>
                                        <input
                                            type="text"
                                            value={addressData.neighborhood}
                                            onChange={(e) => setAddressData(prev => ({ ...prev, neighborhood: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-sm block mb-2">UF</label>
                                        <input
                                            type="text"
                                            value={addressData.state}
                                            onChange={(e) => setAddressData(prev => ({ ...prev, state: e.target.value.toUpperCase().slice(0, 2) }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500"
                                            maxLength={2}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-400 text-sm block mb-2">Cidade</label>
                                    <input
                                        type="text"
                                        value={addressData.city}
                                        onChange={(e) => setAddressData(prev => ({ ...prev, city: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => navigate('/')}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-lg transition-colors"
                                    >
                                        Voltar ao Menu
                                    </button>
                                    <button
                                        onClick={() => {
                                            calculateShipping();
                                            setCurrentStep('payment');
                                        }}
                                        disabled={!addressData.cep || !addressData.street || !addressData.number || !addressData.city || !addressData.state}
                                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                )}

                {/* Step: Payment & Shipping */}
                {currentStep === 'payment' && (
                    <div className="space-y-6">
                        {/* Shipping options */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-6">
                            <h2 className="text-white text-2xl font-bold mb-6">Opções de entrega</h2>
                            {loadingShipping ? (
                                <div className="flex justify-center py-8">
                                    <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {shippingOptions.map((option) => (
                                        <button
                                            key={option.service}
                                            onClick={() => setSelectedShipping(option)}
                                            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${selectedShipping?.service === option.service
                                                ? 'border-red-500 bg-red-500/10'
                                                : 'border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="text-left">
                                                <p className="text-white font-semibold">{option.service}</p>
                                                <p className="text-gray-400 text-sm">{option.deliveryTime}</p>
                                            </div>
                                            <span className="text-white font-bold">
                                                {option.price === 0 ? 'Grátis' : `R$ ${option.price.toFixed(2).replace('.', ',')}`}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment method */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-6">
                            <h2 className="text-white text-2xl font-bold mb-6">Forma de pagamento</h2>
                            <div className="space-y-3">
                                {[
                                    { id: 'credit', name: 'Cartão de Crédito', icon: '💳' },
                                    { id: 'debit', name: 'Cartão de Débito', icon: '💳' },
                                    { id: 'pix', name: 'PIX', icon: '📱' },
                                    { id: 'cash', name: 'Dinheiro', icon: '💵' }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${paymentMethod === method.id
                                            ? 'border-red-500 bg-red-500/10'
                                            : 'border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{method.icon}</span>
                                            <span className="text-white font-medium">{method.name}</span>
                                        </div>
                                        {paymentMethod === method.id && (
                                            <span className="text-red-500">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-6">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCurrentStep('address')}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-lg transition-colors"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={() => setCurrentStep('review')}
                                    disabled={!selectedShipping || !paymentMethod}
                                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                                >
                                    Revisar Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step: Review - Revisão Final */}
                {currentStep === 'review' && (
                    <div className="space-y-6">
                        {/* Itens do pedido */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-6">
                            <h2 className="text-white text-2xl font-bold mb-6">Itens do Pedido</h2>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex gap-4 items-center bg-white/5 rounded-xl p-4">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold">{item.product.name}</h3>
                                            <p className="text-gray-400 text-sm">Quantidade: {item.quantity}x</p>
                                        </div>
                                        <span className="text-white font-bold">
                                            R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Endereço de entrega */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-6">
                            <h2 className="text-white text-2xl font-bold mb-4">Endereço de Entrega</h2>
                            <div className="space-y-2 text-gray-300">
                                <p>{addressData.street}, {addressData.number}</p>
                                {addressData.complement && <p>{addressData.complement}</p>}
                                <p>{addressData.neighborhood}</p>
                                <p>{addressData.city} - {addressData.state}</p>
                                <p className="text-gray-400 text-sm">CEP: {addressData.cep}</p>
                            </div>
                        </div>

                        {/* Resumo do pedido */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-6">
                            <h2 className="text-white text-2xl font-bold mb-4">Resumo do Pedido</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-300">
                                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Entrega - {selectedShipping?.service}</span>
                                    <span>
                                        {selectedShipping?.price === 0
                                            ? 'Grátis'
                                            : `R$ ${selectedShipping?.price.toFixed(2).replace('.', ',')}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Tempo estimado</span>
                                    <span>{selectedShipping?.deliveryTime}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Forma de pagamento</span>
                                    <span>
                                        {paymentMethod === 'credit' && 'Cartão de Crédito'}
                                        {paymentMethod === 'debit' && 'Cartão de Débito'}
                                        {paymentMethod === 'pix' && 'PIX'}
                                        {paymentMethod === 'cash' && 'Dinheiro'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-white font-bold text-2xl pt-4 border-t border-white/10">
                                    <span>Total</span>
                                    <span>R$ {(total + (selectedShipping?.price || 0)).toFixed(2).replace('.', ',')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Botões de ação */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-6">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCurrentStep('payment')}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-lg transition-colors"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={handleFinishOrder}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
                                >
                                    Confirmar Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step: Confirmation */}
                {currentStep === 'confirmation' && (
                    <div className="bg-[#1a1a1a] rounded-2xl p-8 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-white text-3xl font-bold mb-2">Pedido Confirmado!</h2>
                        <p className="text-gray-400 mb-6">
                            Seu pedido foi realizado com sucesso e está sendo preparado.
                        </p>
                        <div className="bg-white/5 rounded-lg p-6 mb-6 space-y-3">
                            <div>
                                <p className="text-gray-400 text-sm">Número do pedido</p>
                                <p className="text-white font-bold text-2xl">
                                    #{JSON.parse(localStorage.getItem('lastOrder') || '{}').id}
                                </p>
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-gray-400 text-sm">Tempo estimado</p>
                                <p className="text-white font-semibold text-lg">
                                    {selectedShipping?.deliveryTime}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                        >
                            Voltar ao Cardápio
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
