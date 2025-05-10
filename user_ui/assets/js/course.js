const API_URL = 'https://681eaa1bc1c291fa6634b5ad.mockapi.io/api/v1';

// Lấy danh sách sản phẩm
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/courses`);
        if (!response.ok) throw new Error('Không thể tải sản phẩm');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

async function searchProducts(name) {
    try {
        const response = await fetch(`${API_URL}/courses?name=${name}`);
        if (!response.ok) throw new Error('Không thể tải sản phẩm');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Lấy chi tiết sản phẩm
async function fetchProductDetail(id) {
    try {
        const response = await fetch(`${API_URL}/courses/${id}`);
        if (!response.ok) throw new Error('Không thể tải chi tiết sản phẩm');
        return await response.json();
    } catch (error) {
        console.error('Error fetching product detail:', error);
        throw error;
    }
}

// Thêm sản phẩm mới
async function addProduct(productData) {
    try {
        const response = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error('Không thể thêm sản phẩm');
        return await response.json();
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
}

// Cập nhật sản phẩm
async function updateProduct(id, productData) {
    try {
        const response = await fetch(`${API_URL}/courses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error('Không thể cập nhật sản phẩm');
        return await response.json();
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

// Xóa sản phẩm
async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_URL}/courses/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Không thể xóa sản phẩm');
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

function createProductCard(product) {
    return `
        <div class="col-md-3 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image || 'assets/images/placeholder.jpg'}" 
                     class="card-img-top product-image" 
                     alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-truncate">${product.description}</p>
                    <p class="price fw-bold">${formatPrice(product.price)}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <a href="product-detail.html?id=${product.id}" class="btn btn-sm btn-primary">Xem chi tiết</a>
                    <button class="btn btn-sm btn-success add-to-cart" data-id="${product.id}">Thêm vào giỏ</button>
                </div>
            </div>
        </div>
    `;
}

// Hiển thị danh sách sản phẩm
async function renderProductList() {
    try {
        const products = await fetchProducts();
        const container = $('#productsContainer');
        container.empty();
        
        if (products.length === 0) {
            container.html('<div class="col-12 text-center py-5"><h5>Không có sản phẩm nào</h5></div>');
            return;
        }
        
        products.forEach(product => {
            container.append(createProductCard(product));
        });
    } catch (error) {
        console.error('Error rendering product list:', error);
        $('#productsContainer').html(`
            <div class="col-12 text-center text-danger py-5">
                <h5>Đã xảy ra lỗi khi tải sản phẩm</h5>
                <p>${error.message}</p>
            </div>
        `);
    }
}

// Hiển thị chi tiết sản phẩm
async function renderProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    try {
        const product = await fetchProductDetail(productId);
        $('#productName').text(product.title);
        $('#productImage').attr('src', product.image || 'assets/images/placeholder.jpg').attr('alt', product.title);
        $('#productPrice').text(formatPrice(product.price));
        $('#productDescription').text(product.description);
        $('#productCreatedAt').text(new Date(product.createdAt).toLocaleDateString());
        $('#addToCartBtn').attr('data-id', product.id);
    } catch (error) {
        console.error('Error rendering product detail:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể tải chi tiết sản phẩm'
        }).then(() => {
            window.location.href = 'products.html';
        });
    }
}

// Xử lý sự kiện thêm vào giỏ hàng
$(document).on('click', '.add-to-cart', function() {
    const productId = $(this).data('id');
    addToCart(productId);
});

// Xử lý trang sản phẩm
$(document).ready(function() {
    if ($('#productsContainer').length) {
        renderProductList();
    }
    
    if ($('#productDetailContainer').length) {
        renderProductDetail();
    }
});