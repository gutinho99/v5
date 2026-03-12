// ==========================================
// 1. CONFIGURAÇÕES E BANCO DE DATOS
// ==========================================
const products = [
    { id: 1, name: "PlayStation 5 Slim", price: 3499.90, brand: "Sony", category: "Eletrônicos", description: "O mais recente console com leitor de disco e 1TB de SSD ultrarrápido.", img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Galaxy Buds3 Pro", price: 999.90, brand: "Samsung", category: "Eletrônicos", description: "Fones de ouvido com cancelamento ativo de ruído inteligente.", img: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "DJI Mini 4 Pro", price: 4999.90, brand: "DJI", category: "Eletrônicos", description: "Drone leve e compacto com gravação em 4K HDR e detecção de obstáculos.", img: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Nintendo Switch OLED", price: 2199.90, brand: "Nintendo", category: "Games", description: "Versão premium com tela OLED de 7 polegadas e cores vibrantes.", img: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80&w=400" },
    { id: 5, name: "Mascara", price: 130.90, brand: "Kerastase", category: "Beleza", description: "Máscara de nutrição intensa para revitalizar cabelos ressecados.", img: "https://tse4.mm.bing.net/th/id/OIP.zQEaKcL9M0-6xa4WesdH0wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" }
];

let cart = [];
let valorFrete = 0;
const whatsappNumber = "5548996168426";
const taxasMaquininha = { 1: 5.99, 2: 11.39, 3: 12.49, 4: 13.09, 5: 13.79, 6: 14.49, 7: 15.49, 8: 16.09, 9: 16.69, 10: 17.39, 11: 18.39, 12: 18.79 };

// ==========================================
// 2. VITRINE E FILTROS
// ==========================================
function displayProducts(items) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = items.length ? '' : '<p class="col-span-full text-center py-20 text-gray-400">Nenhum produto encontrado.</p>';
    
    items.forEach(p => {
        grid.innerHTML += `
            <div class="bg-white rounded-lg md:rounded-2xl p-1.5 md:p-4 shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 group flex flex-col h-full overflow-hidden">
                <div class="relative bg-gray-50 rounded md:rounded-xl mb-1.5 md:mb-3 aspect-square flex items-center justify-center overflow-hidden">
                    <img src="${p.img}" class="object-cover w-full h-full group-hover:scale-110 transition duration-700">
                </div>
                <div class="flex-grow flex flex-col">
                    <span class="text-[6px] md:text-[10px] font-bold w-fit uppercase bg-brand-yellow/10 text-brand-yellow px-1 py-0.5 rounded truncate max-w-full">${p.brand}</span>
                    <h3 class="font-semibold md:font-bold text-[8px] md:text-sm text-gray-800 mt-1 line-clamp-2 leading-tight">${p.name}</h3>
                    
                    <p class="text-[7px] md:text-xs text-gray-500 mt-1 md:mt-2 line-clamp-2 leading-tight flex-grow">${p.description}</p>
                    
                    <div class="mt-1 md:mt-auto pt-1">
                        <p class="font-black text-[9px] md:text-xl text-brand-darker leading-none truncate">R$ ${p.price.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                </div>
                <div class="mt-1.5 pt-1.5 border-t border-gray-100 space-y-1 md:space-y-2">
                    <button onclick="openInstallmentModal('${p.name}', ${p.price})" class="w-full text-[7px] md:text-xs font-semibold text-gray-600 flex items-center justify-center gap-0.5 hover:text-brand-yellow transition">
                        <i class="fa-solid fa-calculator text-[8px] md:text-sm"></i> <span class="hidden md:inline">Simular Parcelas</span><span class="md:hidden">Parc.</span>
                    </button>
                    <button onclick="addToCart('${p.name}', ${p.price}, '${p.img}')" class="w-full bg-brand-darker text-white py-1 md:py-2.5 rounded md:rounded-lg text-[8px] md:text-sm font-bold hover:bg-brand-yellow hover:text-brand-darker transition-all flex items-center justify-center gap-1 shadow-sm">
                        <i class="fa-solid fa-cart-plus text-[8px] md:text-sm"></i> <span class="hidden md:inline">Adicionar</span><span class="md:hidden">+</span>
                    </button>
                </div>
            </div>`;
    });
}

function applyFilters() {
    const maxPrice = parseFloat(document.getElementById('filter-price').value);
    document.getElementById('price-label').innerText = `R$ ${maxPrice.toLocaleString('pt-BR')}`;
    const selectedCats = Array.from(document.querySelectorAll('#filter-categories input:checked')).map(i => i.value);
    const selectedBrands = Array.from(document.querySelectorAll('#filter-brands input:checked')).map(i => i.value);

    const filtered = products.filter(p => {
        const matchPrice = p.price <= maxPrice;
        const matchCat = selectedCats.length === 0 || selectedCats.includes(p.category);
        const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
        return matchPrice && matchCat && matchBrand;
    });
    displayProducts(filtered);
}

// ==========================================
// 3. LÓGICA DA CESTA
// ==========================================
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) updateCartUI();
    }
}

function addToCart(name, price, img) {
    const item = cart.find(i => i.name === name);
    if (item) { item.quantity++; } 
    else { cart.push({ name, price: parseFloat(price), img, quantity: 1 }); }
    updateCartUI();
    document.getElementById('cart-modal').classList.remove('hidden');
}

function changeQty(name, delta) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
        updateCartUI();
    }
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('cart-total');
    const subtotalDisplay = document.getElementById('cart-subtotal');
    const countBadge = document.getElementById('cart-count');
    
    if (!container) return;
    container.innerHTML = cart.length ? '' : '<p class="text-center py-10 text-gray-400">Cesta vazia</p>';
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        container.innerHTML += `
            <div class="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <img src="${item.img}" class="w-16 h-16 rounded-xl object-cover bg-gray-50">
                <div class="flex-grow min-w-0">
                    <h4 class="text-sm font-bold text-gray-800 truncate">${item.name}</h4>
                    <p class="text-brand-yellow font-black text-sm">R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    <div class="flex items-center gap-3 mt-2 bg-gray-100 w-fit rounded-lg p-1">
                        <button onclick="changeQty('${item.name}', -1)" class="w-6 h-6 flex items-center justify-center font-bold">-</button>
                        <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
                        <button onclick="changeQty('${item.name}', 1)" class="w-6 h-6 flex items-center justify-center font-bold">+</button>
                    </div>
                </div>
            </div>`;
    });

    const totalGeral = subtotal + valorFrete;
    if (subtotalDisplay) subtotalDisplay.innerText = `R$ ${subtotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    if (totalDisplay) totalDisplay.innerText = `R$ ${totalGeral.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    if (countBadge) {
        const qtd = cart.reduce((acc, i) => acc + i.quantity, 0);
        countBadge.innerText = qtd;
        countBadge.classList.toggle('hidden', qtd === 0);
    }
}

// ==========================================
// 4. FRETE E WHATSAPP
// ==========================================
async function calcularFrete() {
    const cep = document.getElementById('cep-input').value.replace(/\D/g, '');
    const resultadoDiv = document.getElementById('frete-resultado');
    if (cep.length !== 8) return alert("CEP inválido");

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (data.erro) return alert("CEP não encontrado");

        const cidade = data.localidade;
        const bairro = data.bairro;
        resultadoDiv.classList.remove('hidden');
        resultadoDiv.className = "mt-3 p-3 rounded-xl text-sm font-bold bg-gray-100";

        if (cidade === "Biguaçu") {
            const gratis = ["Centro", "Praia João Rosa", "Fundos", "Rio Caveiras"];
            valorFrete = gratis.includes(bairro) ? 0 : 5;
            resultadoDiv.innerHTML = valorFrete === 0 ? "🚚 Frete Grátis (Biguaçu)" : "🚚 Frete: R$ 5,00 (Biguaçu)";
        } else if (cidade === "São José") {
            valorFrete = 10;
            resultadoDiv.innerHTML = "🚚 Frete: R$ 10,00 (São José)";
        } else if (cidade === "Florianópolis" || cidade === "Palhoça") {
            valorFrete = 15;
            resultadoDiv.innerHTML = `🚚 Frete: R$ 15,00 (${cidade})`;
        } else {
            valorFrete = 0;
            resultadoDiv.innerHTML = "Consulte valor via WhatsApp";
        }
        updateCartUI();
    } catch (e) { alert("Erro ao buscar CEP"); }
}

function sendToWhatsApp() {
    if (cart.length === 0) return alert("Cesta vazia!");
    let msg = "Olá! *Quero saber mais sobre os produtos que selecionei no site.*\n\n--- *PRODUTOS* ---\n";
    cart.forEach(i => { msg += `• ${i.quantity}x ${i.name}\n`; });
    if (valorFrete > 0) msg += `\n*Frete:* R$ ${valorFrete.toFixed(2)}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ==========================================
// 5. CALCULADORA DE JUROS
// ==========================================
function openInstallmentModal(name, price) {
    const modal = document.getElementById('installment-modal');
    document.getElementById('modal-product-name').innerText = name;
    document.getElementById('modal-product-price').innerText = `À vista: R$ ${price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    
    const list = document.getElementById('installment-list');
    list.innerHTML = '';
    
    for (let i = 1; i <= 12; i++) {
        const taxa = taxasMaquininha[i] / 100;
        const totalV = price / (1 - taxa);
        const valorP = totalV / i;
        
        list.innerHTML += `
            <div class="flex justify-between p-2 bg-gray-50 rounded-lg text-sm border-b border-gray-100">
                <span class="font-bold">${i}x de R$ ${valorP.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span class="text-gray-400 text-[10px]">Total: R$ ${totalV.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>`;
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeInstallmentModal() {
    document.getElementById('installment-modal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => displayProducts(products));